import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import { Checkbox } from "@/components/ui/checkbox"
import { generatePaginationRange } from "@/hooks/generatePaginationRange"
import DetalhesMovimentos from "@/components/movimentos/details"
import DetalhesPagamentoReference from "@/components/pagamento-referenecia/detailsPayment"
import DetalhesDepositoReference from "@/components/pagamento-referenecia/detailsDeposit"
import DetalhesDeposito from "@/components/depositGPO/details"
import DetalhesPagamento from "@/components/pagamentos/detalhes"
import DetalhesPagamentoGPO from "@/components/pagamentosGPO/details"
import DetalhesLevantamento from "@/components/levantamentos/details"
import ExpandirLevantamentosProcessados from "@/components/expandirLevantamento/expandirProcessados"
import { ListaManagers } from "@/hooks/getManagers"
import DetalhesTransferencia from "@/components/tranferenciaSOmoney/detalhes"
import ExpandirTransferencias from "@/components/tranferenciaSOmoney/expandirTransferencias"
import { formatDateTime, formatNumberPtAO } from "@/components/utils/formmat"
import GetServicesIcon from "@/components/utils/getServicesIcon"
import { TableActionButton } from "@/components/ui/table-action-button"
import { TableRowExpandButton } from "@/components/ui/table-row-expand-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { statusDeposit } from "@/components/utils/statusDeposit"
import { statusDepositColor } from "@/components/utils/statusDepositColor"
import { statusLevantamento } from "@/components/utils/getStatusLevantamentos"
import { statusLevantamentoColor } from "@/components/utils/statusLevantamentoColor"
import { statusMovimento } from "@/components/utils/statusMoviment"
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor"
import { statusPayment } from "@/components/utils/statusPayment"
import { statusPaymentColor } from "@/components/utils/statusPaymentColor"
import { statusPaymentGPOLabel } from "@/components/utils/statusPaymentGPOLabel"
import { statusPaymentGPOColor } from "@/components/utils/statusPaymentGPO"
import { statusTransactions } from "@/components/utils/statusTransactions"
import { statusTransactionsColor } from "@/components/utils/statusTransactionsColor"
import { TypeTransaction } from "@/components/utils/getTypeMoviment"
import { PegaOrigemMovimento } from "@/components/utils/origemMovimento"
import { tipo_de_Terminal } from "@/components/utils/canalType"
import { exportExcelRows } from "@/lib/withdrawal-export"
import { hasActiveFilterValues } from "@/lib/filter-utils"
import { PegaDestinoMovimento } from "@/components/utils/destinoMovimento"
import { GetAmount } from "@/components/utils/getAmount"
import TipoDeTransacaoIcon from "@/assets/tipoDeMovimentoIcon"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/ui/kpi-card"
import { DateField, FormField, NativeSelectField, TextField } from "@/components/ui/form-field"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Check,
  Download,
  FileDown,
  Filter,
  RefreshCw,
  ReceiptText,
  Search,
  TrendingUp,
  X,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useUserContext, type UserContextAccount } from "@/pages/user_context_types"
import type { ReferencePaymentType } from "@/types/referencePayment"
import type { ReferenceDepositType } from "@/types/reference_deposit"
import type { GpoPayment } from "@/types/gpoPayment"

export type UserContextOperationKey =
  | "transferencias"
  | "pagamentos"
  | "pagamentos-referencia"
  | "depositos-referencia"
  | "pagamentos-gpo"
  | "pagamento-gpo"
  | "depositos"
  | "levantamentos"
  | "conta-corrente"

const operationResultsLabels: Record<UserContextOperationKey, string> = {
  transferencias: "Transferências encontradas",
  pagamentos: "Pagamentos encontrados",
  "pagamentos-referencia": "Pagamentos encontrados",
  "depositos-referencia": "Depósitos encontrados",
  "pagamentos-gpo": "Pagamentos encontrados",
  "pagamento-gpo": "Depósitos encontrados",
  depositos: "Depósitos encontrados",
  levantamentos: "Levantamentos encontrados",
  "conta-corrente": "Movimentos encontrados",
}

type ContextRow = Record<string, unknown>

type ContextResponse = {
  dados: ContextRow[]
  total?: string | number
  next_cursor?: string | null
  total_amount?: string | number
  total_payment?: string | number
  total_entrada?: string | number
  total_saida?: string | number
}

type OperationColumn = {
  label: string
  render: (row: ContextRow) => ReactNode
  className?: string
}

type OperationDefinition = {
  title: string
  description: string
  columns: OperationColumn[]
  detail: "transfer" | "payment" | "reference" | "referenceDeposit" | "paymentGpo" | "gpo" | "withdrawal" | "movement"
  endpoint: string
}

type ActionState = {
  type: "confirm" | "reject"
  row?: ContextRow
  ids?: string[]
}

type MovementFilters = {
  signal: string
  transactionType: string
  minimumAmount: string
  maximumAmount: string
}

type TransferFilters = {
  counterparty: string
  counterpartyType: string
  minimumAmount: string
  maximumAmount: string
}

type PaymentFilters = {
  beneficiary: string
  service: string
  paymentReference: string
  paymentId: string
  paymentStatus: string
  mftStatus: string
  prtStatus: string
  transactionReference: string
  phoneNumber: string
  externalPaymentId: string
  channel: string
  minimumAmount: string
  maximumAmount: string
}

type WithdrawalFilters = {
  iban: string
  responsible: string
  minimumAmount: string
  maximumAmount: string
}

type ContextFilterDraft = MovementFilters & TransferFilters & PaymentFilters & WithdrawalFilters & {
  status: string
  dateStart: string
  dateEnd: string
}

const emptyMovementFilters: MovementFilters = {
  signal: "",
  transactionType: "",
  minimumAmount: "",
  maximumAmount: "",
}

const emptyTransferFilters: TransferFilters = {
  counterparty: "",
  counterpartyType: "",
  minimumAmount: "",
  maximumAmount: "",
}

const emptyPaymentFilters: PaymentFilters = {
  beneficiary: "",
  service: "",
  paymentReference: "",
  paymentId: "",
  paymentStatus: "",
  mftStatus: "",
  prtStatus: "",
  transactionReference: "",
  phoneNumber: "",
  externalPaymentId: "",
  channel: "",
  minimumAmount: "",
  maximumAmount: "",
}

const emptyWithdrawalFilters: WithdrawalFilters = {
  iban: "",
  responsible: "",
  minimumAmount: "",
  maximumAmount: "",
}

const paymentServiceOptions = [
  "UNITEL",
  "ENDE",
  "MOVICEL",
  "AFRICELL",
  "ELEPHANTBET",
  "DSTV",
  "BANTUBET",
  "ZAP",
  "ZAP FIBRA",
  "PREMIERBET",
]

type PaymentSummary = {
  total_custo: string | number
  total_lucro: string | number
}

function valueAsNumber(value: unknown) {
  if (typeof value === "number") return value
  if (typeof value !== "string" || !value.trim()) return undefined

  const normalized = value.trim().replace(/\s/g, "")
  const numberValue = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized)

  return Number.isFinite(numberValue) ? numberValue : undefined
}

function formatAmount(value: unknown) {
  const numberValue = valueAsNumber(value)
  return numberValue === undefined ? "—" : `${formatNumberPtAO(numberValue, 2)} Kz`
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "—"
  return formatDateTime(value, value)
}

function getObject(value: unknown): ContextRow | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as ContextRow : undefined
}

function getString(row: ContextRow, key: string) {
  const value = row[key]
  return value === undefined || value === null ? "" : String(value)
}

function getNestedValue(row: ContextRow, path: string[]) {
  let current: unknown = row
  for (const key of path) {
    const object = getObject(current)
    if (!object) return undefined
    current = object[key]
  }
  return current
}

function getRowAmount(row: ContextRow) {
  return row.amount
    ?? row.valor
    ?? row.montante
    ?? row.operation_amount
    ?? row.value
    ?? getNestedValue(row, ["detalhe", "transaction", "amount"])
    ?? getNestedValue(row, ["detalhe", "withdrawal", "amount"])
    ?? getNestedValue(row, ["detalhe", "pgs_payment", "amount"])
    ?? getNestedValue(row, ["detalhe", "deposit_gpo_frame", "amount"])
    ?? getNestedValue(row, ["detalhe", "payment_references", "amount"])
}

function getRowDate(row: ContextRow) {
  return row.transaction_datetime
    ?? row.payment_date
    ?? row.created_at
    ?? getNestedValue(row, ["detalhe", "transaction", "created_at"])
    ?? getNestedValue(row, ["detalhe", "withdrawal", "created_at"])
}

function getRowStatus(row: ContextRow) {
  return String(row.payment_status ?? row.status ?? getNestedValue(row, ["detalhe", "transaction", "status"]) ?? "")
}

function getReferenceDepositStatus(status: string) {
  switch (status.toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return "Concluído"
    case "PENDING":
      return "Pendente"
    case "FAILED":
    case "ERROR":
    case "REJECTED":
      return "Falhou"
    case "REFUNDED":
      return "Reembolsado"
    default:
      return status || "—"
  }
}

function getReferenceDepositStatusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-[#CFE7D7] text-[#0D9339]"
    case "REFUNDED":
      return "bg-[#F3CFFF] text-[#7100C8]"
    default:
      return statusPaymentColor(status) || neutralStatusClasses
  }
}

function getReferenceDepositAccountName(row: ContextRow) {
  const account = getObject(row.account)
  if (!account) return "—"
  const accountName = [getString(account, "first_name"), getString(account, "last_name")].filter(Boolean).join(" ")
  return getString(account, "business_name") || accountName || getString(account, "name") || getString(account, "email") || "—"
}

function getSpecialOperationSearchValues(row: ContextRow, operation: UserContextOperationKey) {
  const status = getRowStatus(row)
  const date = formatDate(getRowDate(row))
  if (operation === "pagamentos-referencia") {
    return [getString(row, "payment_id"), getString(row, "entity_code"), getString(row, "payment_reference"), getString(row, "transaction_reference"), getString(row, "payment_status"), getString(row, "mft_status"), getString(row, "prt_status"), getString(row, "payment_location"), getString(row, "product_code"), getString(row, "terminal_type"), getString(row, "nib"), getTerminalLabel(getString(row, "channel")), date, status ? getReferenceDepositStatus(status) : ""]
  }
  if (operation === "depositos-referencia") {
    const account = getObject(row.account)
    return [getString(row, "id"), getString(row, "id_transaction"), getString(row, "period_id"), getString(row, "reference"), getReferenceDepositAccountName(row), getString(account || {}, "email"), String(getRowAmount(row) ?? ""), getString(row, "status"), getTerminalLabel(getString(row, "channel")), date, status ? getReferenceDepositStatus(status) : ""]
  }
  if (operation === "pagamentos-gpo") {
    const merchant = getObject(row.merchant)
    return [
      getString(row, "payment_id"),
      getString(merchant || {}, "business_name"),
      getString(row, "merchant_number"),
      getString(row, "payment_reference"),
      getString(row, "transaction_reference"),
      getString(row, "phone_number"),
      getString(row, "external_payment_id"),
      getString(row, "external_customer_id"),
      String(getRowAmount(row) ?? ""),
      getString(row, "status"),
      statusPaymentGPOLabel(status),
      date,
    ]
  }
  if (operation === "pagamento-gpo") {
    return [
      getString(row, "canal"),
      date,
      status ? statusDeposit(status) || status : "",
    ]
  }
  return []
}

