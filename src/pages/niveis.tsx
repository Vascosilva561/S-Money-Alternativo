import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircle, Plus, Search, X } from "lucide-react"
import { api } from "@/api"
import { getLevelBadgeName, LevelBadge } from "@/components/gestaoDeContas/level-badge"
import { Input } from "@/components/ui/input"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import { LevelDetailsSheet } from "@/components/niveis/LevelDetailsSheet"
import { LevelFilterSheet, type AccountTypeFilter } from "@/components/niveis/LevelFilterSheet"
import { LevelFormSheet } from "@/components/niveis/LevelFormSheet"
import type { Rule, RulesResponse } from "@/types/rules"

const PAGE_SIZE = 10

function formatCurrency(value?: number | string | null) {
  if (value === undefined || value === null || String(value).trim() === "") return "—"
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "—"
  return new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " Kz"
}

function buildPaginationRange(totalPages: number, currentPage: number): (number | string)[] {
  const range: (number | string)[] = []
  for (let page = 1; page <= totalPages; page += 1) {
    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
      range.push(page)
    } else if (page === currentPage - 2 || page === currentPage + 2) {
      range.push("...")
    }
  }
  return range
}

function accountTypeLabel(accountType: string) {
  return accountType === "Merchant" ? "Empresa" : "Particular"
}

function levelLabel(level: number | string | null | undefined) {
  return level === null || level === undefined || String(level).trim() === "" ? "—" : String(level)
}

function normalizeSearchText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/\s+/g, "")
}

