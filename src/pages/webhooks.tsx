import { TableResults } from "@/components/ui/table-results"
import { api } from "@/api"
import WebhookFilter, { type WebhookStatusFilter } from "@/components/webhooks/filter"
import WebhookDetails from "@/components/webhooks/details"
import WebhookEdit from "@/components/webhooks/edit"
import WebhookDeliveryDetails from "@/components/webhooks/deliveryDetails"
import { Button } from "@/components/ui/button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { FilterButton } from "@/components/ui/filter-button"
import { Input } from "@/components/ui/input"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelectedAccount } from "@/context/selectedAccountCntext"
import type { Webhook, WebhookServiceType, WebhooksResponse } from "@/types/webhook"
import type { WebhookDeliveriesResponse, WebhookDeliveryDetailsResponse } from "@/types/webhookDelivery"
import { useQuery } from "@tanstack/react-query"
import { Search, X } from "lucide-react"
import { useMemo, useRef, useState, type KeyboardEvent } from "react"

type WebhooksScreen = "webhooks" | "logs"

function formatDate(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDeliveryStatus(value?: string) {
  const normalized = value?.toUpperCase()
  if (normalized === "SUCCESS" || normalized === "SUCCEEDED") return "Concluído"
  if (normalized === "FAILED" || normalized === "FAILURE") return "Falhou"
  return value || "Desconhecido"
}

function statusClass(value?: string) {
  const normalized = value?.toUpperCase()
  if (normalized === "SUCCESS" || normalized === "SUCCEEDED") return "bg-[#45B36938] text-[#0D9339]"
  if (normalized === "FAILED" || normalized === "FAILURE") return "bg-[#FDECEC] text-[#B42318]"
  return "bg-[#F2F4F7] text-[#536176]"
}

function paginationFor(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []
  for (let page = 1; page <= totalPages; page += 1) {
    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) pages.push(page)
    else if (page === currentPage - 2 || page === currentPage + 2) pages.push("…")
  }
  return pages
}

