import { useMemo, useState, type ReactNode } from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Search, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/api"
import { DetailsUser } from "@/hooks/getDetails"
import { generatePaginationRange } from "@/hooks/generatePaginationRange"
import { normalizeRole } from "@/components/utils/normalizeRole"
import { ROLE_PERMISSIONS } from "@/components/permissions-profile/permissions"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/form-field"
import { RefreshButton } from "@/components/ui/refresh-button"
import { TableResults } from "@/components/ui/table-results"
import { TableStateRow } from "@/components/ui/table-state-row"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { TableActionButton } from "@/components/ui/table-action-button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getIbanActionPath, getIbanListPath, IBAN_PAGE_SIZE } from "@/lib/iban-contract"
import type { Role } from "@/components/permissions-profile/profiles"
import type { IbanPending, IbanPendingResponse } from "@/types/ibansPending"

type IbanStatusFilter = "pending" | "approved"
type IbanStatusKind = IbanStatusFilter | "rejected" | "other"
type Props = { accountId?: string; statusFilter?: IbanStatusFilter }
type Action = { item: IbanPending; type: "validate" | "reject" }

const pendingStatuses = new Set(["PENDING", "PENDENTE", "POR VALIDAR", "SUBMITTED"])
const approvedStatuses = new Set(["APPROVED", "APROVADO", "APROVADA", "VALIDATED", "VALIDADO", "VALIDADA", "VALID", "ACCEPTED", "ACTIVE", "ACTIVO", "ATIVO"])
const rejectedStatuses = new Set(["REJECTED", "REJEITADO", "REJEITADA", "DENIED", "RECUSADO", "RECUSADA", "INVALID"])

function normaliseIbanStatus(status: string) {
  return status.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[_-]+/g, " ")
}

function getIbanStatusKind(status: string): IbanStatusKind {
  const normalized = normaliseIbanStatus(status)
  if (pendingStatuses.has(normalized)) return "pending"
  if (approvedStatuses.has(normalized)) return "approved"
  if (rejectedStatuses.has(normalized)) return "rejected"
  return "other"
}

function getIbanStatusLabel(status: string) {
  const kind = getIbanStatusKind(status)
  if (kind === "pending") return "Pendente"
  if (kind === "approved") return "Aprovado"
  if (kind === "rejected") return "Recusado"
  return status || "—"
}

function getIbanStatusClasses(status: string) {
  const kind = getIbanStatusKind(status)
  if (kind === "pending") return "bg-[#FFF4D6] text-[#8A5B00]"
  if (kind === "approved") return "bg-[#DEF7EC] text-[#027A48]"
  if (kind === "rejected") return "bg-[#FDECEC] text-[#B42318]"
  return "bg-[#F2F4F7] text-[#536176]"
}

function IbanDetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] py-3 last:border-b-0">
      <dt className="text-sm text-[#667085]">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-[#143163]">{children}</dd>
    </div>
  )
}

// Remount on account or status changes so a selection/confirmation never crosses scopes.
export default function BankIbans(props: Props) {
  return <IbanList key={`${props.accountId ?? "pending"}:${props.statusFilter ?? "all"}`} {...props} />
}