function getMovementLabel(row: ContextRow) {
  const signal = getString(row, "signal").toUpperCase()
  if (signal === "CREDIT") return "Crédito"
  if (signal === "DEBIT") return "Débito"
  return "—"
}

function getMovementAmount(row: ContextRow) {
  const amount = GetAmount(row) || "0,00"
  return `${getString(row, "signal").toUpperCase() === "DEBIT" ? "-" : ""}${amount} Kz`
}

const neutralStatusClasses = "bg-[#F2F4F7] text-[#536176]"

function getStatusDisplay(row: ContextRow, detail: OperationDefinition["detail"]) {
  if (detail === "movement") {
    const label = statusMovimento(row) || "—"
    return { label, classes: statusMovimentoColor(label) || neutralStatusClasses }
  }

  const status = getRowStatus(row)
  switch (detail) {
    case "transfer":
      return { label: statusTransactions(status) || "—", classes: statusTransactionsColor(status) || neutralStatusClasses }
    case "payment":
      return { label: statusPayment(status) || "—", classes: statusPaymentColor(status) || neutralStatusClasses }
    case "reference":
      return { label: getReferenceDepositStatus(status), classes: getReferenceDepositStatusClasses(status) }
    case "referenceDeposit":
      return { label: getReferenceDepositStatus(status), classes: getReferenceDepositStatusClasses(status) }
    case "paymentGpo":
      return { label: statusPaymentGPOLabel(status), classes: statusPaymentGPOColor(status) }
    case "gpo":
      return { label: statusDeposit(status) || status || "—", classes: statusDepositColor(status) || neutralStatusClasses }
    case "withdrawal":
      return { label: statusLevantamento(status) || "—", classes: statusLevantamentoColor(status) || neutralStatusClasses }
    default:
      return { label: "—", classes: neutralStatusClasses }
  }
}

function StatusBadge({ row, detail }: { row: ContextRow; detail: OperationDefinition["detail"] }) {
  const { label, classes } = getStatusDisplay(row, detail)
  return <span className={`ui-status-tag ${classes}`}>{label}</span>
}

function getUserName(user: UserContextAccount) {
  if (user.account_type === "Merchant" || user.business_name) return user.business_name || ""
  return [user.first_name, user.last_name].filter(Boolean).join(" ")
}

function getAccountType(user: UserContextAccount) {
  return user.account_type || (user.business_name ? "Merchant" : "User")
}

function getTerminalLabel(value: string) {
  return tipo_de_Terminal.find((terminal) => terminal.value === value)?.description || value || "—"
}

function getCommonColumns(detail: OperationDefinition["detail"]): OperationColumn[] {
  return [
    {
      label: "ID",
      render: (row) => <span className="font-mono text-xs">{getString(row, "id") || "—"}</span>,
      className: "min-w-[145px]",
    },
    {
      label: "Valor",
      render: (row) => <span className="font-semibold">{formatAmount(getRowAmount(row))}</span>,
      className: "min-w-[120px]",
    },
    {
      label: "Data",
      render: (row) => formatDate(getRowDate(row)),
      className: "ui-date-column min-w-[155px]",
    },
    {
      label: "Estado",
      render: (row) => <StatusBadge row={row} detail={detail} />,
      className: "min-w-[120px]",
    },
  ]
}

