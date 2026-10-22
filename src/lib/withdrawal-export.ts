import * as XLSX from "xlsx"
import type { DataLevanvamtosType } from "@/types/levantamentos"

export function buildWithdrawalExportRows(rows: DataLevanvamtosType[]) {
  return [...rows]
    .sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0))
    .map((item) => ({
      "Tipo de Conta": item.account_type === "User" ? "Particular" : "Empresa",
      "Nome": item.account?.business_name || [item.account?.first_name, item.account?.last_name].filter(Boolean).join(" ") || "Não disponível",
      "IBAN": String(item.iban ?? ""),
      "Valor": item.amount,
      "Data de Criação": Number.isFinite(Date.parse(item.created_at))
        ? new Date(item.created_at).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "—",
    }))
}

export function exportExcelRows(rows: Record<string, unknown>[], filename: string, sheetName = "Dados") {
  if (!rows.length) return
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function exportWithdrawals(rows: DataLevanvamtosType[]) {
  exportExcelRows(buildWithdrawalExportRows(rows), "lista-levantamentos", "Levantamentos")
}
