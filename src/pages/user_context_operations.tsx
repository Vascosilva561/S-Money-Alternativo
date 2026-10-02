import { api } from "@/api"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import { Checkbox } from "@/components/ui/checkbox"
import { generatePaginationRange } from "@/hooks/generatePaginationRange"
import DetalhesMovimentos from "@/components/movimentos/details"
import DetalhesPagamentoReference from "@/components/pagamento-referenecia/details"
import DetalhesDeposito from "@/components/pagamentosGPO/details"
import DetalhesPagamento from "@/components/pagamentos/detalhes"
import DetalhesLevantamento from "@/components/levantamentos/details"
import DetalhesTransferencia from "@/components/tranferenciaSOmoney/detalhes"
import { formatDateTime, formatNumberPtAO } from "@/components/utils/formmat"
import GetServicesIcon from "@/components/utils/getServicesIcon"
import { TableActionButton } from "@/components/ui/table-action-button"
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
import { statusTransactions } from "@/components/utils/statusTransactions"
import { statusTransactionsColor } from "@/components/utils/statusTransactionsColor"
import { Button } from "@/components/ui/button"
import { DateField, FormField, NativeSelectField } from "@/components/ui/form-field"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Check,
  Download,
  FileDown,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useUserContext, type UserContextAccount } from "@/pages/user_context_types"

export type UserContextOperationKey =
  | "transferencias"
  | "pagamentos"
  | "pagamentos-referencia"
  | "pagamento-gpo"
  | "depositos"
  | "levantamentos"
  | "conta-corrente"

type ContextRow = Record<string, unknown>

type ContextResponse = {
  dados: ContextRow[]
  total?: string | number
  total_amount?: string | number
  total_payment?: string | number
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
  detail: "transfer" | "payment" | "reference" | "gpo" | "withdrawal" | "movement"
  endpoint: string
}

type ActionState = {
  type: "confirm" | "reject"
  row: ContextRow
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
    ?? getNestedValue(row, ["detalhe", "transaction", "amount"])
    ?? getNestedValue(row, ["detalhe", "withdrawal", "amount"])
    ?? getNestedValue(row, ["detalhe", "pgs_payment", "amount"])
    ?? getNestedValue(row, ["detalhe", "deposit_gpo_frame", "amount"])
    ?? getNestedValue(row, ["detalhe", "payment_references", "amount"])
}

function getRowDate(row: ContextRow) {
  return row.created_at
    ?? getNestedValue(row, ["detalhe", "transaction", "created_at"])
    ?? getNestedValue(row, ["detalhe", "withdrawal", "created_at"])
}