const operationDefinitions: Record<UserContextOperationKey, OperationDefinition> = {
  transferencias: {
    title: "Transferências",
    description: "Transferências enviadas e recebidas pela conta seleccionada.",
    endpoint: "/front/transaction",
    detail: "transfer",
    columns: [
      {
        label: "Remetente",
        render: (row) => (
          <span className="flex min-w-0 items-center gap-1.5 font-semibold">
            <span className="min-w-0 truncate">{getString(row, "sender_name") || "—"}</span>
            <CopyTextButton value={getString(row, "sender_name")} label="remetente" />
          </span>
        ),
        className: "min-w-[180px]",
      },
      {
        label: "Destinatário",
        render: (row) => (
          <span className="flex min-w-0 items-center gap-1.5 font-semibold">
            <span className="min-w-0 truncate">{getString(row, "receiver_name") || "—"}</span>
            <CopyTextButton value={getString(row, "receiver_name")} label="destinatário" />
          </span>
        ),
        className: "min-w-[180px]",
      },
      ...getCommonColumns("transfer").slice(1),
    ],
  },
  pagamentos: {
    title: "Pagamentos",
    description: "Pagamentos de serviços associados à conta seleccionada.",
    endpoint: "/front/pgs_payment",
    detail: "payment",
    columns: [
      {
        label: "Beneficiário",
        render: (row) => {
          const beneficiary = getString(row, "beneficiario")
          return (
            <span className="flex min-w-0 items-center gap-1.5 font-semibold">
              <span className="min-w-0 truncate" title={beneficiary || "—"}>{beneficiary || "—"}</span>
              <CopyTextButton value={beneficiary} label="beneficiário" />
            </span>
          )
        },
        className: "min-w-[180px]",
      },
      {
        label: "Serviço",
        render: (row) => {
          const serviceName = getString(row, "entity") || getString(row, "product_name")
          return (
            <span className="flex items-center gap-1.5 font-semibold">
              {serviceName && <span aria-hidden="true" className="shrink-0">{GetServicesIcon(serviceName.trim().toUpperCase())}</span>}
              <span>{serviceName || "—"}</span>
            </span>
          )
        },
        className: "min-w-[180px]",
      },
      {
        label: "Produto",
        render: (row) => getString(row, "product_name") || "—",
        className: "min-w-[180px]",
      },
      ...getCommonColumns("payment").slice(1),
    ],
  },
  "pagamentos-referencia": {
    title: "Pag. Referência",
    description: "Pagamentos por referência associados à conta seleccionada.",
    endpoint: "/front/payment_reference",
    detail: "reference",
    columns: [
      {
        label: "Pagamento",
        render: (row) => {
          const paymentId = getString(row, "payment_id") || getString(row, "id_transaction") || getString(row, "id")
          return (
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{paymentId || "—"}</span>
              {paymentId && <CopyTextButton value={paymentId} label="ID do pagamento" />}
            </div>
          )
        },
        className: "min-w-[180px]",
      },
      {
        label: "Entidade",
        render: (row) => getString(row, "entity_code") || "—",
        className: "min-w-[120px]",
      },
      {
        label: "Referência",
        render: (row) => {
          const reference = getString(row, "payment_reference") || getString(row, "reference")
          return (
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-semibold">{reference || "—"}</span>
              {reference && <CopyTextButton value={reference} label="referência" />}
            </div>
          )
        },
        className: "min-w-[160px]",
      },
      ...getCommonColumns("reference").slice(1),
    ],
  },
  "depositos-referencia": {
    title: "Depósitos por Referência",
    description: "Depósitos por referência associados à conta seleccionada.",
    endpoint: "/front/payment_reference",
    detail: "referenceDeposit",
    columns: [
      {
        label: "Pagamento",
        render: (row) => {
          const paymentId = getString(row, "id_transaction") || getString(row, "id")
          return (
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{paymentId || "—"}</span>
              {paymentId && <CopyTextButton value={paymentId} label="ID da transação" />}
            </div>
          )
        },
        className: "min-w-[180px]",
      },
      {
        label: "Titular",
        render: (row) => getReferenceDepositAccountName(row),
        className: "min-w-[180px]",
      },
      {
        label: "Referência",
        render: (row) => {
          const reference = getString(row, "reference")
          return (
            <span className="flex min-w-0 items-center gap-1.5 font-semibold">
              <span className="truncate">{reference || "—"}</span>
              {reference && <CopyTextButton value={reference} label="referência" />}
            </span>
          )
        },
        className: "min-w-[150px]",
      },
      {
        label: "Canal",
        render: (row) => getTerminalLabel(getString(row, "channel")) || "—",
        className: "min-w-[130px]",
      },
      {
        label: "Valor",
        render: (row) => <span className="font-semibold">{formatAmount(getRowAmount(row))}</span>,
        className: "min-w-[120px]",
      },
      {
        label: "Data",
        render: (row) => formatDate(getRowDate(row)),
        className: "ui-date-column min-w-[155px]",
      },
      {
        label: "Estado",
        render: (row) => <StatusBadge row={row} detail="referenceDeposit" />,
        className: "min-w-[120px]",
      },
    ],
  },
  "pagamentos-gpo": {
    title: "Pagamentos GPO",
    description: "Pagamentos GPO associados à empresa seleccionada.",
    endpoint: "/front/gpo_payments",
    detail: "paymentGpo",
    columns: [
      {
        label: "Referência",
        render: (row) => {
          const reference = getString(row, "payment_reference")
          return <span className="font-semibold">{reference || "—"}</span>
        },
        className: "min-w-[150px]",
      },
      {
        label: "Referência da transação",
        render: (row) => getString(row, "transaction_reference") || "—",
        className: "min-w-[180px]",
      },
      {
        label: "Valor",
        render: (row) => <span className="font-semibold">{formatAmount(getRowAmount(row))}</span>,
        className: "min-w-[120px]",
      },
      {
        label: "Telefone",
        render: (row) => getString(row, "phone_number") || "—",
        className: "min-w-[130px]",
      },
      {
        label: "Data",
        render: (row) => formatDate(getRowDate(row)),
        className: "ui-date-column min-w-[155px]",
      },
      {
        label: "Estado",
        render: (row) => <StatusBadge row={row} detail="paymentGpo" />,
        className: "min-w-[120px]",
      },
    ],
  },
  "pagamento-gpo": {
    title: "Depósitos por GPO",
    description: "Operações GPO ligadas à conta seleccionada.",
    endpoint: "/front/deposit_gpo_frame",
    detail: "gpo",
    columns: [
      {
        label: "Referência",
        render: (row) => <span className="font-semibold">{getString(row, "payment_reference") || getString(row, "reference") || "—"}</span>,
        className: "min-w-[170px]",
      },
      {
        label: "Valor recebido",
        render: (row) => <span className="font-semibold">{formatAmount(getRowAmount(row))}</span>,
        className: "min-w-[140px]",
      },
      {
        label: "Canal",
        render: (row) => getString(row, "canal") || "—",
        className: "min-w-[120px]",
      },
      {
        label: "Data",
        render: (row) => formatDate(getRowDate(row)),
        className: "ui-date-column min-w-[155px]",
      },
      {
        label: "Estado do depósito",
        render: (row) => <StatusBadge row={row} detail="gpo" />,
        className: "min-w-[150px]",
      },
    ],
  },
  depositos: {
    title: "Depósitos",
    description: "Movimentos de depósito associados à conta seleccionada.",
    endpoint: "/front/activities",
    detail: "movement",
    columns: [
      {
        label: "Operação",
        render: () => <span className="font-semibold">Depósito</span>,
        className: "min-w-[170px]",
      },
      {
        label: "Movimento",
        render: (row) => getString(row, "signal") || "—",
        className: "min-w-[120px]",
      },
      ...getCommonColumns("movement").slice(1),
    ],
  },
  levantamentos: {
    title: "Levantamentos",
    description: "Pedidos de levantamento da conta, incluindo as acções de processar e recusar.",
    endpoint: "/front/withdrawal",
    detail: "withdrawal",
    columns: [
      {
        label: "IBAN",
        render: (row) => <span className="max-w-[220px] truncate font-semibold" title={getString(row, "iban")}>{getString(row, "iban") || "—"}</span>,
        className: "min-w-[200px]",
      },
      ...getCommonColumns("withdrawal").slice(1),
    ],
  },
  "conta-corrente": {
    title: "Movimentos",
    description: "Movimentos que afectam a conta seleccionada, com a mesma leitura operacional da área geral.",
    endpoint: "/front/activities",
    detail: "movement",
    columns: [
      {
        label: "Movimento",
        render: (row) => {
          const isCredit = getString(row, "signal").toUpperCase() === "CREDIT"
          const label = getMovementLabel(row)
          return (
            <span className="flex items-center gap-1.5">
              <span className={`ui-movement-direction-icon grid size-8 shrink-0 place-items-center rounded-full ${isCredit ? "bg-[#E5F5EA] text-[#0A7A31]" : "bg-[#FDECEC] text-[#B42318]"}`} aria-hidden="true">
                {isCredit ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
              </span>
              <span className="font-semibold">{label}</span>
            </span>
          )
        },
        className: "min-w-[145px]",
      },
      {
        label: "Transação",
        render: (row) => {
          const type = getString(row, "type")
          return (
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="shrink-0">{TipoDeTransacaoIcon(type)}</span>
              <span>{TypeTransaction(type) || "—"}</span>
            </span>
          )
        },
        className: "min-w-[165px]",
      },
      {
        label: "Valor",
        render: (row) => <span className={`font-semibold ${getString(row, "signal").toUpperCase() === "CREDIT" ? "text-[#0D9339]" : "text-[#EF4A00]"}`}>{getMovementAmount(row)}</span>,
        className: "min-w-[115px]",
      },
      {
        label: "Origem",
        render: (row) => {
          const origin = String(PegaOrigemMovimento(row) || "")
          return (
            <div className="flex min-w-0 items-center gap-1.5" title={origin || "—"}>
              <span className="min-w-0 truncate font-semibold">{origin || "—"}</span>
              <CopyTextButton value={origin} label="origem" />
            </div>
          )
        },
        className: "min-w-[160px]",
      },
      {
        label: "Destino",
        render: (row) => {
          const destination = String(PegaDestinoMovimento(row) || "")
          return (
            <div className="flex min-w-0 items-center gap-1.5" title={destination || "—"}>
              <span className="min-w-0 truncate font-semibold">{destination || "—"}</span>
              <CopyTextButton value={destination} label="destino" />
            </div>
          )
        },
        className: "min-w-[160px]",
      },
      ...getCommonColumns("movement").slice(2),
    ],
  },
}

function normaliseResponse(data: unknown): ContextResponse {
  const response = getObject(data)
  const rows = response?.dados ?? response?.payments
  return {
    dados: Array.isArray(rows)
      ? rows.flatMap((row) => {
          const object = getObject(row)
          if (!object) return []
          if (object.payment_id && object.entity_code !== undefined) return [{ ...object, operation_amount: object.operation_amount ?? object.value, transaction_datetime: object.transaction_datetime ?? object.created_at }]
          return [object]
        })
      : [],
    total: response?.total as string | number | undefined,
    next_cursor: typeof response?.next_cursor === "string" ? response.next_cursor : null,
    total_amount: response?.total_amount as string | number | undefined,
    total_payment: response?.total_payment as string | number | undefined,
    total_entrada: response?.total_entrada as string | number | undefined,
    total_saida: response?.total_saida as string | number | undefined,
  }
}

function sumValues(first: unknown, second: unknown) {
  const firstNumber = valueAsNumber(first) || 0
  const secondNumber = valueAsNumber(second) || 0
  return firstNumber + secondNumber
}

async function requestOperation(
  definition: OperationDefinition,
  user: UserContextAccount,
  page: number,
  perPage: number,
  status: string,
  dateStart: string,
  dateEnd: string,
  movementFilters: MovementFilters = emptyMovementFilters,
  transferFilters: TransferFilters = emptyTransferFilters,
  paymentFilters: PaymentFilters = emptyPaymentFilters,
  withdrawalFilters: WithdrawalFilters = emptyWithdrawalFilters,
  cursor = "",
) {
  const userName = getUserName(user)
  const accountType = getAccountType(user)
  const userIdentifier = user.phone_number || userName
  const withdrawalIdentifier = user.business_name || [user.first_name, user.last_name].filter(Boolean).join(" ") || user.phone_number || userName
  const commonParams = {
    per_page: String(perPage),
    page: String(page),
    status,
    data_inicio: dateStart,
    data_fim: dateEnd,
  }

  if (definition.title === "Pagamentos GPO") {
    const params = new URLSearchParams({
      merchant_id: String(user.id ?? ""),
      page: String(page),
      per_page: String(perPage),
    })
    if (status) params.set("status", status)
    if (paymentFilters.paymentReference) params.set("payment_reference", paymentFilters.paymentReference)
    if (paymentFilters.transactionReference) params.set("transaction_reference", paymentFilters.transactionReference)
    if (paymentFilters.phoneNumber) params.set("phone_number", paymentFilters.phoneNumber)
    if (paymentFilters.externalPaymentId) params.set("external_payment_id", paymentFilters.externalPaymentId)
    if (paymentFilters.minimumAmount) params.set("montante_de", paymentFilters.minimumAmount)
    if (paymentFilters.maximumAmount) params.set("montante_ate", paymentFilters.maximumAmount)
    if (dateStart) params.set("data_inicio", dateStart)
    if (dateEnd) params.set("data_fim", dateEnd)

    const { data } = await api.get(definition.endpoint + "?" + params.toString())
    return normaliseResponse(data)
  }

  if (definition.title === "Transferências") {
    const transferPageSize = page * perPage
    const fetchDirection = async (direction: "sent" | "received") => {
      const directionParams = direction === "sent"
        ? {
            sender_name: userName,
            sender_type: accountType,
            receiver_name: transferFilters.counterparty,
            ...(transferFilters.counterpartyType ? { receiver_type: transferFilters.counterpartyType } : {}),
          }
        : {
            receiver_name: userName,
            receiver_type: accountType,
            sender_name: transferFilters.counterparty,
            ...(transferFilters.counterpartyType ? { sender_type: transferFilters.counterpartyType } : {}),
          }
      const paramsForPage = (requestPage: number, requestPageSize: number) => new URLSearchParams({
        ...commonParams,
        per_page: String(requestPageSize),
        page: String(requestPage),
        valor_de: transferFilters.minimumAmount,
        valor_ate: transferFilters.maximumAmount,
        ...directionParams,
      })

      const firstResult = await api.get(`${definition.endpoint}?${paramsForPage(1, transferPageSize)}`)
      const firstPage = normaliseResponse(firstResult.data)
      const requestedRows = Math.min(transferPageSize, valueAsNumber(firstPage.total) ?? firstPage.dados.length)
      const pageCapacity = firstPage.dados.length || perPage
      const pageCount = Math.ceil(requestedRows / pageCapacity)
      if (pageCount <= 1) return firstPage

      const remainingPages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) =>
        api.get(`${definition.endpoint}?${paramsForPage(index + 2, transferPageSize)}`),
      ))
      return {
        ...firstPage,
        dados: [
          ...firstPage.dados,
          ...remainingPages.flatMap((response) => normaliseResponse(response.data).dados),
        ],
      }
    }

    const [sentResponse, receivedResponse] = await Promise.all([fetchDirection("sent"), fetchDirection("received")])
    const uniqueRows = Array.from(new Map([...sentResponse.dados, ...receivedResponse.dados].map((row, index) => [getString(row, "id") || String(index), row])).values())
      .sort((first, second) => {
        const firstDate = Date.parse(getString(first, "created_at")) || 0
        const secondDate = Date.parse(getString(second, "created_at")) || 0
        return secondDate - firstDate
      })
    return {
      dados: uniqueRows.slice((page - 1) * perPage, page * perPage),
      total: sumValues(sentResponse.total, receivedResponse.total),
      total_amount: sumValues(sentResponse.total_amount, receivedResponse.total_amount),
    }
  }

  const isReferencePayment = definition.title === "Pag. Referência"
  const isReferenceDeposit = definition.title === "Depósitos por Referência"
  const isMerchant = accountType === "Merchant" || Boolean(user.business_name)
  const params: Record<string, string> = {
    ...commonParams,
    ...(definition.title === "Pagamentos" ? { users_name: userName, account_type: accountType, beneficiario: paymentFilters.beneficiary, servico: paymentFilters.service } : {}),
    ...(isReferencePayment ? { users_name: userName } : {}),
    ...(definition.title === "Depósitos por GPO" ? {
      user_name_phone: user.business_name || userIdentifier,
      account_type: accountType,
      montante_de: paymentFilters.minimumAmount,
      montante_ate: paymentFilters.maximumAmount,
      canal: paymentFilters.channel,
    } : {}),
    ...(definition.title === "Depósitos" ? { user_name: userName, account_type: accountType, type: "DepositGpoFrame" } : {}),
    ...(definition.title === "Levantamentos" ? { user_name_phone: withdrawalIdentifier, account_type: accountType, iban: withdrawalFilters.iban, montante_de: withdrawalFilters.minimumAmount, montante_ate: withdrawalFilters.maximumAmount, responsavel: withdrawalFilters.responsible } : {}),
    ...(definition.title === "Movimentos" ? {
      user_name: userName,
      account_type: accountType,
      signal: movementFilters.signal,
      type: movementFilters.transactionType,
      valor_de: movementFilters.minimumAmount,
      valor_ate: movementFilters.maximumAmount,
    } : {}),
  }

  let requestEndpoint = definition.endpoint
  if (isReferencePayment || isReferenceDeposit) {
    delete params.status
    delete params.data_inicio
    delete params.data_fim
    delete params.per_page
    delete params.page
    if (paymentFilters.paymentReference) params.payment_reference = paymentFilters.paymentReference
    if (paymentFilters.paymentStatus) params.payment_status = paymentFilters.paymentStatus
    if (paymentFilters.mftStatus) params.mft_status = paymentFilters.mftStatus
    if (paymentFilters.prtStatus) params.prt_status = paymentFilters.prtStatus
    if (paymentFilters.paymentId) params.payment_id = paymentFilters.paymentId
    if (dateStart) params.start_date = dateStart
    if (dateEnd) params.end_date = dateEnd
    if (cursor) params.cursor = cursor
    params.limit = String(perPage)

    if (isMerchant) {
      requestEndpoint = isReferenceDeposit
        ? "/front/" + encodeURIComponent(String(user.merchant_payment_number ?? user.id ?? "")) + "/payments"
        : "/front/merchant/" + encodeURIComponent(String(user.id ?? "")) + "/payments"
      if (isReferencePayment) {
        delete params.limit
        delete params.cursor
        params.per_page = String(perPage)
        params.page = String(page)
      }
      delete params.users_name
    } else if (!isMerchant && user.phone_number) {
      params.reference = user.phone_number
      delete params.users_name
    }
  }

  const { data } = await api.get(requestEndpoint + "?" + new URLSearchParams(params).toString())
  return normaliseResponse(data)
}

async function requestPaymentSummary(user: UserContextAccount, status: string, dateStart: string, dateEnd: string, paymentFilters: PaymentFilters): Promise<PaymentSummary> {
  const params = new URLSearchParams({
    status,
    users_name: getUserName(user),
    account_type: getAccountType(user),
    data_inicio: dateStart,
    data_fim: dateEnd,
    servico: paymentFilters.service,
  })
  const { data } = await api.get("/front/summary_payments?" + params.toString())
  return {
    total_custo: data?.total_custo ?? 0,
    total_lucro: data?.total_lucro ?? 0,
  }
}

