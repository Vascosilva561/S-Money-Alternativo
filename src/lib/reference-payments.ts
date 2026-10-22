import type { ReferencePaymentResponse, ReferencePaymentType } from "@/types/referencePayment"

const legacyFields = ["payment_id", "entity_code", "payment_reference", "operation_amount", "processing_date",
  "transaction_datetime", "payment_date", "payment_time", "product_code", "payment_location", "mft_status",
  "prt_status", "payment_status", "pdd_application", "log_id", "log_number", "terminal_type", "accounting_period",
  "local_transaction_id", "terminal_id", "currency_code", "optional_1", "optional_2", "optional_3"] as const

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

// Keep the redesigned views' model stable across the legacy and current API shapes.
export function normaliseReferencePayments(raw: unknown): ReferencePaymentResponse {
  const response = object(raw)
  const source = response.dados ?? response.payments
  const payments = (Array.isArray(source) ? source : []).filter((row) => row !== null && typeof row === "object" && !Array.isArray(row)).map((value) => {
    const row = object(value)
    return {
      ...row,
      ...Object.fromEntries(legacyFields.map((field) => [field, String(row[field] ?? "")])),
      operation_amount: String(row.operation_amount ?? row.value ?? ""),
      transaction_datetime: String(row.transaction_datetime ?? row.created_at ?? ""),
      applied_fee: row.applied_fee == null ? null : String(row.applied_fee),
      unit_quantity: row.unit_quantity == null ? null : String(row.unit_quantity),
      nib: row.nib == null ? null : String(row.nib),
      reference_channels: Array.isArray(row.reference_channels) ? row.reference_channels.map(String) : [],
    } as ReferencePaymentType
  })
  const total = response.total == null || String(response.total).trim() === "" ? undefined : Number(response.total)
  return {
    code: String(response.code ?? ""), payments,
    next_cursor: typeof response.next_cursor === "string" && response.next_cursor ? response.next_cursor : null,
    ...(total !== undefined && Number.isFinite(total) && total >= 0 ? { total } : {}),
  }
}
