import { api } from "@/api"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import DetailsGestaoUsuario from "@/components/gestaoDeContas/details"
import EditUsuario from "@/components/gestaoDeContas/edit"
import ModalEliminarOtp from "@/components/otp/modalELiminar"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { generatePaginationRange } from "@/hooks/generatePaginationRange"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Eye, FileText, Pencil, Search } from "lucide-react"
import { TableActionButton } from "@/components/ui/table-action-button"
import { useMemo, useState } from "react"
import { useUserContext } from "@/pages/user_context_types"
import { formatDate, formatDateTime } from "@/components/utils/formmat"
import { statusAccount } from "@/components/utils/getColorStatusAccount"
import { Button } from "@/components/ui/button"
import { ReportHistoryPanel, userContextReportCategories } from "@/components/reports/report-history-panel"

type OtpRow = Record<string, unknown>

function getValue(row: OtpRow, key: string) {
  const value = row[key]
  return value === undefined || value === null ? "" : String(value)
}

function getDate(value: unknown) {
  if (typeof value !== "string" || !value) return "—"
  return formatDateTime(value, value)
}

function getValidationStatusLabel(value?: string) {
  if (!value?.trim()) return "Por validar"

  const status = value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[_-]+/g, " ")
  if (status.includes("pend")) return "Pendente"
  if (status.includes("nao valid") || status.includes("not valid") || status.includes("unvalid") || status === "invalid") return "Não validado"
  if (status.includes("rejeit") || status.includes("reject") || status.includes("denied")) return "Rejeitado"
  if (status.includes("valid") || status.includes("approv") || status.includes("accept")) return "Validado"

  return value
}

