import { api } from "@/api"
import { DateRangePicker } from "@/components/ui/datepicker-range"
import { formatNumberPtAO } from "@/components/utils/formmat"
import { Spinner } from "@/components/utils/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KpiCard } from "@/components/ui/kpi-card"
import { GetAmount } from "@/components/utils/getAmount"
import { getDateRange } from "@/components/utils/rangeDate"
import { useQueries, useQuery } from "@tanstack/react-query"
import { MerchantActivityChart } from "@/components/dashboard/merchant-activity-chart"
import type { DashboardResponse } from "@/types/dashboardAccounteSelected"
import { useMemo, useState } from "react"
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpRight,
  ArrowUpFromLine,
  CalendarDays,
  CircleAlert,
  CreditCard,
  HandCoins,
  Landmark,
  ListChecks,
  ReceiptText,
  RefreshCw,
  Wallet,
} from "lucide-react"
import { useUserContext, type UserContextAccount } from "@/pages/user_context_types"
import type { FilterOption } from "@/pages/dashboard"
import type { KpiCardTone } from "@/components/ui/kpi-card"

const periodOptions: { key: FilterOption; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "7days", label: "Últimos 7 dias" },
  { key: "30days", label: "30 dias" },
  { key: "custom", label: "Data personalizada" },
]

type CompanyMetric = {
  label: string
  icon: typeof Landmark
  tone: KpiCardTone
  value: (data?: DashboardResponse) => string
  helper?: (data?: DashboardResponse) => string
}

const referenceCompanyMetrics: CompanyMetric[] = [
  { label: "Referências Geradas", icon: Landmark, tone: "blue", value: (data) => formatCount(data?.sector?.total_referencias_geradas) },
  { label: "Referências Geradas Hoje", icon: ReceiptText, tone: "purple", value: (data) => formatCount(data?.sector?.total_referencias_geradas_hoje) },
  { label: "Valor dos Pagamentos do Dia", icon: HandCoins, tone: "green", value: (data) => formatAmount(data?.sector?.total_pagamentos_dia) },
  { label: "Quantidade de Pagamentos do Dia", icon: ReceiptText, tone: "orange", value: (data) => formatCount(data?.sector?.quantidade_pagamentos_dia) },
  { label: "Valor dos Pagamentos Mensais", icon: CalendarDays, tone: "cyan", value: (data) => formatAmount(data?.sector?.total_pagamentos_mensal) },
  { label: "Quantidade de Pagamentos Mensais", icon: ListChecks, tone: "purple", value: (data) => formatCount(data?.sector?.quantidade_pagamentos_mensal) },
]

const gpoCompanyMetrics: CompanyMetric[] = [
  { label: "Valor dos Pagamentos do Dia", icon: HandCoins, tone: "blue", value: (data) => formatAmount(data?.gpo?.total_pagamentos_dia) },
  { label: "Quantidade de Pagamentos do Dia", icon: ReceiptText, tone: "green", value: (data) => formatCount(data?.gpo?.quantidade_pagamentos_dia) },
  { label: "Valor dos Pagamentos Mensais", icon: CalendarDays, tone: "cyan", value: (data) => formatAmount(data?.gpo?.total_pagamentos_mensal) },
  { label: "Quantidade de Pagamentos Mensais", icon: ListChecks, tone: "purple", value: (data) => formatCount(data?.gpo?.quantidade_pagamentos_mensal) },
  { label: "Valor Total dos Pagamentos", icon: CreditCard, tone: "orange", value: (data) => formatAmount(data?.gpo?.total_pagamentos_geral) },
  { label: "Quantidade Total de Pagamentos", icon: ReceiptText, tone: "slate", value: (data) => formatCount(data?.gpo?.quantidade_pagamentos_geral) },
]

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

function getActivityAmount(activity: SummaryItem): number | undefined {
  const amount = toNumber(GetAmount(activity) ?? undefined) ?? toNumber(activity.amount ?? activity.valor)
  if (amount === undefined) return undefined

  const isDebit = activity.signal?.trim().toUpperCase() === "DEBIT"
  return isDebit ? -Math.abs(amount) : Math.abs(amount)
}

