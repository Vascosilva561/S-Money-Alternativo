import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import { useSelectedAccount } from "@/context/selectedAccountCntext"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import { RefreshButton } from "@/components/ui/refresh-button"
import { FilterButton } from "@/components/ui/filter-button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { TextField } from "@/components/ui/form-field"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { tipo_de_Terminal } from "@/components/utils/origemMovimento"
import FilterPaymentsReference, { type PaymentFilters } from "@/components/pagamento-referenecia/filter"
import DetalhesDepositoReference from "@/components/pagamento-referenecia/detailsDeposit"
import type { ReferenceDepositResponse, ReferenceDepositType } from "@/types/reference_deposit"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

const emptyFilters: PaymentFilters = {
    payment_reference: "",
    payment_status: "",
    mft_status: "",
    prt_status: "",
    payment_id: "",
    start_date: "",
    end_date: "",
    limit: 10,
}

function getDepositStatus(status?: string) {
    switch (status?.toUpperCase()) {
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

function getStatusClass(status?: string) {
    switch (status?.toUpperCase()) {
        case "SUCCESS":
        case "COMPLETED":
            return "bg-[#CFE7D7] text-[#0D9339]"
        case "PENDING":
            return "bg-[#FDE9B0] text-[#A26C07]"
        case "FAILED":
        case "ERROR":
        case "REJECTED":
            return "bg-[#FDE4EA] text-[#EF4A00]"
        case "REFUNDED":
            return "bg-[#F3CFFF] text-[#7100C8]"
        default:
            return "bg-[#EEF1F5] text-[#637590]"
    }
}

function getChannelName(channel?: string) {
    if (!channel) return "—"
    return tipo_de_Terminal.find((terminal) => terminal.value === channel)?.description || channel
}

function getAccountName(item: ReferenceDepositType) {
    return item.account?.business_name ||
        [item.account?.first_name, item.account?.last_name].filter(Boolean).join(" ") ||
        item.account?.name || item.account?.email || "—"
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

export default function DepositReference() {
    const { account: selectedAccount } = useSelectedAccount()
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<ReferenceDepositType | null>(null)
    const [queryParams, setQueryParams] = useState<PaymentFilters>(emptyFilters)
    const [appliedFilters, setAppliedFilters] = useState<PaymentFilters>(emptyFilters)
    const [cursor, setCursor] = useState("")
    const [cursorHistory, setCursorHistory] = useState([""])
    const [, setIsFiltered] = useState(false)

    async function getDeposits(cursorValue = "") {
        const params = new URLSearchParams()
        const accountName = selectedAccount?.business_name ||
            [selectedAccount?.first_name, selectedAccount?.last_name].filter(Boolean).join(" ")

        if (!selectedAccount?.business_name && accountName && selectedAccount?.telefone) {
            params.set("reference", selectedAccount.telefone)
        }

        if (appliedFilters.payment_reference) params.set("payment_reference", appliedFilters.payment_reference)
        if (appliedFilters.payment_status) params.set("payment_status", appliedFilters.payment_status)
        if (appliedFilters.mft_status) params.set("mft_status", appliedFilters.mft_status)
        if (appliedFilters.prt_status) params.set("prt_status", appliedFilters.prt_status)
        if (appliedFilters.payment_id) params.set("payment_id", appliedFilters.payment_id)
        if (appliedFilters.start_date) params.set("start_date", appliedFilters.start_date)
        if (appliedFilters.end_date) params.set("end_date", appliedFilters.end_date)
        if (cursorValue) params.set("cursor", cursorValue)
        params.set("limit", String(appliedFilters.limit))

        const url = selectedAccount?.business_name
            ? `/front/${selectedAccount.merchant_payment_number}/payments?${params.toString()}`
            : `/front/payment_reference?${params.toString()}`
        const { data } = await api.get<ReferenceDepositResponse>(url)
        return data
    }

    const { data, refetch, isLoading, isFetching } = useQuery<ReferenceDepositResponse>({
        queryKey: ["listaDepositosReferencia", selectedAccount?.id, appliedFilters, cursor],
        queryFn: () => getDeposits(cursor),
        placeholderData: keepPreviousData,
    })

    const filteredDeposits = useMemo(() => {
        const deposits = data?.dados ?? []
        const term = searchInput.trim().toLocaleLowerCase("pt-AO")
        if (!term) return deposits

        return deposits.filter((item) => {
            const values = [
                item.id,
                item.id_transaction,
                item.period_id,
                item.reference,
                getAccountName(item),
                item.account?.email,
                item.amount,
                item.status,
                getChannelName(item.channel),
                item.created_at,
            ]
            return values.some((value) => String(value ?? "").toLocaleLowerCase("pt-AO").includes(term))
        })
    }, [data?.dados, searchInput])

    const totalPages = currentPage + (data?.next_cursor ? 1 : 0)
    const paginationRange = createPaginationRange(totalPages, currentPage)

    const handleNextPage = () => {
        const nextCursor = data?.next_cursor
        if (!nextCursor || isFetching) return
        setCursorHistory((history) => [...history.slice(0, currentPage), nextCursor])
        setCursor(nextCursor)
        setCurrentPage((page) => page + 1)
    }

    const handlePreviousPage = () => {
        if (currentPage <= 1) return
        const previousPage = currentPage - 1
        setCursor(cursorHistory[previousPage - 1] ?? "")
        setCurrentPage(previousPage)
    }

    const handlePageChange = (page: number) => {
        if (page === currentPage) return
        if (page === currentPage + 1) {
            handleNextPage()
            return
        }
        const pageCursor = cursorHistory[page - 1]
        if (pageCursor !== undefined) {
            setCursor(pageCursor)
            setCurrentPage(page)
        }
    }

    const applyFilters = () => {
        setAppliedFilters(queryParams)
    }

    const clearFilters = () => {
        setQueryParams(emptyFilters)
        setAppliedFilters(emptyFilters)
        setShowClearFilter(false)
        setCursor("")
        setCursorHistory([""])
        setCurrentPage(1)
    }

    return (
        <>
            <FilterPaymentsReference
                isOpen={filterModalIsOpen}
                onClose={() => setFilterModalIsOpen(false)}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                filter={applyFilters}
                setIsFiltered={setIsFiltered}
                setShowFilter={setShowClearFilter}
                setCursor={setCursor}
                setCurrentPage={setCurrentPage}
                setCursorHistory={setCursorHistory}
                title="Filtrar depósitos por referência"
                description="Defina os critérios para refinar a lista de depósitos por referência."
            />

            <DetalhesDepositoReference
                itemSelected={itemSelected}
                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />

            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="ui-data-stack flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <FilterButton onClick={() => setFilterModalIsOpen(true)} label="Filtrar depósitos por referência" />
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {showClearFilter && <ClearFiltersButton onClick={clearFilters} />}
                        </div>
                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            {isFetching && !isLoading && <span className="text-sm text-[#667895]" role="status">A carregar...</span>}
                            <TextField
                                type="search"
                                aria-label="Pesquisar depósitos por referência"
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
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        isLoading={isLoading || isFetching}
                        containerClassName="overflow-hidden rounded-xl border border-[#E5EBF4]"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1080px] table-fixed border-collapse text-sm">
                                <caption className="sr-only">Lista de depósitos por referência</caption>
                                <thead className="h-14 bg-[#F5F6FA]">
                                    <tr className="text-[#143163]">
                                        <th scope="col" className="w-[18%] px-4 py-2 text-start">Pagamento</th>
                                        <th scope="col" className="w-[17%] px-4 py-2 text-start">Titular</th>
                                        <th scope="col" className="w-[15%] px-4 py-2 text-start">Referência</th>
                                        <th scope="col" className="w-[13%] px-4 py-2 text-start">Canal</th>
                                        <th scope="col" className="w-[12%] px-4 py-2 text-start">Valor</th>
                                        <th scope="col" className="w-[15%] px-4 py-2 text-start">Data</th>
                                        <th scope="col" className="w-[10%] px-4 py-2 text-start">Estado</th>
                                        <th scope="col" className="w-[8%] px-4 py-2 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableStateRow colSpan={8} state="loading" message="A carregar depósitos por referência..." />
                                    ) : filteredDeposits.length ? (
                                        filteredDeposits.map((item) => (
                                            <tr key={item.id} className="border-t border-[#EBECEF] text-[#143163] odd:bg-white even:bg-[#F8FAFC] transition-colors hover:bg-[#F5F6FA]">
                                                <td className="truncate px-4 py-3 text-start">
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <span className="truncate">{item.id_transaction || item.id || "—"}</span>
                                                        {item.id_transaction && <CopyTextButton value={item.id_transaction} label="ID da transação" />}
                                                    </div>
                                                </td>
                                                <td className="truncate px-4 py-3 text-start">{getAccountName(item)}</td>
                                                <td className="truncate px-4 py-3 text-start">
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <span className="truncate">{item.reference || "—"}</span>
                                                        {item.reference && <CopyTextButton value={item.reference} label="referência" />}
                                                    </div>
                                                </td>
                                                <td className="truncate px-4 py-3 text-start">{getChannelName(item.channel)}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start font-semibold">{formatCurrency(item.amount, "Kz")}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start">{formatDateTime(item.created_at)}</td>
                                                <td className="px-4 py-3 text-start"><span className={`ui-status-tag ${getStatusClass(item.status)}`}>{getDepositStatus(item.status)}</span></td>
                                                <td className="px-4 py-3 text-center">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver detalhes do depósito ${item.reference || item.id}`}
                                                        onClick={() => { setItemSelected(item); setDetailsModalIsOpen(true) }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum depósito por referência encontrado." />
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
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                    />
                </div>
            </section>
        </>
    )
}
