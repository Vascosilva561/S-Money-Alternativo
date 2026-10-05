import { api } from "@/api"
import WebhookFilter, { type WebhookStatusFilter } from "@/components/webhooks/filter"
import WebhookDetails from "@/components/webhooks/details"
import WebhookEdit from "@/components/webhooks/edit"
import DeleteWebhook from "@/components/webhooks/delete"
import { Button } from "@/components/ui/button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { FilterButton } from "@/components/ui/filter-button"
import { Input } from "@/components/ui/input"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import type { Webhook } from "@/types/webhook"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Download, Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const previewWebhook: Webhook = {
    id: "preview-only-webhook",
    name: "Webhook de demonstração",
    url: "https://api.exemplo.ao/webhooks/pagamentos",
    events: ["payment.created", "payment.updated", "payment.failed"],
    channels: ["portal", "mobile"],
    active: true,
    verify_ssl: true,
    created_at: "2026-10-05T09:30:00Z",
}

export default function Webhooks() {
    const perPage = "10"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<WebhookStatusFilter>("all")
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
    const [selectedWebhookIsPreview, setSelectedWebhookIsPreview] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    async function getWebhooks(): Promise<Webhook[]> {
        try {
            const { data } = await api.get("/api/v1/portal/webhooks")
            return Array.isArray(data?.dados)
                ? data.dados
                : Array.isArray(data)
                    ? data
                    : []
        } catch (error) {
            console.error("Erro ao buscar webhooks:", error)
            return []
        }
    }

    const { data: webhooks = [], isFetching, isLoading, refetch } = useQuery({
        queryKey: ["ListaDeWebhooks"],
        queryFn: getWebhooks,
        placeholderData: keepPreviousData,
    })

    const filteredData = useMemo(() => {
        const searchTerm = searchInput.trim().toLowerCase()
        return webhooks.filter((item) => {
            const matchesSearch = !searchTerm || [item.name, item.url].some((value) =>
                String(value ?? "").toLowerCase().includes(searchTerm)
            )
            const matchesStatus = statusFilter === "all" || item.active === (statusFilter === "active")
            return matchesSearch && matchesStatus
        })
    }, [searchInput, statusFilter, webhooks])

    const totalPages = Math.ceil(filteredData.length / Number(perPage))
    const paginatedData = filteredData.slice(
        (currentPage - 1) * Number(perPage),
        currentPage * Number(perPage)
    )
    const paginationRange = useMemo<(number | string)[]>(() => {
        const pages: (number | string)[] = []
        for (let page = 1; page <= totalPages; page += 1) {
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                pages.push(page)
            } else if (page === currentPage - 2 || page === currentPage + 2) {
                pages.push("...")
            }
        }
        return pages
    }, [currentPage, totalPages])

    const handleSearch = (value: string) => {
        setSearchInput(value)
        setCurrentPage(1)
    }

    const exportWebhooks = () => {
        const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`
        const rows = [
            ["Nome", "URL", "Eventos", "Canais", "Activo", "Verificação SSL", "Criado em"],
            ...filteredData.map((item) => [
                item.name,
                item.url,
                renderQuantity(item.events),
                renderQuantity(item.channels),
                item.active ? "Sim" : "Não",
                item.verify_ssl ? "Sim" : "Não",
                formatDate(item.created_at),
            ]),
        ]
        const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(";")).join("\r\n")}`
        const file = new Blob([csv], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(file)
        const link = document.createElement("a")
        link.href = url
        link.download = "webhooks.csv"
        link.click()
        URL.revokeObjectURL(url)
    }

    const clearFilters = () => {
        handleSearch("")
        setStatusFilter("all")
    }

    const applyStatusFilter = (status: WebhookStatusFilter) => {
        setStatusFilter(status)
        setCurrentPage(1)
    }

    const hasActiveFilters = Boolean(searchInput.trim()) || statusFilter !== "all"
    const canPreviewEmptyState = import.meta.env.DEV
        && !isLoading
        && webhooks.length === 0
        && !searchInput.trim()
        && statusFilter === "all"

    const openWebhookPreview = (view: "details" | "edit" | "delete") => {
        setSelectedWebhook(previewWebhook)
        setSelectedWebhookIsPreview(true)
        if (view === "details") setIsDetailsOpen(true)
        if (view === "edit") setIsEditOpen(true)
        if (view === "delete") setIsDeleteOpen(true)
    }

    const formatDate = (date: string) => {
        if (!date) return "—"

        const parsedDate = new Date(date)
        if (Number.isNaN(parsedDate.getTime())) return "—"

        return parsedDate.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const renderQuantity = (value: string[] | number | undefined) => {
        if (Array.isArray(value)) return value.length
        return value ?? 0
    }

    return (
        <>
            <WebhookFilter
                isOpen={filterModalIsOpen}
                status={statusFilter}
                onClose={() => setFilterModalIsOpen(false)}
                onApply={applyStatusFilter}
            />
            <WebhookDetails
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                webhook={selectedWebhook}
            />
            <WebhookEdit
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                webhook={selectedWebhook}
                previewOnly={selectedWebhookIsPreview}
            />
            <DeleteWebhook
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                webhook={selectedWebhook}
                previewOnly={selectedWebhookIsPreview}
            />
            <section className="ui-data-page overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="p-4 sm:p-5 lg:p-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="default"
                                title="Novo webhook"
                                onClick={() => toast.info("A criação de webhooks ainda não está disponível.")}
                                className="h-10 rounded-lg bg-[#143163] px-4 font-semibold text-white shadow-sm transition-colors hover:bg-[#1D467F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2"
                            >
                                <Plus aria-hidden="true" />
                                Novo webhook
                            </Button>
                            <Button type="button" variant="brand" className="h-10 px-4" onClick={exportWebhooks}>
                                <Download aria-hidden="true" />
                                <span>Exportar</span>
                            </Button>
                            <FilterButton
                                label="Filtrar"
                                onClick={() => setFilterModalIsOpen(true)}
                            />
                            {hasActiveFilters && <ClearFiltersButton onClick={clearFilters} />}
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                        </div>

                        <div className="relative w-full sm:w-[300px] sm:shrink-0">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" aria-hidden="true" />
                                <Input
                                    type="search"
                                    aria-label="Pesquisar webhooks"
                                    placeholder="Pesquisar por nome ou URL"
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

                    <div className="ui-record-count mt-4 flex items-center gap-2 text-sm text-[#637590]">
                        <span className="font-semibold">Total geral de registos:</span>
                        <span>{isLoading ? "…" : filteredData.length}</span>
                    </div>

                    <div className="mt-5 overflow-x-auto rounded-lg border border-[#E3EAF4]">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead className="bg-[#F5F7FB] text-xs font-semibold tracking-wide text-[#637590]">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Nome</th>
                                    <th scope="col" className="px-4 py-3">URL</th>
                                    <th scope="col" className="px-4 py-3">Eventos</th>
                                    <th scope="col" className="px-4 py-3">Canais</th>
                                    <th scope="col" className="px-4 py-3">Activo</th>
                                    <th scope="col" className="px-4 py-3">Verificação SSL</th>
                                    <th scope="col" className="px-4 py-3">Criado em</th>
                                    <th scope="col" className="px-4 py-3 text-right">Acções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <TableStateRow colSpan={8} state="loading" message="A carregar webhooks…" />
                                ) : paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <tr key={item.id} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold">{item.name || "—"}</span>
                                                    <CopyTextButton value={item.name} label="nome do webhook" />
                                                </div>
                                            </td>
                                            <td className="max-w-[320px] px-4 py-3 text-[#536176]" title={item.url}>
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="min-w-0 truncate font-semibold">{item.url || "—"}</span>
                                                    <CopyTextButton value={item.url} label="URL do webhook" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{renderQuantity(item.events)}</td>
                                            <td className="px-4 py-3">{renderQuantity(item.channels)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`ui-status-tag ${item.active ? "bg-[#45B36938] text-[#0D9339]" : "bg-[#F2F4F7] text-[#536176]"}`}>
                                                    {item.active ? "Sim" : "Não"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`ui-status-tag ${item.verify_ssl ? "bg-[#45B36938] text-[#0D9339]" : "bg-[#F2F4F7] text-[#536176]"}`}>
                                                    {item.verify_ssl ? "Verificado" : "Desactivado"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-[#536176]">{formatDate(item.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <TableActionButton
                                                        action="view"
                                                        aria-label={`Ver webhook ${item.name}`}
                                                        onClick={() => { setSelectedWebhook(item); setSelectedWebhookIsPreview(false); setIsDetailsOpen(true) }}
                                                    />
                                                    <TableActionButton
                                                        action="edit"
                                                        aria-label={`Editar webhook ${item.name}`}
                                                        onClick={() => { setSelectedWebhook(item); setSelectedWebhookIsPreview(false); setIsEditOpen(true) }}
                                                    />
                                                    <TableActionButton
                                                        action="delete"
                                                        aria-label={`Eliminar webhook ${item.name}`}
                                                        onClick={() => { setSelectedWebhook(item); setSelectedWebhookIsPreview(false); setIsDeleteOpen(true) }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <TableStateRow
                                        colSpan={8}
                                        state="empty"
                                        message={searchInput ? "Nenhum webhook corresponde à pesquisa." : "Nenhum webhook encontrado."}
                                    >
                                        {canPreviewEmptyState && (
                                            <div className="mt-3 flex max-w-2xl flex-col items-center gap-3">
                                                <p className="text-xs text-[#8293AE]">
                                                    Pré-visualize os modais com dados de exemplo. Nada será gravado ou eliminado.
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={() => openWebhookPreview("details")}>
                                                        <Eye aria-hidden="true" /> Ver detalhes
                                                    </Button>
                                                    <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={() => openWebhookPreview("edit")}>
                                                        <Pencil aria-hidden="true" /> Ver edição
                                                    </Button>
                                                    <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={() => openWebhookPreview("delete")}>
                                                        <Trash2 aria-hidden="true" /> Ver eliminação
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </TableStateRow>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isFetching && !isLoading && (
                        <p className="mt-3 text-right text-xs text-[#8293AE]" role="status">A actualizar a lista…</p>
                    )}

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
            </section>
        </>
    )
}
