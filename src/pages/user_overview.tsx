import { api } from "@/api"
import { formatNumberPtAO } from "@/components/utils/formmat"
import { Spinner } from "@/components/utils/spinner"
import { useQueries } from "@tanstack/react-query"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  CircleAlert,
  CreditCard,
  Landmark,
  ListChecks,
  RefreshCw,
  Wallet,
} from "lucide-react"
import { useUserContext, type UserContextAccount } from "@/pages/user_context_types"

type SummaryItem = {
  id?: string | number
  type?: string
  signal?: string
  created_at?: string
  amount?: string | number
  valor?: string | number
  description?: string
}

type SummaryResponse = {
  dados?: SummaryItem[]
  total?: string | number
  total_amount?: string | number
  total_payment?: string | number
  total_number?: string | number
}

type SummaryQuery = {
  isPending: boolean
  isError: boolean
  data?: SummaryResponse
}

function toNumber(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value === "number") return value

  const normalized = value.trim().replace(/\s/g, "")
  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized)

  return Number.isFinite(parsed) ? parsed : undefined
}

function formatAmount(value: string | number | undefined) {
  const numericValue = toNumber(value)
  return numericValue === undefined ? "—" : `${formatNumberPtAO(numericValue, 2)} Kz`
}

function formatCount(value: string | number | undefined) {
  const numericValue = toNumber(value)
  return numericValue === undefined ? "—" : formatNumberPtAO(numericValue)
}

function formatDate(value?: string) {
  if (!value) return "Data não disponível"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-AO", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function getUserName(user: UserContextAccount) {
  if (user.account_type === "Merchant" || user.business_name) return user.business_name || ""
  return [user.first_name, user.last_name].filter(Boolean).join(" ")
}

function getAccountType(user: UserContextAccount) {
  return user.account_type || (user.business_name ? "Merchant" : "User")
}

function fetchSummary(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams({ per_page: "1", page: "1", ...params })
  return api.get<SummaryResponse>(`${path}?${searchParams.toString()}`).then(({ data }) => data)
}

function getAvailableMetric(query: SummaryQuery, field: keyof SummaryResponse) {
  if (query.isPending) return "..."
  if (query.isError) return "—"
  return formatAmount(query.data?.[field] as string | number | undefined)
}

function getAvailableCount(query: SummaryQuery) {
  if (query.isPending) return "..."
  if (query.isError) return "—"
  return formatCount(query.data?.total ?? query.data?.total_number)
}

function getActivityLabel(activity: SummaryItem) {
  const type = (activity.type || "Operação").toLowerCase()
  if (type.includes("withdrawal")) return "Levantamento"
  if (type.includes("deposit")) return "Depósito"
  if (type.includes("paymentreference") || type.includes("reference")) return "Pagamento por referência"
  if (type.includes("pgspayment") || type.includes("payment")) return "Pagamento"
  if (type.includes("transaction")) return "Transferência"
  return activity.type || "Operação"
}

function getActivityAmount(activity: SummaryItem) {
  return activity.amount ?? activity.valor
}

type MetricCardProps = {
  label: string
  value: string
  helper: string
  icon: typeof Wallet
}

function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-[#E2E6ED] bg-white p-5 shadow-[0px_2px_10px_rgba(20,49,99,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#6B7280]">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 break-words text-2xl font-bold text-[#143163]">{value}</p>
      <p className="mt-2 text-xs text-[#7C8799]">{helper}</p>
    </article>
  )
}