export default function Webhooks({ contextMerchantId }: { contextMerchantId?: string | number } = {}) {
  const pageSize = 10
  const { account } = useSelectedAccount()
  const merchantId = contextMerchantId ?? account?.id
  const [screen, setScreen] = useState<WebhooksScreen>("webhooks")
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [serviceType, setServiceType] = useState<WebhookServiceType>("gpo")
  const [searchInput, setSearchInput] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<WebhookStatusFilter>("all")
  const [filterIsOpen, setFilterIsOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | number | null>(null)
  const [deliveryDetailsIsOpen, setDeliveryDetailsIsOpen] = useState(false)

  const webhooksQuery = useQuery({
    queryKey: ["ListaDeWebhooks", merchantId, serviceType],
    enabled: Boolean(merchantId),
    queryFn: async () => {
      const { data } = await api.get<WebhooksResponse>(
        `/front/merchants/${merchantId}/webhooks?service_type=${serviceType}`,
      )
      return data
    },
  })

  const deliveriesQuery = useQuery({
    queryKey: ["ListaDeLogs", merchantId, serviceType],
    enabled: Boolean(merchantId),
    queryFn: async () => {
      const { data } = await api.get<WebhookDeliveriesResponse>(
        `/front/merchants/${merchantId}/webhooks/logs/${serviceType}`,
      )
      return data
    },
  })

  const deliveryDetailsQuery = useQuery({
    queryKey: ["DetalhesDoLog", merchantId, serviceType, selectedDeliveryId],
    enabled: Boolean(merchantId && selectedDeliveryId !== null && deliveryDetailsIsOpen),
    queryFn: async () => {
      const { data } = await api.get<WebhookDeliveryDetailsResponse>(
        `/front/merchants/${merchantId}/webhooks/logs/${serviceType}/${selectedDeliveryId}`,
      )
      return data
    },
  })

  const webhooks = webhooksQuery.data?.data ?? []
  const deliveries = deliveriesQuery.data?.data ?? []
  const searchTerm = searchInput.trim().toLowerCase()

  const filteredWebhooks = useMemo(() => webhooks.filter((item) => {
    const fields = [item.name, item.url, item.merchant_number, item.service_type, item.subscriber_type, ...item.events]
    const matchesSearch = !searchTerm || fields.some((value) => String(value ?? "").toLowerCase().includes(searchTerm))
    const matchesStatus = statusFilter === "all" || item.is_active === (statusFilter === "active")
    return matchesSearch && matchesStatus
  }), [searchTerm, statusFilter, webhooks])

  const filteredDeliveries = useMemo(() => deliveries.filter((item) => {
    if (!searchTerm) return true
    const fields = [item.id, item.status, item.hook, item.service, item.merchant_number, item.occurred_at,
      item.payload?.payment_id, item.payload?.payment_reference, item.payload?.payment_status]
    return fields.some((value) => String(value ?? "").toLowerCase().includes(searchTerm))
  }), [deliveries, searchTerm])

  const tableData = screen === "webhooks" ? filteredWebhooks : filteredDeliveries
  const totalPages = Math.max(1, Math.ceil(tableData.length / pageSize))
  const paginatedData = tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginationRange = useMemo(() => paginationFor(currentPage, totalPages), [currentPage, totalPages])
  const activeFilters = Boolean(searchTerm) || (screen === "webhooks" && statusFilter !== "all")
  const isFetching = screen === "webhooks" ? webhooksQuery.isFetching : deliveriesQuery.isFetching
  const isLoading = screen === "webhooks" ? webhooksQuery.isLoading : deliveriesQuery.isLoading
  const isError = screen === "webhooks" ? webhooksQuery.isError : deliveriesQuery.isError
  const refresh = screen === "webhooks" ? webhooksQuery.refetch : deliveriesQuery.refetch

  const switchScreen = (next: WebhooksScreen) => {
    setScreen(next)
    setCurrentPage(1)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === "ArrowRight") nextIndex = (index + 1) % 2
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + 2) % 2
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = 1
    if (nextIndex === undefined) return
    event.preventDefault()
    switchScreen(nextIndex === 0 ? "webhooks" : "logs")
    tabRefs.current[nextIndex]?.focus()
  }

  const changeServiceType = (next: WebhookServiceType) => {
    setServiceType(next)
    setCurrentPage(1)
    setSelectedDeliveryId(null)
    setDeliveryDetailsIsOpen(false)
  }

  const updateSearch = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    updateSearch("")
    setStatusFilter("all")
  }

  const openDeliveryDetails = (id: string | number) => {
    setSelectedDeliveryId(id)
    setDeliveryDetailsIsOpen(true)
  }

  return (
    <>
      <WebhookFilter
        isOpen={filterIsOpen}
        status={statusFilter}
        onClose={() => setFilterIsOpen(false)}
        onApply={(nextStatus) => { setStatusFilter(nextStatus); setCurrentPage(1) }}
      />
      <WebhookDetails
        isOpen={detailsIsOpen}
        onClose={() => setDetailsIsOpen(false)}
        webhook={selectedWebhook}
      />
      <WebhookEdit
        isOpen={editIsOpen}
        onClose={() => setEditIsOpen(false)}
        webhook={selectedWebhook}
        merchantId={merchantId}
      />
      <WebhookEdit
        isOpen={createIsOpen}
        onClose={() => setCreateIsOpen(false)}
        webhook={null}
        merchantId={merchantId}
        createMode
      />
      <WebhookDeliveryDetails
        isOpen={deliveryDetailsIsOpen}
        onClose={() => { setDeliveryDetailsIsOpen(false); setSelectedDeliveryId(null) }}
        delivery={deliveryDetailsQuery.data?.delivery ?? null}
        logs={deliveryDetailsQuery.data?.logs ?? []}
        isLoading={deliveryDetailsQuery.isLoading}
        isError={deliveryDetailsQuery.isError}
        onRetry={() => { void deliveryDetailsQuery.refetch() }}
      />

      <div role="tablist" aria-label="Secções de Webhooks" aria-orientation="horizontal" className="ui-tabs mb-0 flex">
        {(["webhooks", "logs"] as const).map((tab, index) => {
          const isSelected = screen === tab
          return (
            <button
              key={tab}
              ref={(element) => { tabRefs.current[index] = element }}
              id={`webhooks-tab-${tab}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="webhooks-tab-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => switchScreen(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={isSelected ? "border-t-4 border-[#48B9FF]" : ""}
            >
              {tab === "webhooks" ? "Webhooks" : "Logs de entregas"}
            </button>
          )
        })}
      </div>

      <section id="webhooks-tab-panel" role="tabpanel" aria-labelledby={`webhooks-tab-${screen}`} tabIndex={0} className="ui-data-page !mt-0 overflow-hidden rounded-b-xl rounded-tr-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
        <div className="p-4 sm:p-5 lg:p-6 ui-data-stack">
          <div className="ui-toolbar flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {screen === "webhooks" ? (
                <>
                  <Button type="button" variant="brand" className="h-10 rounded-lg px-4" onClick={() => setCreateIsOpen(true)}>
                    <span aria-hidden="true" className="text-lg leading-none">+</span>
                    Novo webhook
                  </Button>
                  <FilterButton label="Filtrar" onClick={() => setFilterIsOpen(true)} />
                </>
              ) : null}
              {activeFilters && <ClearFiltersButton onClick={clearFilters} />}
              <RefreshButton onRefresh={() => { void refresh() }} isLoading={isFetching} />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Select value={serviceType} onValueChange={(value) => changeServiceType(value as WebhookServiceType)}>
                <SelectTrigger className="w-full sm:w-[230px]" aria-label="Tipo de serviço">
                  <SelectValue placeholder="Seleccione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpo">Pagamentos GPO</SelectItem>
                  <SelectItem value="sector">Pagamentos por referência</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-[300px] sm:shrink-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" aria-hidden="true" />
                <Input
                  type="search"
                  aria-label={screen === "webhooks" ? "Pesquisar webhooks" : "Pesquisar logs de entrega"}
                  placeholder={screen === "webhooks" ? "Pesquisar webhooks..." : "Pesquisar logs..."}
                  value={searchInput}
                  onChange={(event) => updateSearch(event.target.value)}
                  className="pl-10 pr-10"
                />
                {searchInput && (
                  <button
                    type="button"
                    aria-label="Limpar pesquisa"
                    onClick={() => updateSearch("")}
                    className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#8293AE] hover:bg-[#F1F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>



          <TableResults
              label={screen === "webhooks" ? "Webhooks encontrados" : "Entregas encontradas"}
              visibleCount={paginatedData.length}
              totalCount={tableData.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
              onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              isLoading={isLoading || (screen === "webhooks" ? webhooksQuery.isFetching : deliveriesQuery.isFetching)}
              containerClassName="overflow-x-auto rounded-lg border border-[#E3EAF4]"
          >
            {screen === "webhooks" ? (
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead className="bg-[#F5F7FB] text-xs font-semibold tracking-wide text-[#637590]">
                  <tr>
                    <th scope="col" className="px-4 py-3">Nome</th>
                    <th scope="col" className="px-4 py-3">URL</th>
                    <th scope="col" className="px-4 py-3">Eventos</th>
                    <th scope="col" className="px-4 py-3">Tipo de serviço</th>
                    <th scope="col" className="px-4 py-3">Estado</th>
                    <th scope="col" className="px-4 py-3">Verificar SSL</th>
                    <th scope="col" className="px-4 py-3">Data de criação</th>
                    <th scope="col" className="px-4 py-3 text-right">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableStateRow colSpan={8} state="loading" message="A carregar webhooks…" />
                  ) : paginatedData.length > 0 ? (
                    (paginatedData as Webhook[]).map((item) => (
                      <tr key={item.id} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{item.name || "—"}</span>
                            {item.name && <CopyTextButton value={item.name} label="nome do webhook" />}
                          </div>
                          {item.merchant_number && <span className="mt-1 block text-xs text-[#8998B1]">Nº {item.merchant_number}</span>}
                        </td>
                        <td className="max-w-[300px] px-4 py-3 text-[#536176]" title={item.url}>
                          <div className="flex min-w-0 items-center gap-1.5">
                            {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate font-medium text-[#2678F2] hover:underline">{item.url}</a> : <span>—</span>}
                            {item.url && <CopyTextButton value={item.url} label="URL do webhook" />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-[#EAF6F8] px-3 py-1 text-xs font-medium text-[#143163]" title={item.events?.join("\n") || "Sem eventos subscritos"}>
                            {item.events?.length ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block font-medium">{item.service_type === "gpo" ? "GPO" : "Sector"}</span>
                          <span className="block text-xs text-[#8998B1]">{item.subscriber_type === "internal_payments" ? "Pagamentos Sómoney" : "Pagamentos externos"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`ui-status-tag ${item.is_active ? "bg-[#45B36938] text-[#0D9339]" : "bg-[#8E8E8E30] text-[#575757]"}`}>
                            {item.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`ui-status-tag ${item.check_ssl ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                            {item.check_ssl ? "Sim" : "Não"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#536176]">{formatDate(item.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <TableActionButton action="view" aria-label={`Ver webhook ${item.name}`} onClick={() => { setSelectedWebhook(item); setDetailsIsOpen(true) }} />
                            <TableActionButton action="edit" aria-label={`Editar webhook ${item.name}`} onClick={() => { setSelectedWebhook(item); setEditIsOpen(true) }} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <TableStateRow
                      colSpan={8}
                      state="empty"
                      message={!merchantId ? "Seleccione uma conta para consultar os webhooks." : isError ? "Não foi possível carregar os webhooks." : searchTerm ? "Nenhum webhook corresponde à pesquisa." : "Nenhum webhook encontrado."}
                    >
                      {isError && <Button type="button" variant="outline" className="mt-2 h-9 rounded-lg" onClick={() => { void webhooksQuery.refetch() }}>Tentar novamente</Button>}
                    </TableStateRow>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead className="bg-[#F5F7FB] text-xs font-semibold tracking-wide text-[#637590]">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID da entrega</th>
                    <th scope="col" className="px-4 py-3">Evento</th>
                    <th scope="col" className="px-4 py-3">Serviço</th>
                    <th scope="col" className="px-4 py-3">Estado</th>
                    <th scope="col" className="px-4 py-3">Data do evento</th>
                    <th scope="col" className="px-4 py-3 text-right">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableStateRow colSpan={6} state="loading" message="A carregar logs de entrega…" />
                  ) : paginatedData.length > 0 ? (
                    (paginatedData as WebhookDeliveriesResponse["data"]).map((item) => (
                      <tr key={item.id} className="border-b border-[#EEF2F7] text-[#143163] last:border-b-0 hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 font-medium">{item.id}</td>
                        <td className="max-w-[260px] truncate px-4 py-3" title={item.hook}>{item.hook || "—"}</td>
                        <td className="px-4 py-3">{item.service || "—"}</td>
                        <td className="px-4 py-3"><span className={`ui-status-tag ${statusClass(item.status)}`}>{formatDeliveryStatus(item.status)}</span></td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#536176]">{formatDate(item.occurred_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <TableActionButton action="view" aria-label={`Ver entrega ${item.id}`} onClick={() => openDeliveryDetails(item.id)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <TableStateRow
                      colSpan={6}
                      state="empty"
                      message={!merchantId ? "Seleccione uma conta para consultar os logs." : isError ? "Não foi possível carregar os logs de entrega." : searchTerm ? "Nenhum log corresponde à pesquisa." : "Nenhum log de entrega encontrado."}
                    >
                      {isError && <Button type="button" variant="outline" className="mt-2 h-9 rounded-lg" onClick={() => { void deliveriesQuery.refetch() }}>Tentar novamente</Button>}
                    </TableStateRow>
                  )}
                </tbody>
              </table>
            )}
          </TableResults>

          {isFetching && !isLoading && <p className="mt-3 text-right text-xs text-[#8293AE]" role="status">A actualizar a lista…</p>}
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
