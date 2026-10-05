import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { statusPayment } from "@/components/utils/statusPayment"
import { statusPaymentColor } from "@/components/utils/statusPaymentColor"
import { TableStateRow } from "@/components/ui/table-state-row"
import type { ReferencePaymentResponse, ReferencePaymentType } from "@/types/referencePayment"
import DetalhesPagamentoReference from "@/components/pagamento-referenecia/detailsPayment"
import FilterPaymentsReference, { type PaymentFilters } from "@/components/pagamento-referenecia/filter"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { FilterButton } from "@/components/ui/filter-button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { TextField } from "@/components/ui/form-field"
import { Search } from "lucide-react"
import { Spinner } from "@/components/utils/spinner"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { useSelectedAccount } from "@/context/selectedAccountCntext"

export default function PagamentosReferencia() {

    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<ReferencePaymentType | null>(null)

    const [queryParams, setQueryParams] = useState<PaymentFilters>({
        payment_reference: "",
        payment_status: "",
        mft_status: "",
        prt_status: "",
        payment_id: "",
        start_date: "",
        end_date: "",
        limit: 10
    })

    const [cursor, setCursor] = useState("")
    const [cursorHistory, setCursorHistory] = useState([""])
    const [_isFiltered, setIsFiltered] = useState(false)
    const { account: selectedAccount } = useSelectedAccount();


    async function getPayments(cursor = "") {
        if (!selectedAccount) {
            console.error("Nenhuma conta empresa selecionada. Não é possível buscar pagamentos.");
            return { code: "", payments: [], next_cursor: null };
        }
        try {
            const params = new URLSearchParams()

            if (queryParams.payment_reference) params.set("payment_reference", queryParams.payment_reference)
            if (queryParams.payment_status) params.set("payment_status", queryParams.payment_status)
            if (queryParams.mft_status) params.set("mft_status", queryParams.mft_status)
            if (queryParams.prt_status) params.set("prt_status", queryParams.prt_status)
            if (queryParams.payment_id) params.set("payment_id", queryParams.payment_id)
            if (queryParams.start_date) params.set("start_date", queryParams.start_date)
            if (queryParams.end_date) params.set("end_date", queryParams.end_date)
            if (cursor) params.set("cursor", cursor)

            params.set("limit", String(queryParams.limit))

            const urlPayments = `/front/merchant/${selectedAccount?.merchant_payment_number}/payments?${params.toString()}`

            const { data } = await api.get(urlPayments)

            setIsFiltered(false)

            return data
        } catch (error) {
            console.log("Erro ao buscar pagamentos", error)
            return { code: "", payments: [], next_cursor: null }
        }
    }

    const { data, refetch, isLoading, isFetching } =
        useQuery<ReferencePaymentResponse>({
            queryKey: [
                "listaPagamentosReferencia",
                selectedAccount?.id,
                queryParams,
                cursor
            ],
            queryFn: () => getPayments(cursor),
            placeholderData: keepPreviousData,
        })


    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };

    const filteredPaymentsData = useMemo(() => {
        if (!data?.payments?.length) return []

        if (!searchInput.trim()) {
            return data.payments
        }

        const searchTerm = searchInput.toLowerCase().trim()

        return data.payments.filter((item: ReferencePaymentType) => {
            const paymentId = String(item?.payment_id || "").toLowerCase()
            const entityCode = String(item?.entity_code || "").toLowerCase()
            const reference = String(item?.payment_reference || "").toLowerCase()
            const amount = String(item?.operation_amount || "").toLowerCase()
            const paymentStatus = String(item?.payment_status || "").toLowerCase()
            const processingStatus = String(item?.prt_status || "").toLowerCase()
            const location = String(item?.payment_location || "").toLowerCase()
            const date = String(item?.transaction_datetime || "").toLowerCase()

            return (
                paymentId.includes(searchTerm) ||
                entityCode.includes(searchTerm) ||
                reference.includes(searchTerm) ||
                amount.includes(searchTerm) ||
                paymentStatus.includes(searchTerm) ||
                processingStatus.includes(searchTerm) ||
                location.includes(searchTerm) ||
                date.includes(searchTerm)
            )
        })
    }, [data?.payments, searchInput])

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" || event.key === 'Backspace') {
            handleSearch(searchInput);
        }
        if (event.target.value) {
            handleSearch(event.target.value);
        }
    };

    const generatePaginationRange = (totalPages: number, currentPage: number): (number | string)[] => {
        const delta = 2; // Mostra 2 páginas antes e depois da atual
        const range: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                range.push('...');
            }
        }

        return range;
    };

    const totalPages = currentPage + (data?.next_cursor ? 1 : 0)
    const paginationRange = generatePaginationRange(totalPages, currentPage);
    const pageTotalAmount = (data?.payments ?? []).reduce(
        (total, payment) => total + Number(payment.operation_amount || 0),
        0,
    )

    const handlePageChange = (page: number) => {
        if (page === currentPage) return
        const pageCursor = cursorHistory[page - 1]
        if (pageCursor !== undefined) {
            setCursor(pageCursor)
            setCurrentPage(page)
        } else if (page === currentPage + 1) {
            handleNextPage()
        }
    };

    const handleNextPage = () => {
        const nextCursor = data?.next_cursor
        if (!nextCursor) return

        setCursorHistory((history) => [...history.slice(0, currentPage), nextCursor])
        setCursor(nextCursor)
        setCurrentPage((page) => page + 1)
    }

    const handlePrevPage = async () => {
        if (currentPage <= 1) return

        const previousPage = currentPage - 1
        setCursor(cursorHistory[previousPage - 1] ?? "")
        setCurrentPage(previousPage)
    };

    const limparFiltro = () => {
        setShowClearFilter(false)

        setQueryParams({
            payment_reference: "",
            payment_status: "",
            mft_status: "",
            prt_status: "",
            payment_id: "",
            start_date: "",
            end_date: "",
            limit: 10
        })

        setCursor("")
        setCursorHistory([""])
        setCurrentPage(1)

        setTimeout(() => refetch(), 0)
    }

    return (
        <>
            {/* modal para filtrar */}
            <FilterPaymentsReference
                setShowFilter={setShowClearFilter}
                filter={getPayments}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                setCursor={setCursor}
                setCurrentPage={setCurrentPage}
                setCursorHistory={setCursorHistory}
            />

            {/*modal para ver detalhes */}
            <DetalhesPagamentoReference itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="flex flex-col gap-3 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <FilterButton onClick={() => setFilterModalIsOpen(true)} label="Filtrar pagamentos por referência" />
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
                                aria-label="Pesquisar pagamentos por referência"
                                placeholder="Pesquisar pagamentos..."
                                value={searchInput}
                                onKeyDown={handleKeyDown}
                                onChange={(event) => handleSearch(event.target.value)}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>
                    <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                        <span>
                            <strong>Entidade Sómoney:</strong>
                            <span className="inline-flex items-center gap-1.5">
                                <span>11269</span>
                                <CopyTextButton value="11269" label="entidade Sómoney" />
                            </span>
                        </span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Registos nesta página:</strong> <span className="font-semibold">{isLoading ? "..." : data?.payments.length ?? 0}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Valor nesta página:</strong> <span className="font-semibold">{isLoading ? "..." : formatCurrency(pageTotalAmount)}</span></span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E5EBF4]">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">
                                    <th className="text-start px-4 py-2 w-[20%]">ID do Pagamento</th>
                                    <th className={`text-start py-2 w-[20%]`}>Referência</th>
                                    <th className="text-start  py-2 ">Valor</th>
                                    <th className="ui-date-column text-center  py-2 ">Data</th>
                                    <th className="text-start  py-2 ">Estado</th>
                                    <th className="text-start  py-2 w-[10%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={6} state="loading" message="A carregar pagamentos por referência..." /> :
                                    filteredPaymentsData.length > 0 ? filteredPaymentsData.map((item: ReferencePaymentType) =>
                                        <tr key={item.payment_id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            <td className="text-start py-2 px-3">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <p className="min-w-0 truncate font-semibold">{item.payment_id || "N/A"}</p>
                                                    <CopyTextButton
                                                        value={item.payment_id}
                                                        label="ID do pagamento"
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{item.payment_reference || "N/A"}</span>
                                                    <CopyTextButton value={item.payment_reference} label="referência" />
                                                </div>
                                            </td>

                                            <td className="text-start py-2 font-semibold">{formatCurrency(item.operation_amount)}</td>
                                            <td className="ui-date-column text-center py-2">{formatDateTime(item.transaction_datetime || item.payment_date)}</td>
                                            <td className="text-start py-2 pl-2">
                                                <span
                                                    className={`h-6 rounded-full pr-3 pl-3 py-1 font-semibold ${statusPaymentColor(
                                                        item.payment_status
                                                    )}`}
                                                >
                                                    {statusPayment(item.payment_status) || item.payment_status || "N/A"}
                                                </span>
                                            </td>

                                            <td className="text-start py-2 p-1">
                                                {/*detalhes */}
                                                <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true); setItemSelected(item) }} />
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={6} state="empty" message="Nenhum pagamento por referência encontrado." />
                                }

                            </tbody>
                        </table>

                    </div>
                    {/* paginacao */}

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
