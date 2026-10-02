const allowedTags = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li"])

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function sanitizeNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return escapeHtml(node.textContent ?? "")
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return ""
    }

    const element = node as Element
    const tagName = element.tagName.toLowerCase()
    const children = Array.from(element.childNodes, sanitizeNode).join("")

    if (tagName === "span" && (element as HTMLElement).style.textDecoration.includes("underline")) {
        return `<u>${children}</u>`
    }

    if (!allowedTags.has(tagName)) {
        return children
    }

    return tagName === "br" ? "<br>" : `<${tagName}>${children}</${tagName}>`
}

export function sanitizeFaqAnswerHtml(value?: string | null) {
    if (!value) {
        return ""
    }

    const documentValue = new DOMParser().parseFromString(value, "text/html")
    return Array.from(documentValue.body.childNodes, sanitizeNode).join("")
}