export default function UserOverview() {
  const user = useUserContext()
  const userName = getUserName(user)
  const accountType = getAccountType(user)
  const isMerchant = accountType === "Merchant" || Boolean(user.business_name)
  const userIdentifier = user.phone_number || userName
  const queryEnabled = Boolean(user.id && userIdentifier)
  const [paymentType, setPaymentType] = useState<"referencia" | "gpo">("referencia")
  const companyMetrics = paymentType === "referencia" ? referenceCompanyMetrics : gpoCompanyMetrics
  const [activePeriod, setActivePeriod] = useState<FilterOption>("today")
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const periodDates = useMemo(() => getDateRange(activePeriod, customRange), [activePeriod, customRange])
  const periodReady = Boolean(periodDates.start_date && periodDates.end_date)
  const periodParams = {
    data_inicio: periodDates.start_date,
    data_fim: periodDates.end_date,
  }
  const merchantStats = useQuery({
    queryKey: ["user-context-merchant-statistics", user.id],
    enabled: queryEnabled && isMerchant,
    queryFn: async () => (await api.get<DashboardResponse>(`/front/merchant/${encodeURIComponent(String(user.id))}/payments/statistics`)).data,
  })
  const merchantChart = useQuery({
    queryKey: ["user-context-merchant-chart", user.id],
    enabled: queryEnabled && isMerchant,
    queryFn: async () => (await api.get<DashboardResponse>(`/front/merchant/${encodeURIComponent(String(user.id))}/payments/chart`)).data,
  })

  function handlePeriodChange(period: FilterOption) {
    setActivePeriod(period)
    if (period !== "custom") setCustomRange({ start: "", end: "" })
  }

  const queries = useQueries({
    queries: [
      {
        queryKey: ["user-context-transfers-sent", user.id, userName, accountType, periodDates.start_date, periodDates.end_date],
        queryFn: () => fetchSummary("/front/transaction", { ...periodParams, sender_name: userName, sender_type: accountType }),
        enabled: queryEnabled && periodReady && !isMerchant,
      },
      {
        queryKey: ["user-context-transfers-received", user.id, userName, accountType, periodDates.start_date, periodDates.end_date],
        queryFn: () => fetchSummary("/front/transaction", { ...periodParams, receiver_name: userName, receiver_type: accountType }),
        enabled: queryEnabled && periodReady && !isMerchant,
      },
      {
        queryKey: ["user-context-payments", user.id, userName, accountType, periodDates.start_date, periodDates.end_date],
        queryFn: () => fetchSummary("/front/pgs_payment", { ...periodParams, users_name: userName, account_type: accountType }),
        enabled: queryEnabled && periodReady && !isMerchant,
      },
      {
        queryKey: ["user-context-deposits", user.id, userIdentifier, accountType, paymentType, periodDates.start_date, periodDates.end_date],
        queryFn: () => paymentType === "gpo"
          ? fetchSummary("/front/deposit_gpo_frame", { ...periodParams, user_name_phone: userIdentifier, account_type: accountType })
          : fetchSummary(isMerchant && user.merchant_payment_number
            ? `/front/${encodeURIComponent(user.merchant_payment_number)}/payments`
            : "/front/payment_reference", {
              ...(!isMerchant ? { reference: user.phone_number || userIdentifier } : {}),
              start_date: periodDates.start_date,
              end_date: periodDates.end_date,
              limit: "1",
            }),
        enabled: queryEnabled && periodReady && !isMerchant,
      },
      {
        queryKey: ["user-context-withdrawals", user.id, userIdentifier, accountType, periodDates.start_date, periodDates.end_date],
        queryFn: () => fetchSummary("/front/withdrawal", { ...periodParams, user_name_phone: userIdentifier, account_type: accountType }),
        enabled: queryEnabled && periodReady && !isMerchant,
      },
      {
        queryKey: ["user-context-reference-payments", user.id, userName, periodDates.start_date, periodDates.end_date],
        queryFn: () => fetchSummary("/front/payment_reference", { ...periodParams, users_name: userName }),
        enabled: queryEnabled && periodReady && !isMerchant,
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
  const latestActivity = activityItems.reduce<SummaryItem | undefined>((latest, activity) => {
    if (!activity.created_at) return latest
    const activityTime = new Date(activity.created_at).getTime()
    const latestTime = latest?.created_at ? new Date(latest.created_at).getTime() : Number.NEGATIVE_INFINITY
    return Number.isFinite(activityTime) && activityTime > latestTime ? activity : latest
  }, undefined)
  const summaryUnavailable = isMerchant ? merchantStats.isError || merchantChart.isError : queries.slice(0, 6).some((query) => query.isError)

  return (
    <div className="ui-context-page space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="shrink-0">
          <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
          <h2 className="mt-1 text-2xl font-bold text-[#143163]">Visão Geral</h2>
          {isMerchant && <p className="mt-1 text-sm text-[#6B7280]">Resumo financeiro e operacional desta conta.</p>}
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto lg:flex-nowrap" role="group" aria-label="Período dos indicadores">
          {isMerchant && (
            <Select value={paymentType} onValueChange={(value) => setPaymentType(value as "referencia" | "gpo")}>
              <SelectTrigger aria-label="Tipo de Pagamento" className="h-10 !w-[200px] shrink-0">
                <div className="flex min-w-0 flex-col items-start gap-0.5 text-left leading-none">
                  <span className="text-[10px] font-semibold leading-3 text-[#7D8CA6]">Tipo de Pagamento</span>
                  <SelectValue className="text-xs font-medium leading-4 text-[#143163]" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="referencia">Referência</SelectItem>
                <SelectItem value="gpo">GPO</SelectItem>
              </SelectContent>
            </Select>
          )}
          {periodOptions.map((option) => option.key === "custom" && activePeriod === "custom" ? (
            <div key={option.key} className="flex items-center gap-2 rounded-full border border-[#143163] bg-[#143163] px-3 py-2 text-white">
              <DateRangePicker value={customRange} onChange={setCustomRange} className="text-xs text-white" />
              <button
                type="button"
                onClick={() => handlePeriodChange("today")}
                className="text-sm leading-none text-white/80 transition hover:text-white"
                aria-label="Fechar seletor de data"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              key={option.key}
              type="button"
              aria-pressed={activePeriod === option.key}
              onClick={() => handlePeriodChange(option.key)}
              className={"shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors " + (
                activePeriod === option.key
                  ? "border-[#143163] bg-[#143163] text-white"
                  : "border-[#D6E2F2] bg-white text-[#627AA0] hover:border-[#143163] hover:text-[#143163]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {activePeriod === "custom" && !(periodDates.start_date && periodDates.end_date) && (
        <p className="text-sm text-[#6B7280]" role="status">Selecione as datas inicial e final para consultar os indicadores.</p>
      )}

      {summaryUnavailable && (
        <div className="flex items-start gap-3 rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-3 text-sm text-[#765500]" role="status">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Alguns indicadores não puderam ser carregados. Os valores indisponíveis são apresentados como “—”.</span>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isMerchant ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
        {isMerchant ? companyMetrics.map((metric) => (
          <KpiCard key={metric.label} label={metric.label} value={merchantStats.isPending ? "..." : metric.value(merchantStats.data)} helper={metric.helper?.(merchantStats.data)} icon={metric.icon} tone={metric.tone} />
        )) : (
          <>
            <KpiCard label="Saldo disponível" value={formatAmount(user.balance)} helper="Saldo da conta seleccionada" icon={Wallet} tone="blue" />
            <KpiCard label="Transferências" value={transfersCount} helper={`Volume: ${transfersAmount}`} icon={ArrowUpRight} tone="purple" />
            <KpiCard label="Depósitos" value={getAvailableMetric(deposits, "total_amount")} helper={`Operações: ${getAvailableCount(deposits)}`} icon={ArrowDownToLine} tone="green" />
            <KpiCard label="Levantamentos" value={getAvailableMetric(withdrawals, "total_amount")} helper={`Operações: ${getAvailableCount(withdrawals)}`} icon={ArrowUpFromLine} tone="orange" />
            <KpiCard label="Pagamentos" value={getAvailableMetric(payments, "total_payment")} helper={`Operações: ${getAvailableCount(payments)}`} icon={CreditCard} tone="purple" />
            <KpiCard label="Pagamentos por referência" value={getAvailableMetric(referencePayments, "total_amount")} helper={`Operações: ${getAvailableCount(referencePayments)}`} icon={Landmark} tone="cyan" />
            <KpiCard label="Saldo total" value="—" helper="Indicador global não aplicado ao contexto da conta" icon={RefreshCw} tone="slate" />
            <KpiCard
              label="Última actividade"
              value={activities.isPending ? "..." : latestActivity?.created_at ? formatDate(latestActivity.created_at) : activities.isError ? "—" : "Sem actividade"}
              helper={"Registos recentes: " + formatCount(activityItems.length)}
              icon={ListChecks}
              tone="blue"
            />
          </>
        )}
      </div>

      {isMerchant && periodReady && <MerchantActivityChart data={merchantChart.data} type={paymentType} startDate={periodDates.start_date} endDate={periodDates.end_date} isLoading={merchantChart.isPending} isError={merchantChart.isError} />}

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
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${activity.signal?.trim().toUpperCase() === "CREDIT" ? "bg-[#E5F5EA] text-[#0A7A31]" : "bg-[#FDECEC] text-[#B42318]"}`}>
                    {activity.signal?.trim().toUpperCase() === "CREDIT" ? <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
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