function IbanList({ accountId, statusFilter }: Props) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [action, setAction] = useState<Action | null>(null)
  const [selectedDetails, setSelectedDetails] = useState<IbanPending | null>(null)
  const { details } = DetailsUser()
  const role = normalizeRole(details?.account_type) as Role | null
  const canManage = Boolean(role && ROLE_PERMISSIONS[role]?.bancos === "manage")
  const canRead = Boolean(role && ROLE_PERMISSIONS[role]?.bancos && ROLE_PERMISSIONS[role]?.bancos !== "none")
  const queryClient = useQueryClient()
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["ibans", accountId ?? "pending", page],
    queryFn: async () => (await api.get<IbanPendingResponse>(getIbanListPath(accountId, page))).data,
    enabled: canRead && (accountId === undefined || Boolean(accountId.trim())),
    placeholderData: keepPreviousData,
  })
  const rows = useMemo(() => (data?.dados ?? []).filter((item) => {
    if (!statusFilter) return true
    return getIbanStatusKind(item.status) === statusFilter
  }), [data?.dados, statusFilter])
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-AO")
    return rows.filter((item) => [item.iban, item.bank_name, item.acronym_bank, item.cardholder,
      item.phone_number, item.first_name, item.last_name, item.status]
      .some((value) => String(value ?? "").toLocaleLowerCase("pt-AO").includes(term)))
  }, [rows, search])
  const totalPages = data?.total !== undefined
    ? Math.max(1, Math.ceil(Number(data.total) / IBAN_PAGE_SIZE))
    : page + (rows.length === IBAN_PAGE_SIZE ? 1 : 0)
  const previous = () => { if (!isFetching) setPage((current) => Math.max(1, current - 1)) }
  const next = () => { if (!isFetching) setPage((current) => Math.min(totalPages, current + 1)) }
  const mutation = useMutation({
    mutationFn: async (selection: Action) => {
      if (!canManage || selection.item.status !== "PENDING") throw new Error("Operação indisponível.")
      await api.patch(getIbanActionPath(String(selection.item.id), selection.type))
    },
    onSuccess: async (_, selection) => {
      setAction(null)
      await queryClient.invalidateQueries({ queryKey: ["ibans"] })
      toast.success(selection.type === "validate" ? "IBAN validado com sucesso." : "IBAN recusado com sucesso.")
    },
    onError: () => toast.error("Não foi possível actualizar o IBAN. Tente novamente."),
  })

  if (!canRead) return null

  return (
    <section className="ui-data-page ui-data-stack space-y-4 rounded-xl border border-[#D7E2F2] bg-white p-5 text-[#143163]">
      <div>
        <h3 className="text-base font-semibold">{statusFilter === "pending" || accountId === undefined ? "IBANs por validar" : "IBANs da conta"}</h3>
        <p className="mt-1 text-sm text-[#667085]">{statusFilter === "approved" ? "IBANs aprovados associados a esta conta." : "Consulte os dados bancários e valide os pedidos pendentes."}</p>
      </div>
      <div className="ui-toolbar flex flex-wrap items-center justify-between gap-3">
        <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
        <TextField aria-label="Pesquisar IBANs" placeholder="Pesquisar IBAN, titular ou banco" value={search}
          onChange={(event) => setSearch(event.target.value)} startAdornment={<Search className="size-4" />} />
      </div>
      <TableResults label="IBANs encontrados" visibleCount={filtered.length} totalCount={statusFilter ? undefined : data?.total}
        currentPage={page} totalPages={totalPages} onPreviousPage={previous} onNextPage={next} isLoading={isLoading || isFetching}>
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F5F6FA] text-left"><tr>
            {["Titular", "IBAN", "Banco", "Contacto", "Estado", "Acções"].map((label) => <th key={label} className="px-4 py-4 font-semibold">{label}</th>)}
          </tr></thead>
          <tbody>
            {isLoading ? <TableStateRow colSpan={6} state="loading" message="A carregar IBANs..." />
              : isError ? <TableStateRow colSpan={6} state="empty" message="Não foi possível carregar os IBANs. Tente actualizar a lista." />
              : !filtered.length ? <TableStateRow colSpan={6} state="empty" message={statusFilter === "pending" ? "Nenhum IBAN pendente encontrado para esta conta." : statusFilter === "approved" ? "Nenhum IBAN aprovado encontrado para esta conta." : "Nenhum IBAN encontrado."} />
              : filtered.map((item) => <tr key={item.id} className="border-t border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC]">
                <td className="ui-name-column px-4 py-3">{item.cardholder || [item.first_name, item.last_name].filter(Boolean).join(" ") || "—"}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-2 whitespace-nowrap">{item.iban}<CopyTextButton value={item.iban} label="IBAN" /></span></td>
                <td className="ui-name-column px-4 py-3">{item.bank_name || item.acronym_bank || "—"}</td>
                <td className="px-4 py-3">{item.phone_number || "—"}</td>
                <td className="px-4 py-3"><span className={`ui-status-tag ${getIbanStatusClasses(item.status)}`}>{getIbanStatusLabel(item.status)}</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2">
                  {canManage && item.status === "PENDING" && <>
                    <TableActionButton action="validate" tooltip="Validar IBAN" disabled={isFetching || mutation.isPending} onClick={() => setAction({ item, type: "validate" })} />
                    <TableActionButton action="reject" tooltip="Recusar IBAN" disabled={isFetching || mutation.isPending} onClick={() => setAction({ item, type: "reject" })} />
                  </>}
                  <TableActionButton action="view" tooltip="Ver detalhes do IBAN" aria-label={`Ver detalhes do IBAN ${item.iban}`} onClick={() => setSelectedDetails(item)} />
                </div></td>
              </tr>)}
          </tbody>
        </table>
      </TableResults>
      <PaginationFooter currentPage={page} totalPages={totalPages} paginationRange={generatePaginationRange(totalPages, page)}
        onPageChange={(target) => { if (!isFetching) setPage(target) }} onPreviousPage={previous} onNextPage={next} />
      <Sheet open={Boolean(selectedDetails)} onOpenChange={(open) => { if (!open) setSelectedDetails(null) }}>
        <SheetContent className="ui-detail-sheet w-full overflow-y-auto sm:max-w-lg">
          <div className="ui-detail-sheet-header flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
            <div>
              <SheetHeader className="p-0"><SheetTitle className="text-lg font-semibold text-[#143163]">Detalhes do IBAN</SheetTitle></SheetHeader>
              <p className="mt-1 text-sm text-[#667085]">Dados bancários submetidos por este utilizador.</p>
            </div>
            <SheetClose asChild>
              <button type="button" aria-label="Fechar detalhes do IBAN"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition-colors hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                <X className="size-4" aria-hidden="true" />
              </button>
            </SheetClose>
          </div>
          {selectedDetails && <>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E8F0FF] text-sm font-bold text-[#143163]">
                {selectedDetails.acronym_bank || "IB"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#143163]">{selectedDetails.bank_name || "Banco não indicado"}</p>
                <p className="text-sm text-[#667085]">{selectedDetails.acronym_bank || "—"}</p>
              </div>
              <span className={`ui-status-tag ${getIbanStatusClasses(selectedDetails.status)}`}>{getIbanStatusLabel(selectedDetails.status)}</span>
            </div>
            <dl className="mt-4 divide-y divide-[#EEF2F7] rounded-xl border border-[#E5EBF4] px-4">
              <IbanDetailRow label="ID do pedido">{selectedDetails.id || "—"}</IbanDetailRow>
              <IbanDetailRow label="IBAN"><span className="inline-flex max-w-full items-center justify-end gap-1 break-all">
                {selectedDetails.iban || "—"}{selectedDetails.iban && <CopyTextButton value={selectedDetails.iban} label="IBAN" />}
              </span></IbanDetailRow>
              <IbanDetailRow label="Titular">{selectedDetails.cardholder || [selectedDetails.first_name, selectedDetails.last_name].filter(Boolean).join(" ") || "—"}</IbanDetailRow>
              <IbanDetailRow label="Banco">{selectedDetails.bank_name || "—"}</IbanDetailRow>
              <IbanDetailRow label="Sigla">{selectedDetails.acronym_bank || "—"}</IbanDetailRow>
              <IbanDetailRow label="Contacto">{selectedDetails.phone_number || "—"}</IbanDetailRow>
            </dl>
            <SheetFooter>
              <Button type="button" variant="brand" className="h-11 rounded-lg font-semibold" onClick={() => setSelectedDetails(null)}>Fechar</Button>
            </SheetFooter>
          </>}
        </SheetContent>
      </Sheet>
      <Dialog open={Boolean(action)} onOpenChange={(open) => { if (!open && !mutation.isPending) setAction(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{action?.type === "validate" ? "Validar IBAN" : "Recusar IBAN"}</DialogTitle>
            <DialogDescription>Confirme a decisão para o IBAN {action?.item.iban}, de {action?.item.cardholder || [action?.item.first_name, action?.item.last_name].filter(Boolean).join(" ")}.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setAction(null)}>Cancelar</Button>
            <Button type="button" variant="brand" disabled={mutation.isPending || isFetching || isError || !canManage}
              onClick={() => { if (action) mutation.mutate(action) }}>{mutation.isPending ? "A guardar..." : "Confirmar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
