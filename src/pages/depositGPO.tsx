import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import type { Deposit, DepositRecord } from "@/types/depotiType"
import { statusDeposit } from "@/components/utils/statusDeposit"
import { statusDepositColor } from "@/components/utils/statusDepositColor"
import FilterDepositsGPO from "@/components/depositGPO/filter"
import DetalhesDeposito from "@/components/depositGPO/details"
import { FilterButton } from "@/components/ui/filter-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { TextField } from "@/components/ui/form-field"
import { TableActionButton } from "@/components/ui/table-action-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { Search } from "lucide-react"

type DepositFilters = {
    user_name_phone: string
    account_type: string
    dataInicial: string
    dataFinal: string
    montante_de: string
    montante_ate: string
}

type AppliedDepositFilters = {
    queryParams: DepositFilters
    accountType: string
    status: string
    channel: string
}

const emptyFilters: DepositFilters = {
    user_name_phone: "",
    account_type: "",
    dataInicial: "",
    dataFinal: "",
    montante_de: "",
    montante_ate: "",
}

function createPaginationRange(totalPages: number, currentPage: number) {
    const pages: (number | string)[] = []
    const delta = 2

    for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || (page >= currentPage - delta && page <= currentPage + delta)) {
            pages.push(page)
        } else if (page === currentPage - delta - 1 || page === currentPage + delta + 1) {
            pages.push("...")
        }
    }

    return pages
}

function getDepositSearchText(item: DepositRecord) {
    return [
        item.id,
        item.user_name,
        item.user_phone_number,
        item.payment_reference,
        item.amount,
        item.canal,
        formatDateTime(item.created_at),
        statusDeposit(item.status),
    ].join(" ").toLocaleLowerCase("pt-AO")
}

