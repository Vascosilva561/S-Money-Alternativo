import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

import type {
    GpoPayment,
    GpoPaymentFilters,
    GpoPaymentResponse,
} from "@/types/gpoPayment"

import { Spinner } from "@/components/utils/spinner"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import { RefreshButton } from "@/components/ui/refresh-button"
import { FilterButton } from "@/components/ui/filter-button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { TextField } from "@/components/ui/form-field"
import { Search } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import DetalhesPagamentoGPO from "@/components/pagamentosGPO/details"
import { statusPaymentGPOLabel } from "@/components/utils/statusPaymentGPOLabel"
import { statusPaymentGPOColor } from "@/components/utils/statusPaymentGPO"
import FilterGpoPayments from "@/components/pagamentosGPO/filter"
import { hasActiveFilterValues } from "@/lib/filter-utils"

const initialFilters: GpoPaymentFilters = {
    merchant_id: "",
    merchant_number: "",
    business_name: "",
    status: "",
    payment_reference: "",
    transaction_reference: "",
    phone_number: "",
    external_payment_id: "",
    montante_de: "",
    montante_ate: "",
    data_inicio: "",
    data_fim: "",
}

export default function PagamentosGPO() {
    const [currentPage, setCurrentPage] = useState(1)

    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)

    const [showClearFilter, setShowClearFilter] = useState(false)

    const [itemSelected, setItemSelected] =
        useState<GpoPayment | undefined>()

    const [searchInput, setSearchInput] = useState("")
    const [queryParams, setQueryParams] =
        useState<GpoPaymentFilters>(initialFilters)


    const [appliedFilters, setAppliedFilters] =
        useState<GpoPaymentFilters>(initialFilters)

    async function getPayments(page?: number) {
        try {
            const params = new URLSearchParams()

            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value)
                }
            })

            params.set("page", String(page))
            params.set("per_page", "100")

            const url = `/front/gpo_payments?${params.toString()}`

            const { data } = await api.get<GpoPaymentResponse>(url)

            return data
        } catch (error) {
            console.log("Erro ao buscar pagamentos GPO", error)
            throw error
        }
    }

    const {
        data,
        isLoading,
        isFetching,
        refetch,
    } = useQuery<GpoPaymentResponse>({
        queryKey: [
            "listaPagamentosGPO",
            currentPage,
            100,
            appliedFilters,
        ],
        queryFn: () => getPayments(currentPage),
        placeholderData: keepPreviousData,
    })

    const filteredPayments = useMemo(() => {
        if (!data?.dados?.length) return []

        if (!searchInput.trim()) {
            return data.dados
        }

        const searchTerm = searchInput.toLowerCase().trim()

        return data.dados.filter((item: GpoPayment) => {
            const paymentId = String(
                item?.payment_id || ""
            ).toLowerCase()

            const businessName = String(
                item?.merchant?.business_name || ""
            ).toLowerCase()

            const merchantNumber = String(
                item?.merchant_number || ""
            ).toLowerCase()

            const paymentReference = String(
                item?.payment_reference || ""
            ).toLowerCase()

            const transactionReference = String(
                item?.transaction_reference || ""
            ).toLowerCase()

            const amount = String(
                item?.amount || ""
            ).toLowerCase()

            const phoneNumber = String(
                item?.phone_number || ""
            ).toLowerCase()

            const status = String(
                item?.status || ""
            ).toLowerCase()

            const externalPaymentId = String(
                item?.external_payment_id || ""
            ).toLowerCase()

            const externalCustomerId = String(
                item?.external_customer_id || ""
            ).toLowerCase()

            const createdAt = String(
                item?.created_at || ""
            ).toLowerCase()

            return (
                paymentId.includes(searchTerm) ||
                businessName.includes(searchTerm) ||
                merchantNumber.includes(searchTerm) ||
                paymentReference.includes(searchTerm) ||
                transactionReference.includes(searchTerm) ||
                amount.includes(searchTerm) ||
                phoneNumber.includes(searchTerm) ||
                status.includes(searchTerm) ||
                externalPaymentId.includes(searchTerm) ||
                externalCustomerId.includes(searchTerm) ||
                createdAt.includes(searchTerm)
            )
        })
    }, [data?.dados, searchInput])


    const totalItems = data?.total || 0

    const totalPages =
        Math.ceil(totalItems / Number(100)) || 1

    const generatePaginationRange = (
        totalPages: number,
        currentPage: number
    ): (number | string)[] => {
        const delta = 2
        const range: (number | string)[] = []

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta &&
                    i <= currentPage + delta)
            ) {
                range.push(i)
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                range.push("...")
            }
        }

        return range
    }

    const paginationRange = generatePaginationRange(
        totalPages,
        currentPage
    )

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const limparFiltro = () => {
        setShowClearFilter(false)
        setCurrentPage(1)

        setQueryParams(initialFilters)
        setAppliedFilters(initialFilters)
    }

    const handleApplyFilters = () => {
        setCurrentPage(1)
        setAppliedFilters(queryParams)

        const hasFilter = hasActiveFilterValues(...Object.values(queryParams))

        setShowClearFilter(hasFilter)

        setFilterModalIsOpen(false)
    }

    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };

    return (
        <>
            <FilterGpoPayments
                filter={handleApplyFilters}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
            />

            <DetalhesPagamentoGPO
                itemSelected={itemSelected}
                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />

            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="ui-data-stack flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <FilterButton
                                onClick={() => setFilterModalIsOpen(true)}
                                label="Filtrar pagamentos GPO"
                            />
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {showClearFilter && <ClearFiltersButton onClick={limparFiltro} />}
                        </div>

                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            {!isLoading && isFetching && (
                                <span className="flex min-h-10 shrink-0 items-center gap-2 text-sm text-[#667895]" role="status" aria-live="polite">
                                    <Spinner color="#143163" width="5" height="5" />
                                    <span>A carregar...</span>
                                </span>
                            )}
                            <TextField
                                type="search"
                                aria-label="Pesquisar pagamentos GPO"
                                placeholder="Pesquisar pagamentos..."
                                value={searchInput}
                                onChange={(event) => handleSearch(event.target.value)}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>

                    <TableResults
                        leadingContent={
                            <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                                <span>
                                    <strong>Total geral de registos:</strong>{" "}
                                    <span className="font-semibold">{isLoading ? "..." : data?.total ?? 0}</span>
                                </span>
                                <span className="ui-inline-summary-divider" aria-hidden="true" />
                                <span>
                                    <strong>Total de valor recebido:</strong>{" "}
                                    <span className="font-semibold">
                                        {isLoading
                                            ? "..."
                                            : formatCurrency(data?.total_amount, "Kz", 2, "Nenhum valor encontrado")}
                                    </span>
                                </span>
                            </div>
                        }
                        label="Pagamentos encontrados"
                        visibleCount={filteredPayments.length}
                        totalCount={data?.total}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPreviousPage={handlePrevPage}
                        onNextPage={handleNextPage}
                        isLoading={isLoading || isFetching}
                        containerClassName="overflow-hidden rounded-xl border border-[#E5EBF4]"
                    >
                        <div className="overflow-x-auto">
                            <table className="ui-gpo-payments-table w-full min-w-[1120px] table-fixed border-collapse text-sm">
                                <caption className="sr-only">Lista de pagamentos GPO</caption>
                                <thead className="h-14 bg-[#F5F6FA]">
                                    <tr className="text-[#143163]">
                                        <th scope="col" className="w-[17%] px-4 py-2 text-start">Empresa</th>
                                        <th scope="col" className="w-[14%] px-4 py-2 text-start">Referência</th>
                                        <th scope="col" className="w-[17%] px-4 py-2 text-start">Referência da transação</th>
                                        <th scope="col" className="w-[11%] px-4 py-2 text-start">Valor</th>
                                        <th scope="col" className="w-[10%] px-4 py-2 text-start">Telefone</th>
                                        <th scope="col" className="w-[13%] px-4 py-2 text-start">Data</th>
                                        <th scope="col" className="w-[10%] px-4 py-2 text-start">Estado</th>
                                        <th scope="col" className="w-[8%] ui-gpo-actions-column px-4 py-2 text-start">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <TableStateRow colSpan={8} state="loading" message="A carregar pagamentos GPO..." />
                                    ) : filteredPayments.length ? (
                                        filteredPayments.map((item) => (
                                            <tr
                                                key={item.payment_id}
                                                className="border-t border-[#EBECEF] text-[#143163] odd:bg-white even:bg-[#F8FAFC] transition-colors hover:bg-[#F5F6FA]"
                                            >
                                                <td className="truncate px-4 py-3 text-start">{item.merchant?.business_name || "—"}</td>
                                                <td className="truncate px-4 py-3 text-start">{item.payment_reference || "—"}</td>
                                                <td className="truncate px-4 py-3 text-start">{item.transaction_reference || "—"}</td>
                                                <td className="px-4 py-3 text-start">{formatCurrency(item.amount, "Kz")}</td>
                                                <td className="px-4 py-3 text-start">{item.phone_number || "—"}</td>
                                                <td className="px-4 py-3 text-start">{formatDateTime(item.created_at)}</td>
                                                <td className="px-4 py-3 text-start">
                                                    <span className={"ui-status-tag " + statusPaymentGPOColor(item.status)}>
                                                        {statusPaymentGPOLabel(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-start">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={"Ver detalhes do pagamento " + item.payment_reference}
                                                        onClick={() => {
                                                            setItemSelected(item)
                                                            setDetailsModalIsOpen(true)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum pagamento GPO encontrado." />
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
                        onPreviousPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                </div>
            </section>
        </>
    )
}
