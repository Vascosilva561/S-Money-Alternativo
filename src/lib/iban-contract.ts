export const IBAN_PAGE_SIZE = 100

export function getIbanListPath(accountId: string | undefined, page: number) {
  if (!Number.isInteger(page) || page < 1) throw new Error("Página inválida.")
  if (accountId !== undefined && !accountId.trim()) throw new Error("Conta não identificada.")
  const path = accountId === undefined
    ? "/front/ibans/list_ibans_pending"
    : `/front/ibans/list/${encodeURIComponent(accountId)}`
  return `${path}?${new URLSearchParams({ per_page: String(IBAN_PAGE_SIZE), page: String(page) })}`
}

export function getIbanActionPath(id: string, action: "validate" | "reject") {
  if (!id.trim()) throw new Error("IBAN não identificado.")
  return `/front/ibans/${encodeURIComponent(id)}/${action}`
}