export function UserContextOtps() {
  const user = useUserContext()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [otpToDelete, setOtpToDelete] = useState<string>()
  const perPage = 100

  const otpQuery = useQuery<{ dados?: OtpRow[]; total?: number }>({
    queryKey: ["user-context-otps", user.id, user.phone_number, user.email, page],
    enabled: Boolean(user.id && (user.phone_number || user.email)),
    queryFn: async () => {
      const params = new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
        phone_number: user.phone_number || "",
        email: user.email || "",
      })
      const { data } = await api.get(`/front/otp_token?${params}`)
      return data
    },
    placeholderData: keepPreviousData,
  })

  const filteredRows = useMemo(() => {
    const rows = otpQuery.data?.dados || []
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) => [getValue(row, "otp"), getValue(row, "otp_type"), getValue(row, "phone_number"), getValue(row, "email")].some((value) => value.toLowerCase().includes(term)))
  }, [otpQuery.data?.dados, search])
  const totalPages = Math.max(1, Math.ceil((otpQuery.data?.total || 0) / perPage))
  const paginationRange = generatePaginationRange(totalPages, page)

  return (
    <div className="ui-context-page space-y-5">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">OTPs</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Histórico de OTPs relacionado com o contacto desta conta.</p>
      </div>

      <section className="ui-data-page rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex w-full justify-end">
            <div className="relative w-full max-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D8CA6]" aria-hidden="true" />
                  <input type="search" aria-label="Pesquisar OTPs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar OTP..." className="h-10 w-full rounded-lg border border-[#C9D8E9] bg-white pl-10 pr-3 text-sm text-[#143163] outline-none transition placeholder:text-[#8293AE] focus:border-[#48B9FF] focus:ring-4 focus:ring-[#48B9FF]/15" />
            </div>
          </div>

          {otpQuery.isError ? (
            <div className="rounded-lg border border-[#F0D99A] bg-[#FFF9E8] px-4 py-6 text-center text-sm text-[#765500]">Não foi possível carregar os OTPs desta conta.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E5EBF4]">
              <table className="ui-context-otp-table w-full min-w-[760px] border-collapse">
                <caption className="sr-only">Histórico de códigos OTP da conta seleccionada</caption>
                <thead className="h-14 bg-[#F5F6FA] text-left text-[#143163]">
                  <tr>
                    <th className="w-[14%] px-3 py-2 font-semibold">Tipo</th>
                    <th className="w-[25%] px-3 py-2 font-semibold">Contacto</th>
                    <th className="w-[15%] px-3 py-2 font-semibold">OTP</th>
                    <th className="ui-date-column w-[30%] text-center px-3 py-2 font-semibold">Data</th>
                    <th className="w-[16%] px-3 py-2 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {otpQuery.isPending ? (
                    <TableStateRow colSpan={5} state="loading" message="A carregar códigos OTP..." />
                  ) : filteredRows.length === 0 ? (
                    <TableStateRow colSpan={5} state="empty" message="Nenhum OTP encontrado para esta conta." />
                  ) : filteredRows.map((row, index) => (
                    <tr key={getValue(row, "id") || index}>
                      <td className="px-3 py-3">{getValue(row, "otp_type") || "—"}</td>
                      <td className={`px-3 py-3 font-semibold ${getValue(row, "phone_number") ? "ui-preserve-cell" : ""}`} title={getValue(row, "phone_number") || getValue(row, "email") || "—"}>{getValue(row, "phone_number") || getValue(row, "email") || "—"}</td>
                      <td className="px-3 py-3 font-mono font-semibold">{getValue(row, "otp") || "—"}</td>
                      <td className="ui-date-column text-center px-3 py-3">{getDate(row.created_at)}</td>
                      <td className="px-3 py-3">
                        <TableActionButton action="delete" aria-label="Eliminar OTP" onClick={() => setOtpToDelete(getValue(row, "id"))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <PaginationFooter
            currentPage={page}
            totalPages={totalPages}
            paginationRange={paginationRange}
            onPageChange={setPage}
            onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
          />
        </div>
      </section>

      <Dialog open={Boolean(otpToDelete)} onOpenChange={(open) => { if (!open) setOtpToDelete(undefined) }}>
        <DialogContent className="sm:max-w-md md:w-[400px] p-3">
          {otpToDelete && <ModalEliminarOtp id={otpToDelete} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function UserContextReports() {
  const user = useUserContext()
  const [activeCategory, setActiveCategory] = useState<string>(userContextReportCategories[0].id)
  const [page, setPage] = useState(1)

  return (
    <div className="ui-context-page space-y-5">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Relatórios</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Relatórios gerados no contexto de {user.business_name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "esta conta"}.</p>
      </div>

      <div>
        <ReportHistoryPanel
          activeCategory={activeCategory}
          onCategoryChange={(category) => { setActiveCategory(category); setPage(1) }}
          reports={[]}
          isLoading={false}
          currentPage={page}
          totalPages={1}
          paginationRange={[1]}
          onPageChange={setPage}
          onPreviousPage={() => setPage(1)}
          onNextPage={() => setPage(1)}
          categories={userContextReportCategories}
          emptyTitle="Histórico individual indisponível"
          emptyDescription="O serviço actual não permite associar os ficheiros de relatório a uma conta específica. A listagem geral não é apresentada neste contexto."
        />
      </div>
    </div>
  )
}

export function UserContextAccountManagement() {
  const user = useUserContext()
  const [editOpen, setEditOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isIndividualAccount = user.account_type !== "Merchant" && !user.business_name

  const displayName = user.business_name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "Utilizador"
  const location = [user.user_document?.address, user.user_document?.city, user.user_document?.province].filter(Boolean).join(" · ") || "—"
  const nationality = user.user_document?.nacionalidade || user.user_document?.country || "—"
  const accountDetails = isIndividualAccount
    ? [
        { label: "Utilizador", value: displayName },
        { label: "Contacto", value: user.phone_number || "—" },
        { label: "Documento de identificação", value: user.bi_number || user.nif || "—" },
        { label: "Data de nascimento", value: formatDate(user.user_document?.birthday) },
        { label: "Nacionalidade", value: nationality },
        { label: "Morada", value: location },
      ]
    : [
        { label: "Empresa", value: displayName },
        { label: "NIF", value: user.nif || "—" },
        { label: "Email", value: user.email || "—" },
        { label: "Contacto", value: user.phone_number || "—" },
        { label: "Endereço da sede", value: location },
      ]
  const validationStatusLabel = getValidationStatusLabel(user.status_validate)
  const validationStatusClass = statusAccount(user.status_validate) ?? "bg-[#F2F4F7] text-[#667085]"

  return (
    <div className="ui-context-page space-y-5">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Gestão da Conta</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Dados, documentos e acções disponíveis para {displayName}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#D7E2F2] bg-white p-5 shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
            <div>
              <h3 className="text-base font-semibold text-[#143163]">Dados da conta</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Edite os dados através do mesmo fluxo da gestão de utilizadores.</p>
            </div>
            <Pencil className="mt-0.5 h-5 w-5 shrink-0 text-[#143163]" aria-hidden="true" />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {accountDetails.map(({ label, value }) => (
              <div key={label} className="min-w-0 border-b border-[#EEF2F7] pb-3">
                <dt className="text-xs font-medium text-[#667085]">{label}</dt>
                <dd className="mt-1 break-words font-medium text-[#143163]">{value}</dd>
              </div>
            ))}
          </dl>
          <Button type="button" variant="brand" className="mt-3 h-10 rounded-lg" onClick={() => setEditOpen(true)}><Pencil aria-hidden="true" /> Editar dados</Button>
        </section>

        <section className="rounded-xl border border-[#D7E2F2] bg-white p-5 shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
            <div>
              <h3 className="text-base font-semibold text-[#143163]">Documentos e validação</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Consulte os documentos submetidos e as acções de validação.</p>
            </div>
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#143163]" aria-hidden="true" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm" role="status">
            <span className="text-[#667085]">Estado da conta:</span>
            <span className={`ui-status-tag inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${validationStatusClass}`}>{validationStatusLabel}</span>
          </div>
          <Button type="button" variant="brand" className="mt-4 h-10 rounded-lg" onClick={() => setDetailsOpen(true)}><Eye aria-hidden="true" /> Ver documentos e detalhes</Button>
        </section>
      </div>

      <EditUsuario isOpen={editOpen} onClose={() => setEditOpen(false)} typeAccount={isIndividualAccount} selectedItem={user} />
      <DetailsGestaoUsuario isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} itemSelected={user} />
    </div>
  )
}
