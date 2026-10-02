import { useEffect } from "react"

const PLACEHOLDER_BY_TYPE: Record<string, string> = {
  date: "dd/mm/aaaa",
  "datetime-local": "dd/mm/aaaa --:--",
  email: "Digite o email",
  number: "Digite um valor",
  password: "Palavra-passe",
  search: "Pesquisar...",
  tel: "Digite o número",
  text: "Digite...",
}

function getPlaceholder(input: HTMLInputElement) {
  const context = `${input.getAttribute("aria-label") || ""} ${input.name || ""}`.toLowerCase()

  if (context.includes("email")) return "Digite o email"
  if (context.includes("telefone") || context.includes("phone")) return "Digite o número de telemóvel"
  if (context.includes("passaporte")) return "Passaporte"
  if (context.includes("nif")) return "Digite o NIF"
  if (context.includes("bi") || context.includes("bilhete")) return "Digite o bilhete de identidade"

  return PLACEHOLDER_BY_TYPE[input.type] || "Digite..."
}

function normalizeFormControls(root: ParentNode = document) {
  root.querySelectorAll<HTMLInputElement>("input:not([placeholder]):not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=reset])").forEach((input) => {
    input.setAttribute("placeholder", getPlaceholder(input))
    input.classList.add("ui-placeholder-managed")
  })

  root.querySelectorAll<HTMLSelectElement>("select:not([data-placeholder-normalized])").forEach((select) => {
    if (!select.querySelector('option[value=""]')) {
      const placeholder = document.createElement("option")
      placeholder.value = ""
      placeholder.textContent = select.dataset.placeholder || "Selecione..."
      placeholder.disabled = true
      placeholder.hidden = true
      select.insertBefore(placeholder, select.firstChild)
    }
    select.setAttribute("data-placeholder-normalized", "true")
  })
}

/** Adds a useful localized placeholder to legacy inputs during the migration. */
export function FormNormalizer() {
  useEffect(() => {
    normalizeFormControls()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLSelectElement) {
          mutation.target.removeAttribute("data-placeholder-normalized")
          normalizeFormControls(mutation.target.parentElement || document)
        }
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) normalizeFormControls(node)
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