export default function UserOverview() {
  const user = useUserContext()
  const userName = getUserName(user)
  const accountType = getAccountType(user)
  const userIdentifier = user.phone_number || userName
  const queryEnabled = Boolean(user.id && userIdentifier)

  const queries = useQueries({
    queries: [
      {
        queryKey: ["user-context-transfers-sent", user.id, userName, accountType],
        queryFn: () => fetchSummary("/front/transaction", { sender_name: userName, sender_type: accountType }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-transfers-received", user.id, userName, accountType],
        queryFn: () => fetchSummary("/front/transaction", { receiver_name: userName, receiver_type: accountType }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-payments", user.id, userName, accountType],
        queryFn: () => fetchSummary("/front/pgs_payment", { users_name: userName, account_type: accountType }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-deposits", user.id, userIdentifier, accountType],
        queryFn: () => fetchSummary("/front/deposit_gpo_frame", { user_name_phone: userIdentifier, account_type: accountType }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-withdrawals", user.id, userIdentifier, accountType],
        queryFn: () => fetchSummary("/front/withdrawal", { user_name_phone: userIdentifier, account_type: accountType }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-reference-payments", user.id, userName],
        queryFn: () => fetchSummary("/front/payment_reference", { users_name: userName }),
        enabled: queryEnabled,
      },
      {
        queryKey: ["user-context-activities", user.id, userName, accountType],
        queryFn: () => fetchSummary("/front/activities", { user_name: userName, account_type: accountType, per_page: "5" }),
        enabled: queryEnabled,
      },
    ],
  }) as SummaryQuery[]

  const [transfersSent, transfersReceived, payments, deposits, withdrawals, referencePayments, activities] = queries
  const transfersUnavailable = transfersSent.isPending || transfersReceived.isPending || transfersSent.isError || transfersReceived.isError
  const transfersCount = transfersUnavailable
    ? transfersSent.isPending || transfersReceived.isPending ? "..." : "—"
    : formatCount((toNumber(transfersSent.data?.total) || 0) + (toNumber(transfersReceived.data?.total) || 0))
  const transfersAmount = transfersUnavailable
    ? transfersSent.isPending || transfersReceived.isPending ? "..." : "—"
    : formatAmount((toNumber(transfersSent.data?.total_amount) || 0) + (toNumber(transfersReceived.data?.total_amount) || 0))

  const activityItems = activities.data?.dados || []
  const summaryUnavailable = queries.some((query) => query.isError)

  return (
    <div className="ui-context-page space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
          <h2 className="mt-1 text-2xl font-bold text-[#143163]">Visão Geral</h2>
        </div>
        <p className="text-sm text-[#6B7280]">Indicadores associados a {userName || "este utilizador"}</p>
      </div>

      {summaryUnavailable && (
        <div className="flex items-start gap-3 rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-3 text-sm text-[#765500]" role="status">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Alguns indicadores não puderam ser carregados. Os valores indisponíveis são apresentados como “—”.</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Saldo disponível" value={formatAmount(user.balance)} helper="Saldo do registo do utilizador" icon={Wallet} />
        <MetricCard label="Transferências" value={transfersCount} helper={`Volume: ${transfersAmount}`} icon={ArrowUpRight} />
        <MetricCard label="Depósitos" value={getAvailableMetric(deposits, "total_amount")} helper={`Operações: ${getAvailableCount(deposits)}`} icon={ArrowDownToLine} />
        <MetricCard label="Levantamentos" value={getAvailableMetric(withdrawals, "total_amount")} helper={`Operações: ${getAvailableCount(withdrawals)}`} icon={ArrowUpFromLine} />
        <MetricCard label="Pagamentos" value={getAvailableMetric(payments, "total_payment")} helper={`Operações: ${getAvailableCount(payments)}`} icon={CreditCard} />
        <MetricCard label="Pagamentos por referência" value={getAvailableMetric(referencePayments, "total_amount")} helper={`Operações: ${getAvailableCount(referencePayments)}`} icon={Landmark} />
        <MetricCard label="Saldo total" value="—" helper="Indicador global não aplicado ao contexto individual" icon={RefreshCw} />
        <MetricCard label="Actividade recente" value={activities.isPending ? "..." : formatCount(activityItems.length)} helper="Últimas operações disponíveis" icon={ListChecks} />
      </div>

      <section className="rounded-xl border border-[#E2E6ED] bg-white shadow-[0px_2px_10px_rgba(20,49,99,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBECEF] px-5 py-4">
          <div>
            <h3 className="font-bold text-[#143163]">Actividade recente</h3>
            <p className="mt-1 text-xs text-[#7C8799]">Operações associadas à conta seleccionada</p>
          </div>
          <span className="rounded-full bg-[#EEF1F6] px-3 py-1 text-xs font-semibold text-[#4B5563]">Últimas 5</span>
        </div>

        {activities.isPending ? (
          <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-[#6B7280]">
            <Spinner color="#143163" width="18" height="18" />
            A carregar actividade...
          </div>
        ) : activities.isError ? (
          <div className="px-5 py-10 text-center text-sm text-[#6B7280]">Não foi possível carregar a actividade desta conta.</div>
        ) : activityItems.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#6B7280]">Não existem actividades recentes para apresentar.</div>
        ) : (
          <div className="divide-y divide-[#EBECEF]">
            {activityItems.map((activity, index) => (
              <div key={activity.id ?? `${activity.created_at}-${index}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex min-w-[220px] items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${activity.signal?.toLowerCase() === "credit" ? "bg-[#E2F6E8] text-[#14883B]" : "bg-[#FDE7E7] text-[#B42318]"}`}>
                    {activity.signal?.toLowerCase() === "credit" ? <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> : <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#143163]">{getActivityLabel(activity)}</p>
                    <p className="mt-1 text-xs text-[#7C8799]">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#143163]">{formatAmount(getActivityAmount(activity))}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