function DetailsPanel({ detail, row, onClose }: { detail: OperationDefinition["detail"]; row: ContextRow; onClose: () => void }) {
  if (detail === "transfer") return <DetalhesTransferencia itemSelected={row} isOpen onClose={onClose} />
  if (detail === "payment") return <DetalhesPagamento itemSelected={row} isOpen onClose={onClose} />
  if (detail === "reference") return <DetalhesPagamentoReference itemSelected={row as unknown as ReferencePaymentType} isOpen onClose={onClose} />
  if (detail === "referenceDeposit") return <DetalhesDepositoReference itemSelected={row as unknown as ReferenceDepositType} isOpen onClose={onClose} />
  if (detail === "paymentGpo") return <DetalhesPagamentoGPO itemSelected={row as unknown as GpoPayment} isOpen onClose={onClose} />
  if (detail === "gpo") return <DetalhesDeposito itemSelected={row} isOpen onClose={onClose} />
  if (detail === "withdrawal") return <DetalhesLevantamento itemSelected={row} isOpen onClose={onClose} />
  return <DetalhesMovimentos itemSelected={row} isOpen onClose={onClose} />
}

function getTotal(response: ContextResponse | undefined) {
  return valueAsNumber(response?.total) || 0
}

function getTotalAmount(response: ContextResponse | undefined) {
  return response?.total_payment ?? response?.total_amount
}

function getExportValue(column: OperationColumn, row: ContextRow, detail: OperationDefinition["detail"], operation: UserContextOperationKey) {
  const isMovementTable = operation === "conta-corrente"
  if (column.label === "ID") return getString(row, "id") || "—"
  if (column.label === "Pagamento") return getString(row, "payment_id") || getString(row, "id_transaction") || getString(row, "id") || "—"
  if (column.label === "Entidade") return getString(row, "entity_code") || "—"
  if (column.label === "Valor recebido") return formatAmount(getRowAmount(row))
  if (column.label === "Valor") return isMovementTable ? getMovementAmount(row) : formatAmount(getRowAmount(row))
  if (column.label === "Data") return formatDate(getRowDate(row))
  if (column.label === "Estado do depósito") return getStatusDisplay(row, detail).label
  if (column.label === "Estado") return getStatusDisplay(row, detail).label
  if (column.label === "Referência da transação") return getString(row, "transaction_reference") || "—"
  if (column.label === "Telefone") return getString(row, "phone_number") || "—"
  if (column.label === "Remetente") return getString(row, "sender_name") || "—"
  if (column.label === "Destinatário") return getString(row, "receiver_name") || "—"
  if (column.label === "Beneficiário") return getString(row, "beneficiario") || "—"
  if (column.label === "Titular") return getReferenceDepositAccountName(row)
  if (column.label === "Serviço") return getString(row, "entity") || getString(row, "product_name") || "—"
  if (column.label === "Produto") return getString(row, "product_name") || "—"
  if (column.label === "Referência") return operation === "pagamento-gpo" || operation === "pagamentos-referencia" || operation === "pagamentos-gpo"
    ? getString(row, "payment_reference") || getString(row, "reference") || "—"
    : getString(row, "reference") || getString(row, "payment_reference") || "—"
  if (column.label === "Canal") return operation === "pagamentos-referencia" || operation === "depositos-referencia"
    ? getTerminalLabel(getString(row, "channel"))
    : getString(row, "channel") || getString(row, "canal") || "—"
  if (column.label === "IBAN") return getString(row, "iban") || "—"
  if (column.label === "Origem" && isMovementTable) return String(PegaOrigemMovimento(row) || "—")
  if (column.label === "Destino" && isMovementTable) return String(PegaDestinoMovimento(row) || "—")
  if (column.label === "Transação" && isMovementTable) return TypeTransaction(getString(row, "type")) || "—"
  if (column.label === "Movimento") return isMovementTable ? getMovementLabel(row) : getString(row, "signal") || "—"
  if (column.label === "Operação") return isMovementTable ? TypeTransaction(getString(row, "type")) || "—" : getString(row, "type") || "Depósito"

  const rendered = column.render(row)
  return typeof rendered === "string" || typeof rendered === "number" ? String(rendered) : "—"
}

