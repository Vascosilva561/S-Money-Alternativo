import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import DetailsPools from "@/components/ConfigsMerchants/details"
import { getReferenceStatusClass, getReferenceStatusLabel } from "@/components/utils/referenceStatus"
import { formatCurrency } from "@/components/utils/formmat"
import { useSelectedAccount } from "@/context/selectedAccountCntext"
import type { PaymentReference, PaymentReferencesResponse } from "@/types/references"
import { CircleX, Search } from "lucide-react"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import { TextField } from "@/components/ui/form-field"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

const PAGE_SIZE = 100

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

function formatReferenceDate(value: string | null | undefined) {
    if (!value) return "—"

    const dateOnly = value.slice(0, 10)
    const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value
}

function getReferenceAmount(reference: PaymentReference) {
    if (reference.fixed_amount !== null && reference.fixed_amount !== undefined) {
        return formatCurrency(reference.fixed_amount, "Kz")
    }

    if (reference.minimum_amount !== null || reference.maximum_amount !== null) {
        const minimum = formatCurrency(reference.minimum_amount ?? 0, "Kz")
        const maximum = reference.maximum_amount === null
            ? "∞"
            : formatCurrency(reference.maximum_amount, "Kz")
        return `${minimum} – ${maximum}`
    }

    return "—"
}

function getReferenceSearchText(reference: PaymentReference) {
    return [
        reference.payment_reference,
        reference.merchant_number,
        reference.transaction_reference,
        reference.receipt_text,
        reference.optional_1,
        reference.optional_2,
        reference.optional_3,
        reference.nib,
        reference.status,
        reference.merchant?.business_name,
        reference.merchant?.merchant_payment_number,
        reference.merchant?.email,
    ].join(" ").toLocaleLowerCase("pt-AO")
}

export default function Referencias({ contextMerchantNumber, contextual = false }: { contextMerchantNumber?: string; contextual?: boolean } = {}) {
    const { account: selectedAccount } = useSelectedAccount()
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [itemSelectedReference, setItemSelectedReference] = useState<PaymentReference | null>(null)

    const merchantNumber = contextual ? contextMerchantNumber : selectedAccount?.merchant_payment_number

    const { data, refetch, isLoading, isFetching, isError } = useQuery<PaymentReferencesResponse>({
        queryKey: ["listaDeReferencias", currentPage, PAGE_SIZE, merchantNumber],
        enabled: !contextual || Boolean(merchantNumber),
        queryFn: async () => {
            const params = new URLSearchParams({
                per_page: String(PAGE_SIZE),
                page: String(currentPage),
            })
            if (merchantNumber) params.set("merchant_number", merchantNumber)

            const response = await api.get<PaymentReferencesResponse>(
                `/front/sector_payment_references?${params.toString()}`
            )
            return response.data
        },
        placeholderData: keepPreviousData,
    })

    const filteredReferences = useMemo(() => {
        const term = searchInput.trim().toLocaleLowerCase("pt-AO")
        const references = data?.dados ?? []

        return term
            ? references.filter((reference) => getReferenceSearchText(reference).includes(term))
            : references
    }, [data?.dados, searchInput])

    const totalPages = Math.max(1, Math.ceil(Number(data?.total ?? 0) / PAGE_SIZE))
    const paginationRange = createPaginationRange(totalPages, currentPage)

    const clearSearch = () => {
        setSearchInput("")
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page)
    }

    return (
        <>
            <DetailsPools
                itemSelected={itemSelectedReference}
                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />

            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="ui-data-stack flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {searchInput && (
                                <button
                                    type="button"
                                    aria-label="Limpar pesquisa"
                                    title="Limpar pesquisa"
                                    onClick={clearSearch}
                                    className="ui-clear-filter-button"
                                >
                                    <CircleX aria-hidden="true" />
                                    <span>Limpar pesquisa</span>
                                </button>
                            )}
                        </div>

                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            {isFetching && !isLoading && (
                                <span className="text-sm text-[#667895]" role="status">A atualizar...</span>
                            )}
                            <TextField
                                type="search"
                                aria-label="Pesquisar referências"
                                placeholder="Pesquisar referências..."
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value)
                                    setCurrentPage(1)
                                }}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>



                    <TableResults
                        label="Referências encontradas"
                        visibleCount={filteredReferences.length}
                        totalCount={data?.total}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPreviousPage={() => handlePageChange(currentPage - 1)}
                        onNextPage={() => handlePageChange(currentPage + 1)}
                        isLoading={isLoading || isFetching}
                        containerClassName="overflow-hidden rounded-xl border border-[#E5EBF4]"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] table-fixed border-collapse text-sm">
                                <caption className="sr-only">Lista de referências de pagamento</caption>
                                <thead className="h-14 bg-[#F5F6FA]">
                                    <tr className="text-[#143163]">
                                        <th scope="col" className="w-[20%] px-4 py-2 text-start">Referência</th>
                                        <th scope="col" className="w-[25%] px-4 py-2 text-start">Cliente</th>
                                        <th scope="col" className="w-[15%] px-4 py-2 text-start">Valor</th>
                                        <th scope="col" className="w-[14%] px-4 py-2 text-start">Prazo</th>
                                        <th scope="col" className="w-[14%] px-4 py-2 text-start">Estado</th>
                                        <th scope="col" className="w-[12%] px-4 py-2 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableStateRow colSpan={6} state="loading" message="A carregar referências..." />
                                    ) : filteredReferences.length ? (
                                        filteredReferences.map((reference) => (
                                            <tr
                                                key={reference.id || reference.payment_reference}
                                                className="border-t border-[#EBECEF] text-[#143163] odd:bg-white even:bg-[#F8FAFC] transition-colors hover:bg-[#F5F6FA]"
                                            >
                                                <td className="truncate px-4 py-3 text-start font-medium" title={reference.payment_reference || "—"}>
                                                    {reference.payment_reference || "—"}
                                                </td>
                                                <td className="truncate px-4 py-3 text-start" title={reference.merchant?.business_name || "—"}>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="truncate font-medium">{reference.merchant?.business_name || "—"}</span>
                                                        <span className="truncate text-xs text-[#667895]">{reference.merchant_number || "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start font-semibold">
                                                    {getReferenceAmount(reference)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-start">
                                                    {formatReferenceDate(reference.payment_deadline)}
                                                </td>
                                                <td className="px-4 py-3 text-start">
                                                    <span className={`ui-status-tag ${getReferenceStatusClass(reference.status)}`}>
                                                        {getReferenceStatusLabel(reference.status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver detalhes da referência ${reference.payment_reference || ""}`}
                                                        onClick={() => {
                                                            setItemSelectedReference(reference)
                                                            setDetailsModalIsOpen(true)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow
                                            colSpan={6}
                                            state="empty"
                                            message={isError
                                                ? "Não foi possível carregar as referências."
                                                : contextual && !merchantNumber
                                                    ? "Esta conta não tem número de comerciante para consultar referências."
                                                : searchInput.trim()
                                                    ? "Nenhuma referência corresponde à pesquisa."
                                                    : "Nenhuma referência encontrada."}
                                        />
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