function getRowStatus(row: ContextRow) {
  return String(row.status ?? getNestedValue(row, ["detalhe", "transaction", "status"]) ?? "")
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
    case "reference":
      return { label: statusPayment(status) || "—", classes: statusPaymentColor(status) || neutralStatusClasses }
    case "gpo":
      return { label: statusDeposit(status) || "—", classes: statusDepositColor(status) || neutralStatusClasses }
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
        render: (row) => <span className="font-semibold">{getString(row, "sender_name") || "—"}</span>,
        className: "min-w-[180px]",
      },
      {
        label: "Destinatário",
        render: (row) => <span className="font-semibold">{getString(row, "receiver_name") || "—"}</span>,
        className: "min-w-[180px]",
      },
      ...getCommonColumns("transfer").slice(1),
    ],
  },
  pagamentos: {
    title: "Pagamentos",
    description: "Pagamentos realizados pela conta, seguindo o fluxo de consulta existente.",
    endpoint: "/front/pgs_payment",
    detail: "payment",
    columns: [
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
      ...getCommonColumns("payment"),
    ],
  },
  "pagamentos-referencia": {
    title: "Pag. Referência",
    description: "Pagamentos por referência associados à conta seleccionada.",
    endpoint: "/front/payment_reference",
    detail: "reference",
    columns: [
      {
        label: "Referência",
        render: (row) => <span className="font-semibold">{getString(row, "reference") || "—"}</span>,
        className: "min-w-[160px]",
      },
      {
        label: "Canal",
        render: (row) => getString(row, "channel") || "—",
        className: "min-w-[140px]",
      },
      ...getCommonColumns("reference").slice(1),
    ],
  },
  "pagamento-gpo": {
    title: "Pagamento GPO",
    description: "Operações GPO ligadas à conta seleccionada.",
    endpoint: "/front/deposit_gpo_frame",
    detail: "gpo",
    columns: [
      {
        label: "Referência",
        render: (row) => <span className="font-semibold">{getString(row, "payment_reference") || "—"}</span>,
        className: "min-w-[170px]",
      },
      {
        label: "Canal",
        render: (row) => getString(row, "canal") || "—",
        className: "min-w-[120px]",
      },
      ...getCommonColumns("gpo").slice(1),
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
        label: "Operação",
        render: (row) => <span className="font-semibold">{getString(row, "type") || "—"}</span>,
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
}

function normaliseResponse(data: unknown): ContextResponse {
  const response = getObject(data)
  const rows = response?.dados
  return {
    dados: Array.isArray(rows) ? rows.filter((row): row is ContextRow => Boolean(getObject(row))) : [],
    total: response?.total as string | number | undefined,
    total_amount: response?.total_amount as string | number | undefined,
    total_payment: response?.total_payment as string | number | undefined,
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
) {
  const userName = getUserName(user)
  const accountType = getAccountType(user)
  const userIdentifier = user.phone_number || userName
  const commonParams = {
    per_page: String(perPage),
    page: String(page),
    status,
    data_inicio: dateStart,
    data_fim: dateEnd,
  }

  if (definition.title === "Transferências") {
    const [sent, received] = await Promise.all([
      api.get(`${definition.endpoint}?${new URLSearchParams({
        ...commonParams,
        sender_name: userName,
        sender_type: accountType,
      })}`),
      api.get(`${definition.endpoint}?${new URLSearchParams({
        ...commonParams,
        receiver_name: userName,
        receiver_type: accountType,
      })}`),
    ])
    const sentResponse = normaliseResponse(sent.data)
    const receivedResponse = normaliseResponse(received.data)
    const uniqueRows = Array.from(new Map([...sentResponse.dados, ...receivedResponse.dados].map((row, index) => [getString(row, "id") || String(index), row])).values())
    return {
      dados: uniqueRows,
      total: sumValues(sentResponse.total, receivedResponse.total),
      total_amount: sumValues(sentResponse.total_amount, receivedResponse.total_amount),
    }
  }

  const params: Record<string, string> = {
    ...commonParams,
    ...(definition.title === "Pagamentos" ? { users_name: userName, account_type: accountType } : {}),
    ...(definition.title === "Pag. Referência" ? { users_name: userName } : {}),
    ...(definition.title === "Pagamento GPO" ? { user_name_phone: userIdentifier, account_type: accountType } : {}),
    ...(definition.title === "Depósitos" ? { user_name: userName, account_type: accountType, type: "DepositGpoFrame" } : {}),
    ...(definition.title === "Levantamentos" ? { user_name_phone: userIdentifier, account_type: accountType } : {}),
    ...(definition.title === "Movimentos" ? { user_name: userName, account_type: accountType } : {}),
  }

  const { data } = await api.get(`${definition.endpoint}?${new URLSearchParams(params)}`)
  return normaliseResponse(data)
}

function DetailsPanel({ detail, row, onClose }: { detail: OperationDefinition["detail"]; row: ContextRow; onClose: () => void }) {
  if (detail === "transfer") return <DetalhesTransferencia itemSelected={row} isOpen onClose={onClose} />
  if (detail === "payment") return <DetalhesPagamento itemSelected={row} isOpen onClose={onClose} />
  if (detail === "reference") return <DetalhesPagamentoReference itemSelected={row} isOpen onClose={onClose} />
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

function getExportValue(column: OperationColumn, row: ContextRow, detail: OperationDefinition["detail"]) {
  if (column.label === "ID") return getString(row, "id") || "—"
  if (column.label === "Valor") return formatAmount(getRowAmount(row))
  if (column.label === "Data") return formatDate(getRowDate(row))
  if (column.label === "Estado") return getStatusDisplay(row, detail).label
  if (column.label === "Remetente") return getString(row, "sender_name") || "—"
  if (column.label === "Destinatário") return getString(row, "receiver_name") || "—"
  if (column.label === "Referência") return getString(row, "reference") || getString(row, "payment_reference") || "—"
  if (column.label === "Canal") return getString(row, "channel") || getString(row, "canal") || "—"
  if (column.label === "IBAN") return getString(row, "iban") || "—"
  if (column.label === "Movimento") return getString(row, "signal") || "—"
  if (column.label === "Operação") return getString(row, "type") || "Depósito"

  const rendered = column.render(row)
  return typeof rendered === "string" || typeof rendered === "number" ? String(rendered) : "—"
}

function downloadCsv(definition: OperationDefinition, rows: ContextRow[], selectedColumns: string[]) {
  const columns = definition.columns.filter((column) => selectedColumns.includes(column.label))
  const headers = columns.map((column) => column.label)
  const values = rows.map((row) => columns.map((column) => getExportValue(column, row, definition.detail)))
  const csv = [headers, ...values].map((line) => line.map((value) => `"${value.replace(/"/g, '""')}"`).join(";")).join("\r\n")
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${definition.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function UserContextOperationsPage({ operation, title, embeddedInDeposits = false }: { operation: UserContextOperationKey; title?: string; embeddedInDeposits?: boolean }) {
  const user = useUserContext()
  const definition = operationDefinitions[operation]
  const pageTitle = title || definition.title
  const [page, setPage] = useState(1)
  const perPage = 100
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterDraft, setFilterDraft] = useState({ status: "", dateStart: "", dateEnd: "" })
  const [exportOpen, setExportOpen] = useState(false)
  const [exportDraft, setExportDraft] = useState({ status: "", dateStart: "", dateEnd: "", scope: "all" as "all" | "page" })
  const [exportColumns, setExportColumns] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [selectedRow, setSelectedRow] = useState<ContextRow>()
  const [actionState, setActionState] = useState<ActionState>()
  const [motivo, setMotivo] = useState("")
  const [isActionPending, setIsActionPending] = useState(false)

  const operationQuery = useQuery<ContextResponse>({
    queryKey: ["user-context-operation", operation, user.id, user.phone_number, page, perPage, status, dateStart, dateEnd],
    queryFn: () => requestOperation(definition, user, page, perPage, status, dateStart, dateEnd),
    enabled: Boolean(user.id),
    placeholderData: keepPreviousData,
  })

  const filteredRows = useMemo(() => {
    const rows = operationQuery.data?.dados || []
    const term = search.trim().toLowerCase()
    if (!term) return rows

    return rows.filter((row) => [
      getString(row, "id"),
      getString(row, "sender_name"),
      getString(row, "receiver_name"),
      getString(row, "reference"),
      getString(row, "channel"),
      getString(row, "iban"),
      getString(row, "status"),
      getString(row, "type"),
      String(getRowAmount(row) ?? ""),
    ].some((value) => value.toLowerCase().includes(term)))
  }, [operationQuery.data?.dados, search])

  const totalItems = getTotal(operationQuery.data)
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const paginationRange = generatePaginationRange(totalPages, page)
  const hasFilters = Boolean(search || status || dateStart || dateEnd)

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
      const firstResponse = await requestOperation(definition, user, firstPage, perPage, exportDraft.status, exportDraft.dateStart, exportDraft.dateEnd)
      let rows = [...firstResponse.dados]

      if (exportDraft.scope === "all") {
        const exportPageCount = Math.max(1, Math.ceil(getTotal(firstResponse) / perPage))
        for (let nextPage = 2; nextPage <= exportPageCount; nextPage += 1) {
          const response = await requestOperation(definition, user, nextPage, perPage, exportDraft.status, exportDraft.dateStart, exportDraft.dateEnd)
          rows = rows.concat(response.dados)
        }
      }

      const term = search.trim().toLowerCase()
      if (term) {
        rows = rows.filter((row) => [
          getString(row, "id"), getString(row, "sender_name"), getString(row, "receiver_name"),
          getString(row, "reference"), getString(row, "channel"), getString(row, "iban"),
          getString(row, "status"), getString(row, "type"), String(getRowAmount(row) ?? ""),
        ].some((value) => value.toLowerCase().includes(term)))
      }

      const uniqueRows = Array.from(new Map(rows.map((row, index) => [getString(row, "id") || String(index), row])).values())
      downloadCsv(definition, uniqueRows, exportColumns)
      setExportOpen(false)
      toast.success(`${uniqueRows.length} registo(s) exportado(s) em CSV.`)
    } catch {
      toast.error("Não foi possível preparar a exportação desta conta.")
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setDateStart("")
    setDateEnd("")
    setPage(1)
  }

  const executeWithdrawalAction = async () => {
    if (!actionState) return
    if (actionState.type === "reject" && !motivo) {
      toast.error("Seleccione o motivo da recusa.")
      return
    }

    const id = getString(actionState.row, "id")
    if (!id) {
      toast.error("Não foi possível identificar o levantamento.")
      return
    }

    setIsActionPending(true)
    try {
      if (actionState.type === "confirm") {
        await api.put(`/front/withdrawal/confirm?id=${id}`)
        toast.success("Levantamento processado com sucesso.")
      } else {
        await api.put(`/front/withdrawal/reject?id=${id}&motivo=${encodeURIComponent(motivo)}`)
        toast.success("Levantamento recusado com sucesso.")
      }
      setActionState(undefined)
      setMotivo("")
      await operationQuery.refetch()
    } catch {
      toast.error("Não foi possível concluir a acção sobre o levantamento.")
    } finally {
      setIsActionPending(false)
    }
  }

  return (
    <div className="ui-context-page">
      {!embeddedInDeposits && (
        <div className="mb-5">
          <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
          <h2 className="mt-1 text-2xl font-bold text-[#143163]">{pageTitle}</h2>
          <p className="mt-1 text-sm text-[#6B7280]">{definition.description}</p>
        </div>
      )}

      <section className="ui-data-page rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
        <div className="flex flex-col gap-4 p-5">
          <div className="ui-context-toolbar flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="ui-clear-filter-button">
                  <X className="h-4 w-4" aria-hidden="true" /> Limpar filtros
                </button>
              )}
              <Button type="button" variant="outline" size="icon" aria-label="Filtrar" title="Filtrar" className="ui-filter-trigger" onClick={() => { setFilterDraft({ status, dateStart, dateEnd }); setFiltersOpen(true) }}>
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
                onChange={(event) => { setSearch(event.target.value); setPage(1) }}
                placeholder="Pesquisar nesta conta..."
                className="h-10 w-full rounded-lg border border-[#C9D8E9] bg-white pl-10 pr-3 text-sm text-[#143163] outline-none transition placeholder:text-[#8293AE] focus:border-[#48B9FF] focus:ring-4 focus:ring-[#48B9FF]/15"
                aria-label={`Pesquisar em ${pageTitle}`}
              />
            </div>
          </div>

          <div className="ui-inline-summary ui-context-summary flex items-center text-[14px] text-[#143163]">
            <span><strong>Total geral de registos:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : totalItems || "Nenhum"}</span></span>
            <span className="ui-inline-summary-divider" aria-hidden="true" />
            <span><strong>Valor total:</strong> <span className="font-semibold">{operationQuery.isPending ? "..." : formatAmount(getTotalAmount(operationQuery.data))}</span></span>
          </div>

          {operationQuery.isError ? (
            <div className="rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-6 text-center text-sm text-[#765500]">
              Não foi possível carregar os dados de {definition.title.toLowerCase()} para esta conta.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E5EBF4]">
              <table className="w-full min-w-[920px] border-collapse">
                <caption className="sr-only">{definition.title} da conta seleccionada</caption>
                <thead className="h-12 bg-[#F5F7FB] text-left text-[#143163]">
                  <tr>
                    {definition.columns.map((column) => <th key={column.label} className={column.className || ""}>{column.label}</th>)}
                    <th className="ui-actions-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {operationQuery.isPending ? (
                    <TableStateRow colSpan={definition.columns.length + 1} state="loading" message="A carregar operações..." />
                  ) : filteredRows.length === 0 ? (
                    <TableStateRow colSpan={definition.columns.length + 1} state="empty" message="Nenhum registo encontrado para esta conta." />
                  ) : (
                    filteredRows.map((row, index) => {
                      const rowStatus = getRowStatus(row).toUpperCase()
                      const canProcessWithdrawal = operation === "levantamentos" && rowStatus === "PENDING"
                      return (
                        <tr key={getString(row, "id") || index}>
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
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          <PaginationFooter
            currentPage={page}
            totalPages={totalPages}
            paginationRange={paginationRange}
            onPageChange={setPage}
            onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
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
                <SheetDescription className="text-sm text-[#667085]">Escolha o estado e o período das operações desta conta.</SheetDescription>
              </div>
              <SheetClose aria-label="Fechar filtros" className="absolute right-5 top-5 grid size-9 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                <X className="size-4" aria-hidden="true" />
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="grid content-start gap-4 py-2">
            <NativeSelectField label="Estado" value={filterDraft.status} onChange={(event) => setFilterDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="">Todos os estados</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="ACCEPTED">Aceite</option>
              <option value="REJECTED">Recusado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="FAILED">Falhou</option>
              <option value="PROCESSING">Em processamento</option>
            </NativeSelectField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateField label="Data inicial" value={filterDraft.dateStart} onChange={(event) => setFilterDraft((current) => ({ ...current, dateStart: event.target.value }))} />
              <DateField label="Data final" value={filterDraft.dateEnd} onChange={(event) => setFilterDraft((current) => ({ ...current, dateEnd: event.target.value }))} />
            </div>
            {filterDraft.dateStart && filterDraft.dateEnd && filterDraft.dateStart > filterDraft.dateEnd && <p className="text-sm text-[#B42318]">A data inicial deve ser anterior à data final.</p>}
          </div>
          <SheetFooter className="mt-auto border-t border-[#E5EBF4] p-0 pt-4">
            <Button type="button" className="h-11 w-full bg-[#143163] text-white hover:bg-[#1D467F]" disabled={Boolean(filterDraft.dateStart && filterDraft.dateEnd && filterDraft.dateStart > filterDraft.dateEnd)} onClick={() => { setStatus(filterDraft.status); setDateStart(filterDraft.dateStart); setDateEnd(filterDraft.dateEnd); setPage(1); setFiltersOpen(false) }}>Filtrar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={exportOpen} onOpenChange={setExportOpen}>
        <SheetContent className="ui-export-sheet w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="ui-export-header text-left">
            <SheetTitle className="text-lg font-semibold text-[#143163]">Exportar {definition.title.toLowerCase()}</SheetTitle>
            <SheetDescription className="text-sm text-[#667085]">Configure os dados do ficheiro CSV. A exportação permanece limitada a esta conta.</SheetDescription>
            <SheetClose aria-label="Fechar exportação" className="ui-export-close"><X className="size-4" aria-hidden="true" /></SheetClose>
          </SheetHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateField label="Data inicial" value={exportDraft.dateStart} onChange={(event) => setExportDraft((current) => ({ ...current, dateStart: event.target.value }))} />
              <DateField label="Data final" value={exportDraft.dateEnd} onChange={(event) => setExportDraft((current) => ({ ...current, dateEnd: event.target.value }))} />
            </div>
            <NativeSelectField label="Estado" value={exportDraft.status} onChange={(event) => setExportDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="">Todos os estados</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="ACCEPTED">Aceite</option>
              <option value="REJECTED">Recusado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="FAILED">Falhou</option>
              <option value="PROCESSING">Em processamento</option>
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
              <Download aria-hidden="true" /> {isExporting ? "A preparar ficheiro..." : "Exportar CSV"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(actionState)} onOpenChange={(open) => { if (!open && !isActionPending) { setActionState(undefined); setMotivo("") } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#143163]">{actionState?.type === "confirm" ? "Processar levantamento" : "Recusar levantamento"}</DialogTitle>
            <DialogDescription className="text-sm text-[#667085]">{actionState?.type === "confirm" ? "Confirma o processamento deste pedido?" : "Seleccione o motivo da recusa deste pedido."}</DialogDescription>
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
              {isActionPending ? "A processar..." : actionState?.type === "confirm" ? "Processar levantamento" : "Recusar levantamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
