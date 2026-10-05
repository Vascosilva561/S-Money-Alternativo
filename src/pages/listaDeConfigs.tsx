import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import DetailsPools from "@/components/ConfigsMerchants/details"
import AddPool from "@/components/ConfigsMerchants/addPool"
import AddConfig from "@/components/ConfigsMerchants/addConfig"
import DeleteConfig from "@/components/ConfigsMerchants/deleteConfig"
import type { ReferencePool, ReferencePoolResponse } from "@/types/poolsType"
import type { ReferenceConfiguration, ReferenceConfigurationResponse } from "@/types/configMerchant"
import type { PaymentReference, PaymentReferencesResponse } from "@/types/references"
import { getReferenceStatusClass, getReferenceStatusLabel } from "@/components/utils/referenceStatus"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Plus, Search, X } from "lucide-react"
import { useMemo, useState } from "react"

type ConfigTab = "ListaDePools" | "Configuracoes" | "Referencias"

export default function ListaDeConfiguracoes() {
    const perPage = "50"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [addConfigModalIsOpen, setAddConfigModalIsOpen] = useState(false)
    const [addPoolModalIsOpen, setAddPoolModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [itemSelected, setItemSelected] = useState<ReferencePool | null>(null)
    const [itemSelectedConfig, setItemSelectedConfig] = useState<ReferenceConfiguration | null>(null)
    const [itemSelectedReference, setItemSelectedReference] = useState<PaymentReference | null>(null)
    const [modalEliminar, setModalEliminar] = useState(false)
    const [queryParams] = useState({
        title: "",
        active: true,
        start_date: "",
        end_date: "",
        status: "",
    })
    const [separador, setSeparador] = useState<ConfigTab>("ListaDePools")
    const [isFiltered] = useState(false)

    async function getConfis(page: number) {
        try {
            const url = separador === "ListaDePools"
                ? "/front/merchant/somoney_reference/pools"
                : "/front/merchant/somoney_reference/client-configs"

            const urlUserBackoffice = isFiltered
                ? `${url}?per_page=${perPage}&page=${page}&${new URLSearchParams({
                    title: queryParams.title,
                    active: String(queryParams.active),
                    start_date: queryParams.start_date,
                    end_date: queryParams.end_date,
                }).toString()}`
                : `${url}?per_page=${perPage}&page=${page}`

            const { data } = await api.get(urlUserBackoffice)
            return data
        } catch (error) {
            console.error("Erro ao carregar configurações de empresas:", error)
        }
    }

    const getReferences = async () => {
        try {
            const { data } = await api.get(
                `/front/sector_payment_references?per_page=${perPage}&page=${currentPage}`
            )
            return data
        } catch (error) {
            console.error("Erro ao carregar referências:", error)
        }
    }

    const poolsQuery = useQuery<ReferencePoolResponse>({
        queryKey: ["ListaDePools", currentPage, perPage, isFiltered],
        queryFn: () => getConfis(currentPage),
        placeholderData: keepPreviousData,
        enabled: separador === "ListaDePools",
    })
    const configQuery = useQuery<ReferenceConfigurationResponse>({
        queryKey: ["ConfigIndicacoes", currentPage, perPage, isFiltered],
        queryFn: () => getConfis(currentPage),
        placeholderData: keepPreviousData,
        enabled: separador === "Configuracoes",
    })
    const referencesQuery = useQuery<PaymentReferencesResponse>({
        queryKey: ["Referencias", currentPage, perPage],
        queryFn: getReferences,
        placeholderData: keepPreviousData,
        enabled: separador === "Referencias",
    })

    const poolsData = poolsQuery.data ?? []
    const configData = configQuery.data ?? []
    const referencesData = referencesQuery.data

    const handleSearch = (value: string) => {
        setSearchInput(value)
        setCurrentPage(1)
    }

    const filteredReferences = useMemo<PaymentReference[]>(() => {
        const list = referencesData?.dados ?? []
        const search = searchInput.trim().toLowerCase()
        if (!search) return list

        return list.filter((item) => [
            item.payment_reference,
            item.merchant_number,
            item.transaction_reference,
            item.receipt_text,
            item.optional_1,
            item.optional_2,
            item.optional_3,
            item.nib,
            item.status,
            item.merchant?.business_name,
            item.merchant?.merchant_payment_number,
            item.merchant?.email,
        ].some((field) => String(field ?? "").toLowerCase().includes(search)))
    }, [referencesData, searchInput])

    const filteredPools = useMemo<ReferencePool[]>(() => {
        const search = searchInput.trim().toLowerCase()
        if (!search) return poolsData

        return poolsData.filter((item) =>
            item.id.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            String(item.reference_length).includes(search)
        )
    }, [poolsData, searchInput])

    const filteredConfig = useMemo<ReferenceConfiguration[]>(() => {
        const search = searchInput.trim().toLowerCase()
        if (!search) return configData

        return configData.filter((item) => [
            item.id,
            item.client_id,
            item.pool_id,
            item.profile,
            item.average_daily_volume,
            item.merchant?.business_name,
        ].some((field) => String(field ?? "").toLowerCase().includes(search)))
    }, [configData, searchInput])

    const totalItems = separador === "ListaDePools"
        ? poolsData.length
        : separador === "Configuracoes"
            ? configData.length
            : referencesData?.total ?? 0
    const totalPages = Math.ceil(totalItems / Number(perPage))
    const paginationRange = useMemo<(number | string)[]>(() => {
        const range: (number | string)[] = []
        for (let page = 1; page <= totalPages; page += 1) {
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                range.push(page)
            } else if (page === currentPage - 2 || page === currentPage + 2) {
                range.push("...")
            }
        }
        return range
    }, [currentPage, totalPages])

    const handlePageChange = (page: number) => setCurrentPage(page)
    const handlePreviousPage = () => setCurrentPage((page) => Math.max(1, page - 1))
    const handleNextPage = () => setCurrentPage((page) => Math.min(totalPages, page + 1))

    const changeTab = (tab: ConfigTab) => {
        setCurrentPage(1)
        setSearchInput("")
        setSeparador(tab)
    }

    const isLoading = separador === "ListaDePools"
        ? poolsQuery.isLoading
        : separador === "Configuracoes"
            ? configQuery.isLoading
            : referencesQuery.isLoading
    const isFetching = separador === "ListaDePools"
        ? poolsQuery.isFetching
        : separador === "Configuracoes"
            ? configQuery.isFetching
            : referencesQuery.isFetching
    const activeRefetch = separador === "ListaDePools"
        ? poolsQuery.refetch
        : separador === "Configuracoes"
            ? configQuery.refetch
            : referencesQuery.refetch
    const columnCount = separador === "ListaDePools" ? 4 : 6

    return (
        <>
            <AddConfig
                onClose={() => setAddConfigModalIsOpen(false)}
                isOpen={addConfigModalIsOpen}
                mode="create"
            />
            <AddConfig
                config={itemSelectedConfig}
                onClose={() => setEditModalIsOpen(false)}
                isOpen={editModalIsOpen}
                mode="edit"
            />
            <AddPool
                onClose={() => setAddPoolModalIsOpen(false)}
                isOpen={addPoolModalIsOpen}
            />
            <DetailsPools
                itemSelected={
                    separador === "ListaDePools"
                        ? itemSelected
                        : separador === "Configuracoes"
                            ? itemSelectedConfig
                            : itemSelectedReference
                }
                onClose={() => setDetailsModalIsOpen(false)}
                isOpen={detailsModalIsOpen}
            />
            <DeleteConfig
                isOpen={modalEliminar}
                onOpenChange={setModalEliminar}
                config={itemSelectedConfig}
            />

            <div className="ui-tabs ui-company-tabs flex" role="tablist" aria-label="Configurações de empresas" onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
                event.preventDefault()
                const tabs: ConfigTab[] = ["ListaDePools", "Configuracoes", "Referencias"]
                const currentIndex = tabs.indexOf(separador)
                const direction = event.key === "ArrowRight" ? 1 : -1
                const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length]
                changeTab(nextTab)
                document.getElementById(`company-tab-${nextTab}`)?.focus()
            }}>
                {([
                    ["ListaDePools", "Pools"],
                    ["Configuracoes", "Configurações"],
                    ["Referencias", "Referências"],
                ] as const).map(([tab, label]) => (
                    <button
                        key={tab}
                        id={`company-tab-${tab}`}
                        type="button"
                        role="tab"
                        aria-selected={separador === tab}
                        aria-controls="company-config-panel"
                        tabIndex={separador === tab ? 0 : -1}
                        onClick={() => changeTab(tab)}
                        className={`cursor-pointer border-x px-3 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] ${separador === tab
                            ? "border-t-4 border-[#D7E2F2] bg-white"
                            : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <section id="company-config-panel" role="tabpanel" aria-labelledby={`company-tab-${separador}`} tabIndex={0} className="ui-data-page overflow-hidden rounded-b-xl rounded-tr-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="p-4 sm:p-5 lg:p-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            {separador !== "Referencias" && (
                                <Button
                                    type="button"
                                    variant="default"
                                    onClick={() => separador === "ListaDePools" ? setAddPoolModalIsOpen(true) : setAddConfigModalIsOpen(true)}
                                    className="h-10 rounded-lg bg-[#143163] px-4 font-semibold text-white shadow-sm transition-colors hover:bg-[#1D467F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2"
                                >
                                    <Plus aria-hidden="true" />
                                    {separador === "ListaDePools" ? "Adicionar pool" : "Adicionar configuração"}
                                </Button>
                            )}
                            <RefreshButton onRefresh={() => { void activeRefetch() }} isLoading={isFetching} />
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                            <div className="relative w-full sm:w-[300px] sm:shrink-0">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" aria-hidden="true" />
                                <Input
                                    type="search"
                                    aria-label="Pesquisar configurações de empresas"
                                    placeholder="Pesquisar registos"
                                    value={searchInput}
                                    onChange={(event) => handleSearch(event.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        aria-label="Limpar pesquisa"
                                        onClick={() => handleSearch("")}
                                        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#8293AE] hover:bg-[#F1F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
                                    >
                                        <X className="size-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="ui-record-count mt-4 flex items-center gap-2 text-sm text-[#637590]">
                        <span className="font-semibold">Total geral de registos:</span>
                        <span>{isLoading ? "…" : totalItems}</span>
                    </div>

                    <div className="mt-2 overflow-x-auto rounded-lg border border-[#E3EAF4]">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead className="bg-[#F5F7FB] text-xs font-semibold tracking-wide text-[#637590]">
                                {separador === "ListaDePools" ? (
                                    <tr>
                                        <th scope="col" className="px-4 py-3">ID</th>
                                        <th scope="col" className="px-4 py-3">Descrição</th>
                                        <th scope="col" className="px-4 py-3 text-center">Tamanho da referência</th>
                                        <th scope="col" className="px-4 py-3 text-right">Acções</th>
                                    </tr>
                                ) : separador === "Configuracoes" ? (
                                    <tr>
                                        <th scope="col" className="px-4 py-3">ID</th>
                                        <th scope="col" className="px-4 py-3">Cliente</th>
                                        <th scope="col" className="px-4 py-3">Pool</th>
                                        <th scope="col" className="px-4 py-3">Perfil</th>
                                        <th scope="col" className="px-4 py-3">Volume médio diário</th>
                                        <th scope="col" className="px-4 py-3 text-right">Acções</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Referência</th>
                                        <th scope="col" className="px-4 py-3">Cliente</th>
                                        <th scope="col" className="px-4 py-3">Valor</th>
                                        <th scope="col" className="px-4 py-3">Prazo</th>
                                        <th scope="col" className="px-4 py-3">Estado</th>
                                        <th scope="col" className="px-4 py-3 text-right">Detalhes</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <TableStateRow colSpan={columnCount} state="loading" message="A carregar registos…" />
                                ) : separador === "ListaDePools" ? (
                                    filteredPools.length ? filteredPools.map((item) => (
                                        <tr key={item.id} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                                            <td className="px-4 py-3 font-medium">{item.id || "—"}</td>
                                            <td className="px-4 py-3">{item.description || "—"}</td>
                                            <td className="px-4 py-3 text-center">{item.reference_length ?? "—"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver pool ${item.id}`}
                                                        onClick={() => {
                                                            setItemSelected(item)
                                                            setDetailsModalIsOpen(true)
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <TableStateRow colSpan={columnCount} state="empty" message="Nenhum pool encontrado." />
                                    )
                                ) : separador === "Configuracoes" ? (
                                    filteredConfig.length ? filteredConfig.map((item) => (
                                        <tr key={item.id} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                                            <td className="max-w-[200px] truncate px-4 py-3 font-medium" title={item.id}>{item.id || "—"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex min-w-[160px] flex-col">
                                                    <span className="font-medium">{item.merchant?.business_name || "—"}</span>
                                                    <span className="text-xs text-[#8293AE]">{item.client_id || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{item.pool_id || "—"}</td>
                                            <td className="px-4 py-3">{item.profile || "—"}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{item.average_daily_volume?.toLocaleString() || "0"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver configuração ${item.id}`}
                                                        onClick={() => {
                                                            setItemSelectedConfig(item)
                                                            setDetailsModalIsOpen(true)
                                                        }}
                                                    />
                                                    <TableActionButton
                                                        action="edit"
                                                        aria-label={`Abrir configuração ${item.id}`}
                                                        onClick={() => {
                                                            setItemSelectedConfig(item)
                                                            setEditModalIsOpen(true)
                                                        }}
                                                    />
                                                    <TableActionButton
                                                        action="delete"
                                                        aria-label={`Eliminar configuração ${item.id}`}
                                                        onClick={() => {
                                                            setItemSelectedConfig(item)
                                                            setModalEliminar(true)
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <TableStateRow colSpan={columnCount} state="empty" message="Nenhuma configuração encontrada." />
                                    )
                                ) : filteredReferences.length ? filteredReferences.map((item) => {
                                    const amount = item.fixed_amount !== null
                                        ? `${item.fixed_amount.toLocaleString()} Kz`
                                        : item.minimum_amount !== null || item.maximum_amount !== null
                                            ? `${item.minimum_amount?.toLocaleString() ?? 0} - ${item.maximum_amount?.toLocaleString() ?? "∞"} Kz`
                                            : "—"

                                    return (
                                        <tr key={item.payment_reference} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold">{item.payment_reference || "—"}</span>
                                                    <CopyTextButton value={item.payment_reference} label="referência de pagamento" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex min-w-[160px] flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold">{item.merchant?.business_name || "—"}</span>
                                                        <CopyTextButton value={item.merchant?.business_name} label="empresa" />
                                                    </div>
                                                    <span className="text-xs text-[#8293AE]">{item.merchant_number || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">{amount}</td>
                                            <td className="whitespace-nowrap px-4 py-3">{item.payment_deadline || "—"}</td>
                                            <td className="px-4 py-3"><span className={`ui-status-tag ${getReferenceStatusClass(item.status)}`}>{getReferenceStatusLabel(item.status)}</span></td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver referência ${item.payment_reference}`}
                                                        onClick={() => {
                                                            setItemSelectedReference(item)
                                                            setDetailsModalIsOpen(true)
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <TableStateRow colSpan={columnCount} state="empty" message="Nenhuma referência encontrada." />
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isFetching && !isLoading && (
                        <p className="mt-3 text-right text-xs text-[#8293AE]" role="status">A actualizar os registos…</p>
                    )}

                    <div className="mt-4">
                        <PaginationFooter
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginationRange={paginationRange}
                            onPageChange={handlePageChange}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