export default function GestaoDeNiveis() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [accountType, setAccountType] = useState<AccountTypeFilter>("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formOpen, setFormOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<Rule | undefined>()

  const rulesQuery = useQuery<RulesResponse>({
    queryKey: ["account-level-rules", currentPage],
    queryFn: async () => {
      const { data } = await api.get<RulesResponse>("/front/rules?per_page=" + PAGE_SIZE + "&page=" + currentPage)
      return data
    },
    placeholderData: (previousData) => previousData,
  })

  const rules = rulesQuery.data?.rules ?? []
  const visibleRules = useMemo(() => {
    const normalizedSearch = normalizeSearchText(search.trim())
    return rules.filter((rule) => {
      const matchesAccount = accountType === "all" || rule.account_type === accountType
      const searchable = normalizeSearchText([
        accountTypeLabel(rule.account_type),
        rule.account_type === "Merchant" ? "Empresas" : "Particulares",
        rule.account_type,
        levelLabel(rule.rule_type),
        getLevelBadgeName(rule.rule_type),
        rule.transaction_rules,
        formatCurrency(rule.transaction_rules),
        rule.per_day,
        formatCurrency(rule.per_day),
        rule.per_mounth,
        formatCurrency(rule.per_mounth),
        rule.found_total,
        formatCurrency(rule.found_total),
      ].map((value) => String(value ?? "")).join(" "))
      return matchesAccount && (!normalizedSearch || searchable.includes(normalizedSearch))
    })
  }, [accountType, rules, search])

  const apiTotalPages = Number(rulesQuery.data?.total_pages)
  const apiTotal = Number(rulesQuery.data?.total)
  const totalPages = Number.isFinite(apiTotalPages) && apiTotalPages > 0
    ? apiTotalPages
    : Number.isFinite(apiTotal) && apiTotal > 0
      ? Math.ceil(apiTotal / PAGE_SIZE)
      : rules.length === PAGE_SIZE ? currentPage + 1 : currentPage
  const totalRecords = Number.isFinite(apiTotal) && apiTotal >= 0 ? apiTotal : rules.length
  const paginationRange = buildPaginationRange(totalPages, currentPage)

  function openCreate() {
    setSelectedRule(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  function openEdit(rule: Rule) {
    setSelectedRule(rule)
    setFormMode("edit")
    setFormOpen(true)
  }

  function applyAccountFilter(nextAccountType: AccountTypeFilter) {
    setAccountType(nextAccountType)
    setCurrentPage(1)
  }

  function clearSearch() {
    setSearch("")
    setCurrentPage(1)
  }

  return (
    <section className="ui-data-page text-sm">
      <h1 className="sr-only">Gestão de Níveis</h1>
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="ui-toolbar flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#143163] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D467F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2"
              onClick={openCreate}
            >
              <Plus className="size-4 shrink-0" aria-hidden="true" />
              Adicionar nível
            </button>
            <button
              type="button"
              aria-label="Filtrar"
              title="Filtrar"
              className="ui-filter-trigger"
              onClick={() => setFilterOpen(true)}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 5h16l-6.5 7v5l-3 2v-7L4 5z" />
              </svg>
            </button>
            <RefreshButton onRefresh={() => { void rulesQuery.refetch() }} isLoading={rulesQuery.isFetching} />
            {accountType !== "all" && (
              <button type="button" className="ui-clear-filter-button" onClick={() => applyAccountFilter("all")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                </svg>
                <span>Limpar Filtro</span>
              </button>
            )}
          </div>

          <div className="flex w-full items-center gap-3 lg:w-auto">
            {rulesQuery.isFetching && (
              <span role="status" className="flex shrink-0 items-center gap-2 text-sm text-[#667895]">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                A carregar...
              </span>
            )}
            <div className="relative w-full lg:w-[300px] lg:shrink-0">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" />
              <Input
                id="levels-search"
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Pesquisar níveis..."
                aria-label="Pesquisar níveis por conta, nível ou limite"
                className="h-10 pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Limpar pesquisa"
                  title="Limpar pesquisa"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#8293AE] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="ui-record-count mt-5 flex items-center gap-2 text-sm text-[#143163]">
          <span className="font-semibold">Total geral de registos:</span>
          <span>{rulesQuery.isLoading ? "…" : new Intl.NumberFormat("pt-AO").format(totalRecords)}</span>
        </div>

        {rulesQuery.isError && rules.length > 0 && (
          <p role="alert" className="mt-3 rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-3 text-sm text-[#765500]">
            Não foi possível actualizar a listagem. Os últimos dados carregados continuam visíveis.
          </p>
        )}

        <div className="mt-3 overflow-x-auto rounded-xl border border-[#E5EBF4]">
          <table className="w-full min-w-[1120px] table-fixed border-collapse text-sm">
            <caption className="sr-only">Limites de transacção por nível e tipo de conta</caption>
            <thead className="bg-[#F5F7FB] text-left text-xs font-semibold text-[#143163]">
              <tr className="h-12 border-b border-[#E5EBF4]">
                <th scope="col" className="w-[16%] px-4">Tipo de conta</th>
                <th scope="col" className="w-[12%] px-4">Nível</th>
                <th scope="col" className="w-[14%] px-4">Por transacção</th>
                <th scope="col" className="w-[14%] px-4">Por dia</th>
                <th scope="col" className="w-[14%] px-4">Por mês</th>
                <th scope="col" className="w-[14%] px-4">Fundo total</th>
                <th scope="col" className="w-[16%] px-5 text-right" style={{ textAlign: "right" }}>Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F7] text-[#143163]">
              {rulesQuery.isLoading ? (
                <TableStateRow colSpan={7} state="loading" message="A carregar níveis..." />
              ) : visibleRules.length === 0 ? (
                <TableStateRow
                  colSpan={7}
                  state="empty"
                  message={rulesQuery.isError
                    ? "Não foi possível carregar os níveis. Tente actualizar a listagem."
                    : search || accountType !== "all"
                      ? "Nenhum nível corresponde aos filtros."
                      : "Ainda não existem níveis configurados."}
                />
              ) : (
                visibleRules.map((rule, index) => {
                  const displayedLevel = levelLabel(rule.rule_type)
                  const hasLevel = displayedLevel !== "—"

                  return (
                    <tr key={rule.id ?? rule.account_type + "-" + displayedLevel + "-" + index} className="h-14 border-b border-[#EEF2F7] odd:bg-white even:bg-[#FBFCFE] transition-colors hover:bg-[#F5F9FF]">
                      <td className="px-4 font-semibold">{accountTypeLabel(rule.account_type)}</td>
                      <td className="px-4"><LevelBadge level={rule.rule_type} /></td>
                      <td className="whitespace-nowrap px-4 tabular-nums">{formatCurrency(rule.transaction_rules)}</td>
                      <td className="whitespace-nowrap px-4 tabular-nums">{formatCurrency(rule.per_day)}</td>
                      <td className="whitespace-nowrap px-4 tabular-nums">{formatCurrency(rule.per_mounth)}</td>
                      <td className="whitespace-nowrap px-4 tabular-nums">{formatCurrency(rule.found_total)}</td>
                      <td className="px-5">
                        <div className="ml-auto inline-flex items-center justify-end gap-2">
                          <TableActionButton
                            action="view"
                            aria-label={hasLevel ? "Ver nível " + displayedLevel : "Ver nível sem numeração"}
                            tooltip="Ver detalhes"
                            onClick={() => { setSelectedRule(rule); setDetailsOpen(true) }}
                          />
                          <TableActionButton
                            action="edit"
                            aria-label={hasLevel ? "Editar nível " + displayedLevel : "Editar nível sem numeração"}
                            tooltip="Editar nível"
                            onClick={() => openEdit(rule)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            paginationRange={paginationRange}
            onPageChange={setCurrentPage}
            onPreviousPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
            onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          />
        </div>
      </div>

      <LevelFilterSheet
        open={filterOpen}
        accountType={accountType}
        onApply={applyAccountFilter}
        onClose={() => setFilterOpen(false)}
      />
      <LevelFormSheet open={formOpen} mode={formMode} rule={selectedRule} onClose={() => setFormOpen(false)} />
      <LevelDetailsSheet open={detailsOpen} rule={selectedRule} onClose={() => setDetailsOpen(false)} />
    </section>
  )
}