export default function Depositos() {
    const perPage = "10"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<DepositRecord | undefined>()
    const [tipoDeConta, setTipoDeConta] = useState("User")
    const [status, setStatus] = useState("ACCEPTED")
    const [canal, setCanal] = useState("")
    const [searchParams] = useSearchParams()
    const nameUserSearch = searchParams.get("user_name_phone") || ""
    const [queryParams, setQueryParams] = useState<DepositFilters>(emptyFilters)
    const [appliedFilters, setAppliedFilters] = useState<AppliedDepositFilters>({
        queryParams: emptyFilters,
        accountType: "User",
        status: "ACCEPTED",
        channel: "",
    })

    async function getDeposits(page: number) {
        const params = new URLSearchParams({
            per_page: perPage,
            page: String(page),
        })
        const nameFilter = nameUserSearch || appliedFilters.queryParams.user_name_phone.trim()
        if (nameFilter) params.set("user_name_phone", nameFilter)
        if (appliedFilters.status && appliedFilters.status !== "ALL") params.set("status", appliedFilters.status)
        if (appliedFilters.accountType && appliedFilters.accountType !== "ALL") params.set("account_type", appliedFilters.accountType)
        if (appliedFilters.queryParams.dataInicial) params.set("data_inicio", appliedFilters.queryParams.dataInicial)
        if (appliedFilters.queryParams.dataFinal) params.set("data_fim", appliedFilters.queryParams.dataFinal)
        if (appliedFilters.queryParams.montante_de) params.set("montante_de", appliedFilters.queryParams.montante_de)
        if (appliedFilters.queryParams.montante_ate) params.set("montante_ate", appliedFilters.queryParams.montante_ate)
        if (appliedFilters.channel) params.set("canal", appliedFilters.channel)

        const { data } = await api.get<Deposit>(`/front/deposit_gpo_frame?${params.toString()}`)
        return data
    }

    const { data, refetch, isLoading, isFetching } = useQuery<Deposit>({
        queryKey: ["listaDeDepositosGPO", currentPage, perPage, nameUserSearch, appliedFilters],
        queryFn: () => getDeposits(currentPage),
        placeholderData: keepPreviousData,
    })

    const filteredDeposits = useMemo(() => {
        const deposits = data?.dados ?? []
        const term = searchInput.trim().toLocaleLowerCase("pt-AO")
        if (!term) return deposits
        return deposits.filter((item) => getDepositSearchText(item).includes(term))
    }, [data?.dados, searchInput])

    const totalPages = Math.max(1, Math.ceil(Number(data?.total ?? 0) / Number(perPage)))
    const paginationRange = createPaginationRange(totalPages, currentPage)

    const handleApplyFilters = (page: number) => {
        setAppliedFilters({
            queryParams: { ...queryParams },
            accountType: tipoDeConta,
            status,
            channel: canal,
        })
        setCurrentPage(page)
    }

    const clearFilters = () => {
        setQueryParams(emptyFilters)
        setTipoDeConta("User")
        setStatus("ACCEPTED")
        setCanal("")
        setAppliedFilters({ queryParams: emptyFilters, accountType: "User", status: "ACCEPTED", channel: "" })
        setShowClearFilter(false)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page)
    }

    return (
        <>
            <FilterDepositsGPO
                isOpen={filterModalIsOpen}
                onClose={() => setFilterModalIsOpen(false)}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                filter={handleApplyFilters}
                setIsFiltered={() => undefined}
                setShowFilter={setShowClearFilter}
                status={status}
                setStatus={setStatus}
                tipoDeConta={tipoDeConta}
                setTipoDeConta={setTipoDeConta}
                canal={canal}
                setCanal={setCanal}
            />

            <DetalhesDeposito
                itemSelected={itemSelected}
                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />

            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="ui-data-stack flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <FilterButton onClick={() => setFilterModalIsOpen(true)} label="Filtrar depósitos GPO" />
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {showClearFilter && <ClearFiltersButton onClick={clearFilters} />}
                        </div>
                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            {isFetching && !isLoading && <span className="text-sm text-[#667895]" role="status">A carregar...</span>}
                            <TextField
                                type="search"
                                aria-label="Pesquisar depósitos GPO"
                                placeholder="Pesquisar depósitos..."
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>

                    <TableResults
                        leadingContent={
                            <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                                <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total ?? 0}</span></span>
                                <span className="ui-inline-summary-divider" aria-hidden="true" />
                                <span><strong>Total de valor recebido:</strong> <span className="font-semibold">{isLoading ? "..." : formatCurrency(data?.total_amount, "Kz", 2, "Nenhum valor encontrado")}</span></span>
                            </div>
                        }
                        label="Depósitos encontrados"
                        visibleCount={filteredDeposits.length}
                        totalCount={data?.total}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPreviousPage={() => handlePageChange(currentPage - 1)}
                        onNextPage={() => handlePageChange(currentPage + 1)}
                        isLoading={isLoading || isFetching}
                        containerClassName="overflow-hidden rounded-xl border border-[#E5EBF4]"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1200px] table-fixed border-collapse text-sm">
                                <caption className="sr-only">Lista de depósitos GPO</caption>
                                <thead className="h-14 bg-[#F5F6FA]">
                                    <tr className="text-[#143163]">
                                        <th scope="col" className="w-[15%] px-4 py-2 text-start">Utilizador</th>
                                        <th scope="col" className="w-[12%] px-4 py-2 text-start">Telemóvel</th>
                                        <th scope="col" className="w-[17%] px-4 py-2 text-start">Referência</th>
                                        <th scope="col" className="w-[12%] px-4 py-2 text-start">Valor recebido</th>
                                        <th scope="col" className="w-[12%] px-4 py-2 text-start">Canal</th>
                                        <th scope="col" className="w-[14%] px-4 py-2 text-start">Data</th>
                                        <th scope="col" className="w-[10%] px-4 py-2 text-start">Estado do depósito</th>
                                        <th scope="col" className="w-[8%] px-4 py-2 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableStateRow colSpan={8} state="loading" message="A carregar depósitos GPO..." />
                                    ) : filteredDeposits.length ? (
                                        filteredDeposits.map((item) => (
                                            <tr key={item.id} className="border-t border-[#EBECEF] text-[#143163] odd:bg-white even:bg-[#F8FAFC] transition-colors hover:bg-[#F5F6FA]">
                                                <td className="truncate px-4 py-3 text-start font-medium">{item.user_name || "—"}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start">{item.user_phone_number || "—"}</td>
                                                <td className="truncate px-4 py-3 text-start">{item.payment_reference || "—"}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start font-semibold">{formatCurrency(item.amount, "Kz")}</td>
                                                <td className="truncate px-4 py-3 text-start">{item.canal || "—"}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start">{formatDateTime(item.created_at)}</td>
                                                <td className="px-4 py-3 text-start">
                                                    <span className={`ui-status-tag ${statusDepositColor(item.status) || "bg-[#EEF1F5] text-[#637590]"}`}>
                                                        {statusDeposit(item.status) || item.status || "—"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver detalhes do depósito ${item.payment_reference || item.id}`}
                                                        onClick={() => { setItemSelected(item); setDetailsModalIsOpen(true) }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum depósito GPO encontrado." />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TableResults>

                    <PaginationFooter
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginationRange={paginationRange}
                        onPageChange={handlePageChange}
                        onPreviousPage={() => handlePageChange(currentPage - 1)}
                        onNextPage={() => handlePageChange(currentPage + 1)}
                    />
                </div>
            </section>
        </>
    )
}
