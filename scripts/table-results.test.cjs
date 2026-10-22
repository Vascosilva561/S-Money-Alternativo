const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const Module = require("node:module")
const { test } = require("node:test")
const React = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const ts = require("typescript")

// Exercise the real TSX component without adding a test runner dependency.
const filename = path.resolve(__dirname, "../src/components/ui/table-results.tsx")
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
}).outputText
const componentModule = new Module(filename, module)
componentModule.filename = filename
componentModule.paths = Module._nodeModulePaths(path.dirname(filename))
componentModule._compile(compiled, filename)
const { TableResultsHeader } = componentModule.exports

function render(overrides = {}) {
  return renderToStaticMarkup(React.createElement(TableResultsHeader, {
    label: "Pagamentos encontrados",
    visibleCount: 20,
    totalCount: 37,
    currentPage: 1,
    totalPages: 2,
    onPreviousPage() {},
    onNextPage() {},
    ...overrides,
  }))
}

function buttons(markup) {
  return [...markup.matchAll(/<button\b([^>]*)>/g)].map((match) => match[1])
}

test("shows visible results and the real total, preserving a partial last page", () => {
  assert.match(render(), /20 de 37/)
  assert.match(render({ visibleCount: 17, currentPage: 2 }), /17 de 37/)
  assert.match(render({ visibleCount: 0, totalCount: 0 }), /0 de 0/)
  assert.match(render({ visibleCount: 0 }), /0 de 37/)
  assert.match(render({ totalCount: "37" }), /20 de 37/)
})

test("cursor APIs without a valid total never infer one from page count", () => {
  for (const totalCount of [undefined, null, "", " ", "invalid", -1, NaN, Infinity]) {
    const markup = render({ totalCount, totalPages: 250 })
    assert.match(markup, /20 nesta página/)
    assert.doesNotMatch(markup, /20 de/)
  }
})

test("first, intermediate, last, empty and single pages have the correct bounds", () => {
  const first = buttons(render())
  assert.match(first[0], /disabled/)
  assert.doesNotMatch(first[1], /disabled/)
  const middle = buttons(render({ currentPage: 2, totalPages: 3 }))
  assert.ok(middle.every((button) => !button.includes("disabled")))
  const last = buttons(render({ currentPage: 2 }))
  assert.doesNotMatch(last[0], /disabled/)
  assert.match(last[1], /disabled/)
  for (const totalPages of [0, 1]) {
    assert.ok(buttons(render({ totalPages })).every((button) => button.includes("disabled")))
  }
})

test("loading announces progress and disables both directions", () => {
  const markup = render({ isLoading: true })
  assert.match(markup, /A carregar…/)
  assert.match(markup, /aria-busy="true"/)
  assert.match(markup, /role="status"/)
  assert.ok(buttons(markup).every((button) => button.includes("disabled")))
  assert.doesNotMatch(markup, /20 de 37/)
})

test("navigation invokes the callbacks supplied by the existing paginator", () => {
  const calls = []
  const element = TableResultsHeader({
    label: "Pagamentos encontrados", visibleCount: 20, currentPage: 2, totalPages: 3,
    onPreviousPage: () => calls.push("previous"), onNextPage: () => calls.push("next"),
  })
  const statusGroup = element.props.children[1]
  const navigation = statusGroup.props.children[1]
  navigation.props.children[0].props.onClick()
  navigation.props.children[1].props.onClick()
  assert.deepEqual(calls, ["previous", "next"])
})

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(target) : target.endsWith(".tsx") ? [target] : []
  })
}

test("every data table uses TableResults with the same pagination callbacks as its footer", () => {
  let tables = 0
  for (const file of sourceFiles(path.resolve(__dirname, "../src"))) {
    const source = fs.readFileSync(file, "utf8")
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const wrappers = new Set()
    const footers = []
    function visit(node) {
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === "PaginationFooter") footers.push(node)
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === "table") {
        tables++
        let ancestor = node.parent
        while (ancestor && !(ts.isJsxElement(ancestor) && ancestor.openingElement.tagName.getText(ast) === "TableResults")) ancestor = ancestor.parent
        assert.ok(ancestor, `Missing results header: ${path.relative(process.cwd(), file)}`)
        let layoutOwner = ancestor.parent
        while (layoutOwner && !(ts.isJsxElement(layoutOwner) && layoutOwner.openingElement.attributes.properties.some((attribute) =>
          ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === "className" && attribute.initializer?.getText(ast).includes("ui-data-stack")))) {
          layoutOwner = layoutOwner.parent
        }
        assert.ok(layoutOwner, `Missing shared list spacing: ${path.relative(process.cwd(), file)}`)
        wrappers.add(ancestor.openingElement)
      }
      ts.forEachChild(node, visit)
    }
    visit(ast)
    if (!wrappers.size) continue
    assert.equal(footers.length, 1, `Expected an unambiguous footer in ${file}`)
    const expression = (node, name) => node.attributes.properties.find((prop) => prop.name?.getText(ast) === name)?.initializer?.getText(ast)
    for (const wrapper of wrappers) {
      for (const prop of ["currentPage", "totalPages", "onPreviousPage", "onNextPage"]) {
        assert.equal(expression(wrapper, prop), expression(footers[0], prop), `${prop} differs from footer in ${file}`)
      }
    }
  }
  assert.ok(tables >= 34, `Expected all data tables to be checked; got ${tables}`)
})
