const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const Module = require("node:module")
const { test } = require("node:test")
const ts = require("typescript")
const XLSX = require("xlsx")

function loadTs(relativePath, mocks = {}) {
  const filename = path.resolve(__dirname, "..", relativePath)
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText
  const loaded = new Module(filename, module)
  loaded.filename = filename
  loaded.paths = Module._nodeModulePaths(path.dirname(filename))
  const originalRequire = loaded.require.bind(loaded)
  loaded.require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : originalRequire(id)
  loaded._compile(compiled, filename)
  return loaded.exports
}

const { normaliseReferencePayments } = loadTs("src/lib/reference-payments.ts")
const { getIbanListPath, getIbanActionPath } = loadTs("src/lib/iban-contract.ts")

test("current reference API rows retain amount, merchant and financial data in the local view model", () => {
  const result = normaliseReferencePayments({ dados: [{ id: "42", payment_id: "pay", entity_code: "11269",
    value: "123456.78", cost: "2.50", profit_somoney: "1.20", created_at: "2026-10-21T12:00:00Z",
    merchant: { id: "merchant-uuid", business_name: "Empresa" }, payment_status: "completed" }], total: "101" })
  assert.equal(result.payments[0].operation_amount, "123456.78")
  assert.equal(result.payments[0].transaction_datetime, "2026-10-21T12:00:00Z")
  assert.equal(result.payments[0].cost, "2.50")
  assert.equal(result.payments[0].profit_somoney, "1.20")
  assert.equal(result.payments[0].merchant.id, "merchant-uuid")
  assert.equal(result.total, 101)
  assert.equal(result.next_cursor, null)
})

test("legacy cursor responses keep their original amount, date, channels and processing fields", () => {
  const result = normaliseReferencePayments({ payments: [{ operation_amount: "0.00", value: "9.99",
    transaction_datetime: "2026-01-01", created_at: "2026-10-21", prt_status: "PENDING", reference_channels: ["M"] }], next_cursor: "opaque-cursor" })
  assert.equal(result.payments[0].operation_amount, "0.00")
  assert.equal(result.payments[0].transaction_datetime, "2026-01-01")
  assert.equal(result.payments[0].prt_status, "PENDING")
  assert.deepEqual(result.payments[0].reference_channels, ["M"])
  assert.equal(result.next_cursor, "opaque-cursor")
  assert.equal(result.total, undefined)
  assert.equal(result.payments[0].nib, null)
})

test("malformed totals and non-record entries never invent a zero count or produce table crashes", () => {
  for (const total of [undefined, null, "", " ", "invalid", -1, Infinity]) {
    assert.equal(normaliseReferencePayments({ dados: [null, [], "bad"], total }).total, undefined)
    assert.deepEqual(normaliseReferencePayments({ dados: [null, [], "bad"], total }).payments, [])
  }
  assert.equal(normaliseReferencePayments({ dados: [], total: 0 }).total, 0)
})

test("IBAN queries distinguish pending requests from account lists and never fall back from an empty account to all accounts", () => {
  assert.equal(getIbanListPath(undefined, 1), "/front/ibans/list_ibans_pending?per_page=100&page=1")
  assert.equal(getIbanListPath("merchant/id", 2), "/front/ibans/list/merchant%2Fid?per_page=100&page=2")
  assert.throws(() => getIbanListPath("", 1))
  assert.throws(() => getIbanListPath("  ", 1))
  for (const page of [0, -1, 1.5, NaN]) assert.throws(() => getIbanListPath(undefined, page))
  assert.equal(getIbanActionPath("iban/id", "validate"), "/front/ibans/iban%2Fid/validate")
  assert.equal(getIbanActionPath("iban-id", "reject"), "/front/ibans/iban-id/reject")
  assert.throws(() => getIbanActionPath("", "validate"))
})

test("Excel round trip preserves leading IBAN zeroes and amount precision without changing the visible row ordering", () => {
  let saved
  const exporter = loadTs("src/lib/withdrawal-export.ts", { xlsx: { ...XLSX, writeFile: (workbook, filename) => { saved = { workbook, filename } } } })
  const rows = [
    { created_at: "2026-10-22T12:00:00Z", account_type: "Merchant", iban: "000123456789", amount: "123456.78", account: { business_name: "Empresa" } },
    { created_at: "2026-10-21T12:00:00Z", account_type: "User", iban: "000987654321", amount: "0.01", account: { first_name: "Ana", last_name: "Silva" } },
  ]
  exporter.exportWithdrawals(rows)
  assert.equal(rows[0].account.business_name, "Empresa")
  assert.equal(saved.filename, "lista-levantamentos.xlsx")
  const actual = XLSX.utils.sheet_to_json(saved.workbook.Sheets.Levantamentos)
  assert.equal(actual[0].Nome, "Ana Silva")
  assert.equal(actual[1]["Tipo de Conta"], "Empresa")
  assert.equal(actual[0].IBAN, "000987654321")
  assert.equal(actual[1].Valor, "123456.78")
  assert.equal(exporter.buildWithdrawalExportRows([{ created_at: "bad", account_type: "User" }])[0]["Data de Criação"], "—")
})

test("Financeiro receives the team's bank permissions while the local administration permissions remain", () => {
  const { ROLE_PERMISSIONS, canViewMenu } = loadTs("src/components/permissions-profile/permissions.ts")
  assert.equal(ROLE_PERMISSIONS.financeiro.bancos, "manage")
  assert.equal(canViewMenu("faqs", "financeiro"), false)
  assert.equal(canViewMenu("referencias", "admin"), true)
  assert.equal(canViewMenu("referencias", "superadmin"), true)
})