function downloadCsv(operation: UserContextOperationKey, rows: ContextRow[], selectedColumns: string[], format: "csv" | "xlsx" = "csv") {
  const definition = operationDefinitions[operation]
  const columns = definition.columns.filter((column) => selectedColumns.includes(column.label))
  const headers = columns.map((column) => column.label)
  const values = rows.map((row) => columns.map((column) => getExportValue(column, row, definition.detail, operation)))
  if (format === "xlsx") {
    exportExcelRows(values.map((line) => Object.fromEntries(headers.map((header, index) => [header, line[index]]))), "lista-levantamentos", "Levantamentos")
    return
  }
  const csv = [headers, ...values].map((line) => line.map((value) => `"${value.replace(/"/g, '""')}"`).join(";")).join("\r\n")
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${definition.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function UserContextOperationsPage({ operation, title, embedded = false }: { operation: UserContextOperationKey; title?: string; embedded?: boolean }) {
  const user = useUserContext()
  const definition = operationDefinitions[operation]
  const pageTitle = title || definition.title
  const [page, setPage] = useState(1)
  const [referenceCursor, setReferenceCursor] = useState("")
  const [referenceCursorHistory, setReferenceCursorHistory] = useState([""])
  const isMerchantAccount = user.account_type === "Merchant" || Boolean(user.business_name)
  const perPage = operation === "pagamentos-referencia" && isMerchantAccount
    ? 100
    : operation === "pagamentos-referencia" || operation === "depositos-referencia" || operation === "pagamento-gpo"
      ? 10
      : 100
  const [search, setSearch] = useState("")
  const [withdrawalTab, setWithdrawalTab] = useState<"pending" | "processed">("pending")
  const defaultStatus = operation === "pagamentos" ? "SUCCESS" : operation === "pagamento-gpo" ? "ACCEPTED" : operation === "levantamentos" ? withdrawalTab === "pending" ? "PENDING" : "ACCEPTED" : ""
  const [status, setStatus] = useState(defaultStatus)
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")
  const [movementFilters, setMovementFilters] = useState<MovementFilters>(emptyMovementFilters)
  const [transferFilters, setTransferFilters] = useState<TransferFilters>(emptyTransferFilters)
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilters>(emptyPaymentFilters)
  const [withdrawalFilters, setWithdrawalFilters] = useState<WithdrawalFilters>(emptyWithdrawalFilters)
  const managersQuery = ListaManagers(operation === "levantamentos" && withdrawalTab === "processed")
  const showWithdrawalExpansion = operation === "levantamentos" && withdrawalTab === "processed"
  const showWithdrawalSelection = operation === "levantamentos" && withdrawalTab === "pending"
  const [expandedWithdrawalId, setExpandedWithdrawalId] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterDraft, setFilterDraft] = useState<ContextFilterDraft>({
    ...emptyMovementFilters,
    ...emptyTransferFilters,
    ...emptyPaymentFilters,
    ...emptyWithdrawalFilters,
    status: "",
    dateStart: "",
    dateEnd: "",
  })
  const [exportOpen, setExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv")
  const [exportDraft, setExportDraft] = useState({ status: "", dateStart: "", dateEnd: "", scope: "all" as "all" | "page" })
  const [exportColumns, setExportColumns] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [selectedRow, setSelectedRow] = useState<ContextRow>()
  const [actionState, setActionState] = useState<ActionState>()
  const [selectedWithdrawalIds, setSelectedWithdrawalIds] = useState<string[]>([])
  const [motivo, setMotivo] = useState("")
  const [isActionPending, setIsActionPending] = useState(false)
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedWithdrawalIds([])
    setActionState(undefined)
    setMotivo("")
    setSearch("")
    setPage(1)
    setReferenceCursor("")
    setReferenceCursorHistory([""])
    setWithdrawalTab("pending")
    setStatus(operation === "pagamentos" ? "SUCCESS" : operation === "pagamento-gpo" ? "ACCEPTED" : operation === "levantamentos" ? "PENDING" : "")
    setDateStart("")
    setDateEnd("")
    setMovementFilters(emptyMovementFilters)
    setTransferFilters(emptyTransferFilters)
    setPaymentFilters(emptyPaymentFilters)
    setWithdrawalFilters(emptyWithdrawalFilters)
    setExpandedWithdrawalId(null)
    setExpandedTransferId(null)
  }, [user.id, operation])

  const resetReferencePagination = () => {
    setReferenceCursor("")
    setReferenceCursorHistory([""])
    setPage(1)
  }

  const operationQuery = useQuery<ContextResponse>({
    queryKey: ["user-context-operation", operation, user.id, user.phone_number, user.business_name, user.account_type, user.merchant_payment_number, page, perPage, referenceCursor, withdrawalTab, status, dateStart, dateEnd, movementFilters, transferFilters, paymentFilters, withdrawalFilters],
    queryFn: () => requestOperation(definition, user, page, perPage, status, dateStart, dateEnd, movementFilters, transferFilters, paymentFilters, withdrawalFilters, referenceCursor),
    enabled: Boolean(user.id),
    placeholderData: keepPreviousData,
  })
  const paymentSummaryQuery = useQuery<PaymentSummary>({
    queryKey: ["user-context-payment-summary", user.id, user.phone_number, status, dateStart, dateEnd, paymentFilters.service],
    queryFn: () => requestPaymentSummary(user, status, dateStart, dateEnd, paymentFilters),
    enabled: Boolean(user.id) && operation === "pagamentos" && !embedded,
    placeholderData: keepPreviousData,
  })

  const filteredRows = useMemo(() => {
    const rows = operationQuery.data?.dados || []
    const term = search.trim().toLowerCase()
    if (!term) return rows

    return rows.filter((row) => [
      getString(row, "id"),
      getString(row, "id_transaction"),
      getString(row, "period_id"),
      getString(row, "payment_id"),
      getString(row, "payment_reference"),
      getString(row, "sender_name"),
      getString(row, "contacto_sender"),
      getString(row, "receiver_name"),
      getString(row, "contacto_receiver"),
      getString(row, "reference"),
      getString(row, "channel"),
      getString(row, "beneficiario"),
      getString(row, "entity"),
      getString(row, "product_name"),
      String(getNestedValue(row, ["body_request", "unitel_telefone"]) ?? ""),
      getString(row, "iban"),
      getString(row, "status"),
      getString(row, "type"),
      String(TypeTransaction(getString(row, "type")) || ""),
      String(PegaOrigemMovimento(row) || ""),
      String(PegaDestinoMovimento(row) || ""),
      getMovementLabel(row),
      String(getRowAmount(row) ?? ""),
      ...getSpecialOperationSearchValues(row, operation),
    ].some((value) => value.toLowerCase().includes(term)))
  }, [operationQuery.data?.dados, operation, search])

  const pendingWithdrawalIds = operation === "levantamentos" && withdrawalTab === "pending"
    ? filteredRows
      .filter((row) => getRowStatus(row).toUpperCase() === "PENDING")
      .map((row) => getString(row, "id"))
      .filter(Boolean)
    : []
  const selectedVisibleWithdrawalCount = pendingWithdrawalIds.filter((id) => selectedWithdrawalIds.includes(id)).length
  const allVisibleWithdrawalsSelected = pendingWithdrawalIds.length > 0 && selectedVisibleWithdrawalCount === pendingWithdrawalIds.length
  const someVisibleWithdrawalsSelected = selectedVisibleWithdrawalCount > 0 && !allVisibleWithdrawalsSelected

  const totalItems = getTotal(operationQuery.data)
  const referencePageAmount = (operationQuery.data?.dados || []).reduce((total, row) => total + (valueAsNumber(getRowAmount(row)) || 0), 0)
  const isMerchantReferencePayment = operation === "pagamentos-referencia" && isMerchantAccount
  const isReferencePagination = (operation === "pagamentos-referencia" || operation === "depositos-referencia") && !isMerchantReferencePayment
  const totalPages = isReferencePagination
    ? page + (operationQuery.data?.next_cursor ? 1 : 0)
    : Math.max(1, Math.ceil(totalItems / perPage))
  const paginationRange = generatePaginationRange(totalPages, page)

  const handleNextPage = () => {
    if (!isReferencePagination) {
      setPage((current) => Math.min(totalPages, current + 1))
      return
    }
    const nextCursor = operationQuery.data?.next_cursor
    if (!nextCursor || operationQuery.isFetching) return
    setReferenceCursorHistory((history) => [...history.slice(0, page), nextCursor])
    setReferenceCursor(nextCursor)
    setPage((current) => current + 1)
  }

  const handlePreviousPage = () => {
    if (page <= 1) return
    const previousPage = page - 1
    if (isReferencePagination) {
      setReferenceCursor(referenceCursorHistory[previousPage - 1] ?? "")
    }
    setPage(previousPage)
  }

  const handlePageChange = (targetPage: number) => {
    if (!isReferencePagination) {
      setPage(targetPage)
      return
    }
    if (targetPage === page + 1) {
      handleNextPage()
      return
    }
    const pageCursor = referenceCursorHistory[targetPage - 1]
    if (pageCursor !== undefined) {
      setReferenceCursor(pageCursor)
      setPage(targetPage)
    }
  }

  const hasOperationFilters = operation === "conta-corrente"
    ? hasActiveFilterValues(...Object.values(movementFilters))
    : operation === "transferencias"
      ? hasActiveFilterValues(...Object.values(transferFilters))
      : operation === "pagamentos"
        ? Boolean(paymentFilters.beneficiary || paymentFilters.service)
        : operation === "pagamentos-referencia" || operation === "depositos-referencia"
          ? Boolean(paymentFilters.paymentReference || paymentFilters.paymentId || paymentFilters.paymentStatus || paymentFilters.mftStatus || paymentFilters.prtStatus)
          : operation === "pagamentos-gpo"
            ? Boolean(paymentFilters.paymentReference || paymentFilters.transactionReference || paymentFilters.phoneNumber || paymentFilters.externalPaymentId || paymentFilters.minimumAmount || paymentFilters.maximumAmount)
          : operation === "pagamento-gpo"
            ? Boolean(paymentFilters.channel || paymentFilters.minimumAmount || paymentFilters.maximumAmount)
            : operation === "levantamentos"
              ? hasActiveFilterValues(...Object.values(withdrawalFilters))
              : false
  const hasFilters = Boolean(search.trim() || status !== defaultStatus || dateStart || dateEnd || hasOperationFilters)
  const minimumMovementAmount = valueAsNumber(filterDraft.minimumAmount)
  const maximumMovementAmount = valueAsNumber(filterDraft.maximumAmount)
  const hasInvalidMovementAmountRange = operation === "conta-corrente"
    && minimumMovementAmount !== undefined
    && maximumMovementAmount !== undefined
    && minimumMovementAmount > maximumMovementAmount
  const movementFilterNeedsTransactionType = operation === "conta-corrente"
    && !filterDraft.transactionType
    && Boolean(filterDraft.status || filterDraft.minimumAmount || filterDraft.maximumAmount)
  const minimumTransferAmount = valueAsNumber(filterDraft.minimumAmount)
  const maximumTransferAmount = valueAsNumber(filterDraft.maximumAmount)
  const hasInvalidTransferAmountRange = operation === "transferencias"
    && minimumTransferAmount !== undefined
    && maximumTransferAmount !== undefined
    && minimumTransferAmount > maximumTransferAmount
  const minimumGpoAmount = valueAsNumber(filterDraft.minimumAmount)
  const maximumGpoAmount = valueAsNumber(filterDraft.maximumAmount)
  const hasInvalidGpoAmountRange = (operation === "pagamento-gpo" || operation === "pagamentos-gpo")
    && minimumGpoAmount !== undefined
    && maximumGpoAmount !== undefined
    && minimumGpoAmount > maximumGpoAmount
  const hasInvalidWithdrawalAmountRange = operation === "levantamentos"
    && minimumGpoAmount !== undefined
    && maximumGpoAmount !== undefined
    && minimumGpoAmount > maximumGpoAmount

  const openFilterSheet = () => {
    setFilterDraft({ ...movementFilters, ...transferFilters, ...paymentFilters, ...withdrawalFilters, status, dateStart, dateEnd })
    setFiltersOpen(true)
  }

  const applyFilterDraft = () => {
    if (movementFilterNeedsTransactionType) {
      toast.error("Selecione o tipo de transação para filtrar por estado ou valor.")
      return
    }
    if (hasInvalidMovementAmountRange) {
      toast.error("O valor mínimo não pode ser superior ao valor máximo.")
      return
    }
    if (hasInvalidTransferAmountRange || hasInvalidGpoAmountRange || hasInvalidWithdrawalAmountRange) {
      toast.error("O valor mínimo não pode ser superior ao valor máximo.")
      return
    }

    setStatus(filterDraft.status)
    setDateStart(filterDraft.dateStart)
    setDateEnd(filterDraft.dateEnd)
    setMovementFilters({
      signal: filterDraft.signal,
      transactionType: filterDraft.transactionType,
      minimumAmount: filterDraft.minimumAmount,
      maximumAmount: filterDraft.maximumAmount,
    })
    setTransferFilters({
      counterparty: filterDraft.counterparty,
      counterpartyType: filterDraft.counterpartyType,
      minimumAmount: filterDraft.minimumAmount,
      maximumAmount: filterDraft.maximumAmount,
    })
    setPaymentFilters({
      beneficiary: filterDraft.beneficiary,
      service: filterDraft.service,
      paymentReference: filterDraft.paymentReference,
      paymentId: filterDraft.paymentId,
      paymentStatus: filterDraft.paymentStatus,
      mftStatus: filterDraft.mftStatus,
      prtStatus: filterDraft.prtStatus,
      transactionReference: filterDraft.transactionReference,
      phoneNumber: filterDraft.phoneNumber,
      externalPaymentId: filterDraft.externalPaymentId,
      channel: filterDraft.channel,
      minimumAmount: filterDraft.minimumAmount,
      maximumAmount: filterDraft.maximumAmount,
    })
    setWithdrawalFilters({
      iban: filterDraft.iban,
      responsible: filterDraft.responsible,
      minimumAmount: filterDraft.minimumAmount,
      maximumAmount: filterDraft.maximumAmount,
    })
    if (operation === "levantamentos") setSelectedWithdrawalIds([])
    resetReferencePagination()
    setFiltersOpen(false)
  }

  const openExportDialog = () => {
    setExportDraft({ status, dateStart, dateEnd, scope: "all" })
    setExportColumns(definition.columns.map((column) => column.label))
    setExportOpen(true)
  }

  const exportRows = async () => {
    if (exportColumns.length === 0) {
      toast.error("Seleccione pelo menos uma coluna para exportar.")
      return
    }
    if (exportDraft.dateStart && exportDraft.dateEnd && exportDraft.dateStart > exportDraft.dateEnd) {
      toast.error("A data inicial não pode ser posterior à data final.")
      return
    }

    setIsExporting(true)
    try {
      const firstPage = exportDraft.scope === "page" ? page : 1
      const firstCursor = (operation === "pagamentos-referencia" || operation === "depositos-referencia") && exportDraft.scope === "page" ? referenceCursor : ""
      const firstResponse = await requestOperation(definition, user, firstPage, perPage, exportDraft.status, exportDraft.dateStart, exportDraft.dateEnd, movementFilters, transferFilters, paymentFilters, withdrawalFilters, firstCursor)
      let rows = [...firstResponse.dados]

      if (exportDraft.scope === "all" && (operation === "pagamentos-referencia" || operation === "depositos-referencia") && !isMerchantReferencePayment) {
        let nextCursor = firstResponse.next_cursor
        const visitedCursors = new Set<string>()
        let nextPage = 2
        while (nextCursor && !visitedCursors.has(nextCursor)) {
          visitedCursors.add(nextCursor)
          const response = await requestOperation(definition, user, nextPage, perPage, exportDraft.status, exportDraft.dateStart, exportDraft.dateEnd, movementFilters, transferFilters, paymentFilters, withdrawalFilters, nextCursor)
          rows = rows.concat(response.dados)
          nextCursor = response.next_cursor
          nextPage += 1
        }
      } else if (exportDraft.scope === "all") {
        const exportPageCount = Math.max(1, Math.ceil(getTotal(firstResponse) / perPage))
        for (let nextPage = 2; nextPage <= exportPageCount; nextPage += 1) {
          const response = await requestOperation(definition, user, nextPage, perPage, exportDraft.status, exportDraft.dateStart, exportDraft.dateEnd, movementFilters, transferFilters, paymentFilters, withdrawalFilters)
          rows = rows.concat(response.dados)
        }
      }

      const term = search.trim().toLowerCase()
      if (term) {
        rows = rows.filter((row) => [
          getString(row, "id"), getString(row, "id_transaction"), getString(row, "period_id"), getString(row, "payment_id"), getString(row, "payment_reference"),
          getString(row, "sender_name"), getString(row, "contacto_sender"), getString(row, "receiver_name"), getString(row, "contacto_receiver"),
          getString(row, "reference"), getString(row, "channel"), getString(row, "beneficiario"), getString(row, "entity"), getString(row, "product_name"), String(getNestedValue(row, ["body_request", "unitel_telefone"]) ?? ""), getString(row, "iban"),
          getString(row, "status"), getString(row, "type"),
          String(TypeTransaction(getString(row, "type")) || ""),
          String(PegaOrigemMovimento(row) || ""), String(PegaDestinoMovimento(row) || ""),
          getMovementLabel(row), String(getRowAmount(row) ?? ""),
          ...getSpecialOperationSearchValues(row, operation),
        ].some((value) => value.toLowerCase().includes(term)))
      }

      const uniqueRows = Array.from(new Map(rows.map((row, index) => [getString(row, "id") || getString(row, "payment_id") || String(index), row])).values())
      const format = operation === "levantamentos" ? exportFormat : "csv"
      downloadCsv(operation, uniqueRows, exportColumns, format)
      setExportOpen(false)
      toast.success(`${uniqueRows.length} registo(s) exportado(s) em ${format === "xlsx" ? "Excel" : "CSV"}.`)
    } catch {
      toast.error("Não foi possível preparar a exportação desta conta.")
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = (statusOverride = defaultStatus) => {
    setSearch("")
    setStatus(statusOverride)
    setDateStart("")
    setDateEnd("")
    setMovementFilters(emptyMovementFilters)
    setTransferFilters(emptyTransferFilters)
    setPaymentFilters(emptyPaymentFilters)
    setWithdrawalFilters(emptyWithdrawalFilters)
    setExpandedWithdrawalId(null)
    setSelectedWithdrawalIds([])
    resetReferencePagination()
  }

  const changeWithdrawalTab = (tab: "pending" | "processed") => {
    if (tab === withdrawalTab) return
    setWithdrawalTab(tab)
    clearFilters(tab === "pending" ? "PENDING" : "ACCEPTED")
  }

  const toggleWithdrawalSelection = (id: string, checked: boolean) => {
    setSelectedWithdrawalIds((current) => checked
      ? current.includes(id) ? current : [...current, id]
      : current.filter((selectedId) => selectedId !== id))
  }

  const toggleVisibleWithdrawalSelection = (checked: boolean) => {
    setSelectedWithdrawalIds((current) => checked
      ? Array.from(new Set([...current, ...pendingWithdrawalIds]))
      : current.filter((id) => !pendingWithdrawalIds.includes(id)))
  }

  const executeWithdrawalAction = async () => {
    if (!actionState) return
    if (actionState.type === "reject" && !motivo) {
      toast.error("Seleccione o motivo da recusa.")
      return
    }

    const ids = actionState.ids || (actionState.row ? [getString(actionState.row, "id")] : [])
    const validIds = ids.filter(Boolean)
    if (validIds.length === 0) {
      toast.error("Não foi possível identificar o levantamento.")
      return
    }

    setIsActionPending(true)
    try {
      const results = await Promise.allSettled(validIds.map((id) => api.put(
        actionState.type === "confirm"
          ? `/front/withdrawal/confirm?id=${encodeURIComponent(id)}`
          : `/front/withdrawal/reject?id=${encodeURIComponent(id)}&motivo=${encodeURIComponent(motivo)}`,
      )))
      const failedCount = results.filter((result) => result.status === "rejected").length
      if (failedCount > 0) {
        toast.error(`${failedCount} de ${validIds.length} levantamento(s) não puderam ser ${actionState.type === "confirm" ? "processados" : "recusados"}.`)
        return
      }
      toast.success(`${validIds.length === 1 ? "Levantamento" : "Levantamentos"} ${actionState.type === "confirm" ? "processado" : "recusado"}${validIds.length === 1 ? "" : "s"} com sucesso.`)
      setActionState(undefined)
      setMotivo("")
      setSelectedWithdrawalIds([])
      await operationQuery.refetch()
    } catch {
      toast.error("Não foi possível concluir a acção sobre o levantamento.")
    } finally {
      setIsActionPending(false)
    }
  }

  const withdrawalActionCount = actionState?.ids?.length ?? 0
  const withdrawalActionDescription = `${withdrawalActionCount} ${withdrawalActionCount === 1 ? "pedido seleccionado" : "pedidos seleccionados"}`
  const operationSummary = (
    <div className="ui-inline-summary ui-context-summary flex items-center text-[14px] text-[#143163]">
      <span><strong>Total geral de registos:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : totalItems || "Nenhum"}</span></span>
      <span className="ui-inline-summary-divider" aria-hidden="true" />
      {operation === "conta-corrente" ? (
        <>
          <span><strong>Total de movimentos de entrada:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(operationQuery.data?.total_entrada)}</span></span>
          <span className="ui-inline-summary-divider" aria-hidden="true" />
          <span><strong>Total de movimentos de saída:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(operationQuery.data?.total_saida)}</span></span>
        </>
      ) : operation === "pagamentos" ? (
        <span><strong>Total geral de pagamentos:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(operationQuery.data?.total_payment)}</span></span>
      ) : operation === "pagamentos-gpo" ? (
        <span><strong>Total de valor recebido:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(operationQuery.data?.total_amount)}</span></span>
      ) : operation === "depositos-referencia" ? (
        <span><strong>Total de valor recebido:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(operationQuery.data?.total_amount)}</span></span>
      ) : operation === "pagamentos-referencia" ? (
        <span><strong>Valor nesta página:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(referencePageAmount)}</span></span>
      ) : (
        <span><strong>Valor total:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(getTotalAmount(operationQuery.data))}</span></span>
      )}
    </div>
  )

  return (
    <div className="ui-context-page">
      {!embedded && (
        <div className="mb-5">
          <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
          <h2 className="mt-1 text-2xl font-bold text-[#143163]">{pageTitle}</h2>
          <p className="mt-1 text-sm text-[#6B7280]">{definition.description}</p>
        </div>
      )}

      {operation === "levantamentos" && (
        <div role="tablist" aria-label="Estado dos levantamentos" aria-orientation="horizontal" className="ui-tabs mb-0 inline-flex w-fit">
          <button
            id="withdrawal-tab-pending"
            type="button"
            role="tab"
            aria-selected={withdrawalTab === "pending"}
            aria-controls="withdrawal-tab-panel"
            onClick={() => changeWithdrawalTab("pending")}
            className={`grid h-11 min-w-[130px] place-items-center rounded-t-lg border border-b-0 px-5 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${withdrawalTab === "pending" ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"}`}
          >
            Pendentes
          </button>
          <button
            id="withdrawal-tab-processed"
            type="button"
            role="tab"
            aria-selected={withdrawalTab === "processed"}
            aria-controls="withdrawal-tab-panel"
            onClick={() => changeWithdrawalTab("processed")}
            className={`grid h-11 min-w-[130px] place-items-center rounded-t-lg border border-b-0 px-5 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${withdrawalTab === "processed" ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"}`}
          >
            Processadas
          </button>
        </div>
      )}

      <section
        id={operation === "levantamentos" ? "withdrawal-tab-panel" : undefined}
        role={operation === "levantamentos" ? "tabpanel" : undefined}
        aria-labelledby={operation === "levantamentos" ? `withdrawal-tab-${withdrawalTab}` : undefined}
        className={`ui-data-page rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)] ${operation === "levantamentos" ? "rounded-tl-none" : ""}`}
      >
        <div className="ui-data-stack flex flex-col gap-4 p-5">
          <div className="ui-context-toolbar flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {hasFilters && (
                <button type="button" onClick={() => clearFilters()} className="ui-clear-filter-button">
                  <X className="h-4 w-4" aria-hidden="true" /> Limpar filtros
                </button>
              )}
              <Button type="button" variant="outline" size="icon" aria-label="Filtrar" title="Filtrar" className="ui-filter-trigger" onClick={openFilterSheet}>
                <Filter aria-hidden="true" />
              </Button>
              <Button type="button" variant="outline" size="icon" aria-label="Actualizar" title="Actualizar" className="size-10 rounded-lg border-[#ADCBD0] bg-white text-[#143163] hover:bg-[#F1F5FA]" onClick={() => operationQuery.refetch()}>
                <RefreshCw className={`size-4 ${operationQuery.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              </Button>
              <Button type="button" variant="brand" className="h-10 rounded-lg" onClick={openExportDialog}>
                <FileDown aria-hidden="true" /> Exportar
              </Button>
            </div>

            <div className="relative w-full lg:w-[300px] lg:shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D8CA6]" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => { setSearch(event.target.value); if (operation === "levantamentos") setSelectedWithdrawalIds([]); resetReferencePagination() }}
                placeholder={operation === "conta-corrente" ? "Pesquisar movimentos..." : operation === "pagamentos" ? "Pesquisar pagamentos..." : operation === "depositos-referencia" || operation === "pagamento-gpo" ? "Pesquisar depósitos..." : "Pesquisar nesta conta..."}
                className="h-10 w-full rounded-lg border border-[#C9D8E9] bg-white pl-10 pr-3 text-sm text-[#143163] outline-none transition placeholder:text-[#8293AE] focus:border-[#48B9FF] focus:ring-4 focus:ring-[#48B9FF]/15"
                aria-label={`Pesquisar em ${pageTitle}`}
              />
            </div>
          </div>

          {operation === "pagamentos" && !embedded && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Total consumido",
                  helper: "Valor movimentado",
                  amount: paymentSummaryQuery.data?.total_custo,
                  icon: ReceiptText,
                  tone: "purple" as const,
                },
                {
                  label: "Lucro Sómoney",
                  helper: "Resultado acumulado",
                  amount: paymentSummaryQuery.data?.total_lucro,
                  icon: TrendingUp,
                  tone: "green" as const,
                },
              ].map((card) => {
                const amount = paymentSummaryQuery.isPending
                  ? "A carregar..."
                  : paymentSummaryQuery.isError
                    ? "—"
                    : formatAmount(card.amount)

                return (
                  <KpiCard
                    key={card.label}
                    label={card.label}
                    value={amount}
                    helper={card.helper}
                    icon={card.icon}
                    tone={card.tone}
                  />
                )
              })}
            </div>
          )}

          {showWithdrawalSelection && selectedWithdrawalIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D7E2F2] bg-[#F5F7FB] px-4 py-3">
              <p className="text-sm font-medium text-[#143163]">
                {selectedWithdrawalIds.length} {selectedWithdrawalIds.length === 1 ? "levantamento seleccionado" : "levantamentos seleccionados"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" className="h-9 border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FDECEC]" onClick={() => setActionState({ type: "reject", ids: selectedWithdrawalIds })}>
                  Recusar
                </Button>
                <Button type="button" className="h-9 bg-[#14883B] text-white hover:bg-[#0F6D2F]" onClick={() => setActionState({ type: "confirm", ids: selectedWithdrawalIds })}>
                  Processar
                </Button>
              </div>
            </div>
          )}

          {operationQuery.isError ? (
            <>
              {operationSummary}
              <div className="rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-6 text-center text-sm text-[#765500]">
                Não foi possível carregar os dados de {definition.title.toLowerCase()} para esta conta.
              </div>
            </>
          ) : (
            <TableResults
                leadingContent={operationSummary}
                label={operationResultsLabels[operation]}
                visibleCount={filteredRows.length}
                totalCount={operationQuery.data?.total}
                currentPage={page}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                isLoading={operationQuery.isPending || operationQuery.isFetching}
                containerClassName="overflow-x-auto rounded-xl border border-[#E5EBF4]"
            >
              <table className={`w-full border-collapse ${operation === "conta-corrente" ? "min-w-[960px] table-fixed" : "min-w-[920px]"}`}>
                <caption className="sr-only">{definition.title} da conta seleccionada</caption>
                <thead className="h-12 bg-[#F5F7FB] text-left text-[#143163]">
                  <tr>
                    {operation === "transferencias" && <th className="ui-expand-toggle-column" aria-label="Expandir transferência" />}
                    {showWithdrawalExpansion && <th className="ui-expand-toggle-column" aria-label="Expandir levantamento" />}
                    {showWithdrawalSelection && (
                      <th className="w-11 px-3 text-center">
                        <Checkbox
                          checked={allVisibleWithdrawalsSelected}
                          indeterminate={someVisibleWithdrawalsSelected}
                          onCheckedChange={toggleVisibleWithdrawalSelection}
                          ariaLabel="Seleccionar todos os levantamentos pendentes visíveis"
                          disabled={pendingWithdrawalIds.length === 0 || operationQuery.isFetching}
                        />
                      </th>
                    )}
                    {definition.columns.map((column) => <th key={column.label} className={column.className || ""}>{column.label}</th>)}
                    <th className="ui-actions-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {operationQuery.isPending ? (
                    <TableStateRow colSpan={definition.columns.length + (operation === "transferencias" || showWithdrawalExpansion || showWithdrawalSelection ? 2 : 1)} state="loading" message="A carregar operações..." />
                  ) : filteredRows.length === 0 ? (
                    <TableStateRow colSpan={definition.columns.length + (operation === "transferencias" || showWithdrawalExpansion || showWithdrawalSelection ? 2 : 1)} state="empty" message="Nenhum registo encontrado para esta conta." />
                  ) : (
                    filteredRows.map((row, index) => {
                      const rowStatus = getRowStatus(row).toUpperCase()
                      const canProcessWithdrawal = operation === "levantamentos" && rowStatus === "PENDING"
                      const rowId = getString(row, "id") || getString(row, "payment_id")
                      const transferExpanded = operation === "transferencias" && expandedTransferId === rowId
                      const withdrawalExpanded = showWithdrawalExpansion && expandedWithdrawalId === rowId
                      return (
                        <Fragment key={rowId || index}>
                        <tr>
                          {showWithdrawalExpansion && (
                            <td className="ui-expand-toggle-column text-center">
                              <TableRowExpandButton
                                expanded={withdrawalExpanded}
                                expandLabel="Expandir detalhes do levantamento"
                                collapseLabel="Recolher detalhes do levantamento"
                                onClick={() => setExpandedWithdrawalId(withdrawalExpanded ? null : rowId)}
                              />
                            </td>
                          )}
                          {showWithdrawalSelection && (
                            <td className="w-11 px-3 text-center">
                              <Checkbox
                                checked={selectedWithdrawalIds.includes(rowId)}
                                onCheckedChange={(checked) => toggleWithdrawalSelection(rowId, checked)}
                                ariaLabel={`Seleccionar levantamento ${getString(row, "iban") || rowId}`}
                                disabled={!canProcessWithdrawal || !rowId}
                              />
                            </td>
                          )}
                          {operation === "transferencias" && (
                            <td className="ui-expand-toggle-column">
                              <TableRowExpandButton
                                expanded={transferExpanded}
                                expandLabel="Expandir opções da transferência"
                                collapseLabel="Recolher opções da transferência"
                                onClick={() => setExpandedTransferId(transferExpanded ? null : rowId)}
                              />
                            </td>
                          )}
                          {definition.columns.map((column) => <td key={column.label} className={column.className || ""}>{column.render(row)}</td>)}
                          <td className="ui-actions-column">
                            <div className="flex flex-wrap items-center gap-2">
                              <TableActionButton action="view" onClick={() => setSelectedRow(row)} />
                              {canProcessWithdrawal && (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button type="button" aria-label="Processar levantamento" onClick={() => setActionState({ type: "confirm", row })} className="grid h-9 w-9 place-items-center rounded-lg bg-[#E8F5EB] text-[#14B94A] transition-colors hover:bg-[#14B94A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B94A] focus-visible:ring-offset-2">
                                        <Check className="size-[18px]" aria-hidden="true" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p className="text-[#143163]">Processar levantamento</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button type="button" aria-label="Recusar levantamento" onClick={() => setActionState({ type: "reject", row })} className="grid h-9 w-9 place-items-center rounded-lg bg-[#FDECEC] text-[#B42318] transition-colors hover:bg-[#B42318] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B42318] focus-visible:ring-offset-2">
                                        <X className="size-[18px]" aria-hidden="true" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p className="text-[#143163]">Recusar levantamento</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        {withdrawalExpanded && (
                          <tr className="ui-expandable-row border-t border-[#EBECEF]">
                            <td className="ui-expandable-cell" colSpan={definition.columns.length + 2}>
                              <ExpandirLevantamentosProcessados data={getString(row, "created_at")} responsavel={String(getNestedValue(row, ["responsavel", "name"]) ?? "—")} />
                            </td>
                          </tr>
                        )}
                        {transferExpanded && (
                          <tr className="ui-expandable-row border-t border-[#EBECEF]">
                            <td className="ui-expandable-cell" colSpan={definition.columns.length + 2}>
                              <ExpandirTransferencias id={rowId} estorno={Boolean(row.estorno)} onRefundSuccess={() => { void operationQuery.refetch() }} />
                            </td>
                          </tr>
                        )}
                        </Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </TableResults>
          )}

          <PaginationFooter
            currentPage={page}
            totalPages={totalPages}
            paginationRange={paginationRange}
            onPageChange={handlePageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
      </section>

      {selectedRow && <DetailsPanel detail={definition.detail} row={selectedRow} onClose={() => setSelectedRow(undefined)} />}

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent className="ui-filter-sheet-panel w-full overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
          <SheetHeader className="border-b border-[#E5EBF4] p-0 pb-4 text-left">
            <div className="flex items-start justify-between gap-4 pr-10">
              <div className="space-y-1">
                <SheetTitle className="text-lg font-semibold text-[#143163]">Filtrar {definition.title.toLowerCase()}</SheetTitle>
                <SheetDescription className="text-sm text-[#667085]">{operation === "conta-corrente" ? "Defina os critérios para refinar os movimentos desta conta." : operation === "transferencias" ? "Defina a contraparte, os valores, o estado e o período das transferências desta conta." : operation === "pagamentos" ? "Defina o beneficiário, o serviço, o estado e o período dos pagamentos desta conta." : operation === "pagamentos-referencia" || operation === "depositos-referencia" ? "Filtre por referência, estados do pagamento e período." : operation === "pagamentos-gpo" ? "Filtre por referências, telefone, estado, montante e período." : operation === "pagamento-gpo" ? "Defina montante, canal, estado e período dos depósitos GPO." : operation === "levantamentos" ? "Defina IBAN, valores, responsável, estado e período dos levantamentos." : "Escolha o estado e o período das operações desta conta."}</SheetDescription>
              </div>
              <SheetClose aria-label="Fechar filtros" className="absolute right-5 top-5 grid size-9 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                <X className="size-4" aria-hidden="true" />
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="grid content-start gap-4 py-2">
            {operation === "pagamentos" && (
              <>
                <TextField
                  label="Beneficiário (nome/telemóvel)"
                  value={filterDraft.beneficiary}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, beneficiary: event.target.value }))}
                />
                <NativeSelectField
                  label="Serviço"
                  value={filterDraft.service}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, service: event.target.value }))}
                >
                  <option value="">Todos os serviços</option>
                  {paymentServiceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
                </NativeSelectField>
              </>
            )}
            {(operation === "pagamentos-referencia" || operation === "depositos-referencia") && (
              <>
                <TextField
                  label="Referência do pagamento"
                  value={filterDraft.paymentReference}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, paymentReference: event.target.value }))}
                />
                <TextField
                  label="ID do pagamento"
                  value={filterDraft.paymentId}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, paymentId: event.target.value }))}
                />
                <NativeSelectField label="Estado do pagamento" value={filterDraft.paymentStatus} onChange={(event) => setFilterDraft((current) => ({ ...current, paymentStatus: event.target.value }))}>
                  <option value="">Todos</option>
                  <option value="SUCCESS">Sucesso</option>
                  <option value="ERROR">Falhou</option>
                </NativeSelectField>
                <NativeSelectField label="Estado MFT" value={filterDraft.mftStatus} onChange={(event) => setFilterDraft((current) => ({ ...current, mftStatus: event.target.value }))}>
                  <option value="">Todos</option>
                  <option value="SUCCESS">Sucesso</option>
                  <option value="ERROR">Falhou</option>
                  <option value="PENDING">Pendente</option>
                </NativeSelectField>
                <NativeSelectField label="Estado PRT" value={filterDraft.prtStatus} onChange={(event) => setFilterDraft((current) => ({ ...current, prtStatus: event.target.value }))}>
                  <option value="">Todos</option>
                  <option value="SUCCESS">Sucesso</option>
                  <option value="ERROR">Falhou</option>
                  <option value="PENDING">Pendente</option>
                </NativeSelectField>
              </>
            )}
            {operation === "pagamentos-gpo" && (
              <>
                <TextField
                  label="Referência do pagamento"
                  value={filterDraft.paymentReference}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, paymentReference: event.target.value }))}
                />
                <TextField
                  label="Referência da transação"
                  value={filterDraft.transactionReference}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, transactionReference: event.target.value }))}
                />
                <TextField
                  label="Número de telemóvel"
                  value={filterDraft.phoneNumber}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, phoneNumber: event.target.value }))}
                />
                <TextField
                  label="ID externo do pagamento"
                  value={filterDraft.externalPaymentId}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, externalPaymentId: event.target.value }))}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Montante mínimo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.minimumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, minimumAmount: event.target.value }))}
                  />
                  <TextField
                    label="Montante máximo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.maximumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, maximumAmount: event.target.value }))}
                  />
                </div>
              </>
            )}
            {operation === "pagamento-gpo" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Montante mínimo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.minimumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, minimumAmount: event.target.value }))}
                  />
                  <TextField
                    label="Montante máximo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.maximumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, maximumAmount: event.target.value }))}
                  />
                </div>
                <NativeSelectField label="Canal de entrada" value={filterDraft.channel} onChange={(event) => setFilterDraft((current) => ({ ...current, channel: event.target.value }))}>
                  <option value="">Todos os canais</option>
                  <option value="M. Express">M. Express</option>
                  <option value="P. Refenrencia">Por referência</option>
                </NativeSelectField>
              </>
            )}
            {operation === "levantamentos" && (
              <>
                <TextField
                  label="IBAN"
                  value={filterDraft.iban}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, iban: event.target.value }))}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Valor mínimo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.minimumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, minimumAmount: event.target.value }))}
                  />
                  <TextField
                    label="Valor máximo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filterDraft.maximumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, maximumAmount: event.target.value }))}
                  />
                </div>
                {withdrawalTab === "processed" && (
                  <NativeSelectField
                    label="Responsável"
                    value={filterDraft.responsible}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, responsible: event.target.value }))}
                  >
                    <option value="">Todos os responsáveis</option>
                    {managersQuery.data?.dados?.map((manager: { name?: string }) => manager.name
                      ? <option key={manager.name} value={manager.name}>{manager.name}</option>
                      : null)}
                  </NativeSelectField>
                )}
              </>
            )}
            {operation === "conta-corrente" && (
              <>
                <NativeSelectField
                  label="Tipo de transação"
                  value={filterDraft.transactionType}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, transactionType: event.target.value, status: "" }))}
                >
                  <option value="">Todos os tipos</option>
                  <option value="Transaction">Transferência</option>
                  <option value="Withdrawal">Levantamento</option>
                  <option value="PgsPayment">Pagamento</option>
                  <option value="PaymentReferences">Pag. Referência</option>
                  <option value="DepositGpoFrame">Depósito</option>
                  <option value="CampaignReward">Promoção</option>
                  <option value="Referral">Bónus de convite</option>
                  <option value="MerchantTransaction">Transacção via API</option>
                </NativeSelectField>
                <NativeSelectField
                  label="Tipo de movimento"
                  value={filterDraft.signal}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, signal: event.target.value }))}
                >
                  <option value="">Todos os movimentos</option>
                  <option value="CREDIT">Crédito</option>
                  <option value="DEBIT">Débito</option>
                </NativeSelectField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Valor mínimo"
                    type="number"
                    min="0"
                    value={filterDraft.minimumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, minimumAmount: event.target.value }))}
                  />
                  <TextField
                    label="Valor máximo"
                    type="number"
                    min="0"
                    value={filterDraft.maximumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, maximumAmount: event.target.value }))}
                  />
                </div>
              </>
            )}
            {operation === "transferencias" && (
              <>
                <TextField
                  label="Utilizador da contraparte (Nome/Telemóvel)"
                  value={filterDraft.counterparty}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, counterparty: event.target.value }))}
                />
                <NativeSelectField
                  label="Tipo de conta da contraparte"
                  value={filterDraft.counterpartyType}
                  onChange={(event) => setFilterDraft((current) => ({ ...current, counterpartyType: event.target.value }))}
                >
                  <option value="">Todos os tipos</option>
                  <option value="User">Particular</option>
                  <option value="Merchant">Empresa</option>
                </NativeSelectField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Valor mínimo"
                    type="number"
                    min="0"
                    value={filterDraft.minimumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, minimumAmount: event.target.value }))}
                  />
                  <TextField
                    label="Valor máximo"
                    type="number"
                    min="0"
                    value={filterDraft.maximumAmount}
                    onChange={(event) => setFilterDraft((current) => ({ ...current, maximumAmount: event.target.value }))}
                  />
                </div>
              </>
            )}
            {operation !== "pagamentos-referencia" && operation !== "depositos-referencia" && (operation !== "levantamentos" || withdrawalTab === "processed") && (
            <NativeSelectField label={operation === "pagamentos-gpo" ? "Estado do pagamento" : operation === "pagamento-gpo" ? "Estado do depósito" : operation === "levantamentos" ? "Estado do pedido" : "Estado"} value={filterDraft.status} onChange={(event) => setFilterDraft((current) => ({ ...current, status: event.target.value }))}>
              {operation !== "levantamentos" && <option value="">Todos os estados</option>}
              {operation === "conta-corrente" ? (
                <>
                  <option value={filterDraft.transactionType === "Withdrawal" || filterDraft.transactionType === "DepositGpoFrame" ? "ACCEPTED" : filterDraft.transactionType === "Transaction" ? "PAID" : filterDraft.transactionType === "MerchantTransaction" ? "APPROVED" : "SUCCESS"}>Concluído</option>
                  {filterDraft.transactionType !== "PgsPayment" && <option value="PENDING">Pendente</option>}
                  <option value={filterDraft.transactionType === "PgsPayment" ? "ERROR" : "REJECTED"}>Falhou</option>
                </>
              ) : operation === "pagamentos" ? (
                <>
                  <option value="SUCCESS">Sucesso</option>
                  <option value="ERROR">Falhou</option>
                </>
              ) : operation === "pagamentos-gpo" ? (
                <>
                  <option value="PAID">Concluído</option>
                  <option value="PENDING">Pendente</option>
                  <option value="REJECTED">Falhou</option>
                </>
              ) : operation === "transferencias" ? (
                <>
                  <option value="PAID">Processada</option>
                  <option value="PENDING">Pendente</option>
                  <option value="REJECTED">Não processada</option>
                </>
              ) : operation === "pagamento-gpo" ? (
                <>
                  <option value="ACCEPTED">Concluído</option>
                  <option value="PENDING">Pendente</option>
                  <option value="REJECTED">Rejeitado</option>
                  <option value="EXPIRED">Expirado</option>
                  <option value="REFUNDED">Reembolso</option>
                </>
              ) : operation === "levantamentos" ? (
                <>
                  <option value="ACCEPTED">Processado</option>
                  <option value="REJECTED">Recusado</option>
                </>
              ) : (
                <>
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                  <option value="ACCEPTED">Aceite</option>
                  <option value="REJECTED">Recusado</option>
                  <option value="CANCELED">Cancelado</option>
                  <option value="FAILED">Falhou</option>
                  <option value="PROCESSING">Em processamento</option>
                </>
              )}
            </NativeSelectField>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateField label="Data inicial" value={filterDraft.dateStart} onChange={(event) => setFilterDraft((current) => ({ ...current, dateStart: event.target.value }))} />
              <DateField label="Data final" value={filterDraft.dateEnd} onChange={(event) => setFilterDraft((current) => ({ ...current, dateEnd: event.target.value }))} />
            </div>
            {filterDraft.dateStart && filterDraft.dateEnd && filterDraft.dateStart > filterDraft.dateEnd && <p className="text-sm text-[#B42318]">A data inicial deve ser anterior à data final.</p>}
            {hasInvalidMovementAmountRange && <p className="text-sm text-[#B42318]">O valor mínimo não pode ser superior ao valor máximo.</p>}
            {hasInvalidTransferAmountRange && <p className="text-sm text-[#B42318]">O valor mínimo não pode ser superior ao valor máximo.</p>}
            {hasInvalidGpoAmountRange && <p className="text-sm text-[#B42318]">O montante mínimo não pode ser superior ao montante máximo.</p>}{hasInvalidWithdrawalAmountRange && <p className="text-sm text-[#B42318]">O valor mínimo não pode ser superior ao valor máximo.</p>}
          </div>
          <SheetFooter className="mt-auto border-t border-[#E5EBF4] p-0 pt-4">
            <Button type="button" className="h-11 w-full bg-[#143163] text-white hover:bg-[#1D467F]" disabled={Boolean((filterDraft.dateStart && filterDraft.dateEnd && filterDraft.dateStart > filterDraft.dateEnd) || hasInvalidMovementAmountRange || hasInvalidTransferAmountRange || hasInvalidGpoAmountRange || hasInvalidWithdrawalAmountRange)} onClick={applyFilterDraft}>Filtrar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={exportOpen} onOpenChange={setExportOpen}>
        <SheetContent className="ui-export-sheet w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="ui-export-header text-left">
            <SheetTitle className="text-lg font-semibold text-[#143163]">Exportar {definition.title.toLowerCase()}</SheetTitle>
            <SheetDescription className="text-sm text-[#667085]">Configure os dados do ficheiro. A exportação permanece limitada a esta conta.</SheetDescription>
            <SheetClose aria-label="Fechar exportação" className="ui-export-close"><X className="size-4" aria-hidden="true" /></SheetClose>
          </SheetHeader>
          <div className="grid gap-4">
            {operation === "levantamentos" && <NativeSelectField label="Formato do ficheiro" value={exportFormat} onChange={(event) => setExportFormat(event.target.value as "csv" | "xlsx")}>
              <option value="csv">CSV</option><option value="xlsx">Excel (.xlsx)</option>
            </NativeSelectField>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateField label="Data inicial" value={exportDraft.dateStart} onChange={(event) => setExportDraft((current) => ({ ...current, dateStart: event.target.value }))} />
              <DateField label="Data final" value={exportDraft.dateEnd} onChange={(event) => setExportDraft((current) => ({ ...current, dateEnd: event.target.value }))} />
            </div>
            <NativeSelectField label="Estado" value={exportDraft.status} onChange={(event) => setExportDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="">Todos os estados</option>
              {operation === "pagamentos" ? (
                <>
                  <option value="SUCCESS">Sucesso</option>
                  <option value="ERROR">Falhou</option>
                </>
              ) : operation === "pagamentos-gpo" ? (
                <>
                  <option value="PAID">Concluído</option>
                  <option value="PENDING">Pendente</option>
                  <option value="REJECTED">Falhou</option>
                </>
              ) : operation === "conta-corrente" ? (
                <>
                  <option value={movementFilters.transactionType === "Withdrawal" || movementFilters.transactionType === "DepositGpoFrame" ? "ACCEPTED" : movementFilters.transactionType === "Transaction" ? "PAID" : movementFilters.transactionType === "MerchantTransaction" ? "APPROVED" : "SUCCESS"}>Concluído</option>
                  {movementFilters.transactionType !== "PgsPayment" && <option value="PENDING">Pendente</option>}
                  <option value={movementFilters.transactionType === "PgsPayment" ? "ERROR" : "REJECTED"}>Falhou</option>
                </>
              ) : (
                <>
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                  <option value="ACCEPTED">Aceite</option>
                  <option value="REJECTED">Recusado</option>
                  <option value="CANCELED">Cancelado</option>
                  <option value="FAILED">Falhou</option>
                  <option value="PROCESSING">Em processamento</option>
                </>
              )}
            </NativeSelectField>
            <FormField label="Registos">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${exportDraft.scope === "all" ? "border-[#143163] bg-[#F5F7FB]" : "border-[#D7E2F2] bg-white"}`}>
                  <input type="radio" name="export-scope" checked={exportDraft.scope === "all"} onChange={() => setExportDraft((current) => ({ ...current, scope: "all" }))} className="mt-1 accent-[#143163]" />
                  <span><strong className="block text-[#143163]">Todos os resultados</strong><span className="text-xs text-[#667085]">Aplicar filtros e pesquisa.</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${exportDraft.scope === "page" ? "border-[#143163] bg-[#F5F7FB]" : "border-[#D7E2F2] bg-white"}`}>
                  <input type="radio" name="export-scope" checked={exportDraft.scope === "page"} onChange={() => setExportDraft((current) => ({ ...current, scope: "page" }))} className="mt-1 accent-[#143163]" />
                  <span><strong className="block text-[#143163]">Página actual</strong><span className="text-xs text-[#667085]">Máximo de {perPage} registos.</span></span>
                </label>
              </div>
            </FormField>
            <FormField label="Colunas do ficheiro">
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {definition.columns.map((column) => (
                  <label key={column.label} className="flex cursor-pointer items-center gap-2 text-sm text-[#344054]">
                    <Checkbox checked={exportColumns.includes(column.label)} onCheckedChange={(checked) => setExportColumns((current) => checked ? [...current, column.label] : current.filter((label) => label !== column.label))} />
                    {column.label}
                  </label>
                ))}
              </div>
            </FormField>
            {exportDraft.dateStart && exportDraft.dateEnd && exportDraft.dateStart > exportDraft.dateEnd && <p className="text-sm text-[#B42318]">A data inicial não pode ser posterior à data final.</p>}
          </div>
          <SheetFooter className="ui-export-footer border-t border-[#E5EBF4] pt-4 sm:flex-row">
            <Button type="button" className="ui-export-submit" disabled={isExporting || exportColumns.length === 0 || Boolean(exportDraft.dateStart && exportDraft.dateEnd && exportDraft.dateStart > exportDraft.dateEnd)} onClick={exportRows}>
              <Download aria-hidden="true" /> {isExporting ? "A preparar ficheiro..." : operation === "levantamentos" && exportFormat === "xlsx" ? "Exportar Excel" : "Exportar CSV"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(actionState)} onOpenChange={(open) => { if (!open && !isActionPending) { setActionState(undefined); setMotivo("") } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#143163]">
              {actionState?.type === "confirm"
                ? actionState.ids ? "Processar pedidos" : "Processar levantamento"
                : actionState?.ids ? "Recusar pedidos" : "Recusar levantamento"}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#667085]">
              {actionState?.type === "confirm"
                ? actionState.ids ? `Confirma o processamento de ${withdrawalActionDescription}?` : "Confirma o processamento deste pedido?"
                : actionState?.ids ? `Seleccione o motivo da recusa para ${withdrawalActionDescription}.` : "Seleccione o motivo da recusa deste pedido."}
            </DialogDescription>
          </DialogHeader>
          {actionState?.type === "reject" && (
            <NativeSelectField label="Motivo da recusa" value={motivo} onChange={(event) => setMotivo(event.target.value)}>
              <option value="">Seleccionar motivo...</option>
              <option value="IBAN Inválido">IBAN inválido</option>
              <option value="Outro Motivo">Outro motivo</option>
            </NativeSelectField>
          )}
          <DialogFooter className="sm:flex-row">
            <Button type="button" variant="outline" className="border-[#D7E2F2] text-[#143163]" disabled={isActionPending} onClick={() => { setActionState(undefined); setMotivo("") }}>Cancelar</Button>
            <Button type="button" variant={actionState?.type === "confirm" ? "default" : "destructive"} className={actionState?.type === "confirm" ? "bg-[#14883B] text-white hover:bg-[#0F6D2F]" : ""} disabled={isActionPending || (actionState?.type === "reject" && !motivo)} onClick={executeWithdrawalAction}>
              {isActionPending ? "A processar..." : actionState?.type === "confirm"
                ? actionState.ids ? `Processar ${withdrawalActionCount} ${withdrawalActionCount === 1 ? "pedido" : "pedidos"}` : "Processar levantamento"
                : actionState?.ids ? `Recusar ${withdrawalActionCount} ${withdrawalActionCount === 1 ? "pedido" : "pedidos"}` : "Recusar levantamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
