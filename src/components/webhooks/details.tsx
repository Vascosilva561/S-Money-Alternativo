import { Button } from "@/components/ui/button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Webhook } from "@/types/webhook"
import { X } from "lucide-react"
import type { ReactNode } from "react"

type Props = { isOpen: boolean; onClose: () => void; webhook: Webhook | null }

function formatDate(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function DetailRow({ label, children, copyValue }: { label: string; children: ReactNode; copyValue?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <p className="shrink-0 text-[#637590]">{label}:</p>
      <div className="max-w-[65%] break-all text-right text-[#4B5563]">
        {copyValue !== undefined ? (
          <div className="flex items-center justify-end gap-1"><span className="font-semibold">{children}</span><CopyTextButton value={copyValue} label={label.toLowerCase()} /></div>
        ) : children}
      </div>
    </div>
  )
}

function BooleanBadge({ value }: { value: boolean }) {
  return <span className={`ui-status-tag ${value ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#F2F4F7] text-[#536176]"}`}>{value ? "Sim" : "Não"}</span>
}

export default function WebhookDetails({ isOpen, onClose, webhook }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
        <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
          <SheetHeader className="p-0">
            <SheetTitle>Detalhes do webhook</SheetTitle>
            <SheetDescription>Consulte a configuração e o estado deste webhook.</SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar detalhes" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]"><X className="size-4" aria-hidden="true" /></SheetClose>
        </div>

        {webhook && (
          <div className="ui-detail-sheet-body space-y-6">
            <section>
              <h3 className="font-semibold text-[#143163]">Dados básicos</h3>
              <div className="my-2 h-px w-full bg-[#E3EAF4]" />
              <div className="space-y-1 text-sm">
                <DetailRow label="ID" copyValue={String(webhook.id)}>{webhook.id}</DetailRow>
                <DetailRow label="Nome" copyValue={webhook.name}>{webhook.name || "—"}</DetailRow>
                <DetailRow label="ID do cliente">{webhook.client_id || "—"}</DetailRow>
                <DetailRow label="Tipo de serviço">{webhook.service_type === "gpo" ? "Pagamentos GPO" : "Pagamentos por referência"}</DetailRow>
                <DetailRow label="Nº do comerciante">{webhook.merchant_number || "—"}</DetailRow>
                <DetailRow label="Finalidade">{webhook.subscriber_type === "internal_payments" ? "Pagamentos Sómoney" : "Serviços externos"}</DetailRow>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-[#143163]">Configuração do webhook</h3>
              <div className="my-2 h-px w-full bg-[#E3EAF4]" />
              <div className="space-y-1 text-sm">
                <DetailRow label="URL de destino" copyValue={webhook.url}>{webhook.url || "—"}</DetailRow>
                <DetailRow label="Prefixo do token">{webhook.token_prefix || "—"}</DetailRow>
                <DetailRow label="Autenticação dinâmica por transacção"><BooleanBadge value={Boolean(webhook.dynamic_auth_per_tx)} /></DetailRow>
                <DetailRow label="Digest de autenticação">{webhook.dynamic_auth_digest ? "Configurado" : "Não configurado"}</DetailRow>
                <DetailRow label="Verificação SSL"><BooleanBadge value={Boolean(webhook.check_ssl)} /></DetailRow>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-[#143163]">Eventos subscritos</h3>
              <div className="my-2 h-px w-full bg-[#E3EAF4]" />
              {webhook.events?.length ? (
                <div className="flex flex-wrap gap-2">{webhook.events.map((event) => <span key={event} className="rounded-md bg-[#E8F0FF] px-2.5 py-1.5 text-xs font-medium text-[#2678F2]">{event}</span>)}</div>
              ) : <p className="text-sm text-[#637590]">Nenhum evento subscrito.</p>}
            </section>

            <section>
              <h3 className="font-semibold text-[#143163]">Estado e datas</h3>
              <div className="my-2 h-px w-full bg-[#E3EAF4]" />
              <div className="space-y-1 text-sm">
                <DetailRow label="Estado"><span className={`ui-status-tag ${webhook.is_active ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#FDECEC] text-[#B42318]"}`}>{webhook.is_active ? "Activo" : "Inactivo"}</span></DetailRow>
                <DetailRow label="Criado em">{formatDate(webhook.created_at)}</DetailRow>
                <DetailRow label="Última actualização">{formatDate(webhook.updated_at)}</DetailRow>
              </div>
            </section>
          </div>
        )}

        <SheetFooter className="ui-detail-sheet-footer">
          <Button type="button" variant="brand" className="ui-detail-sheet-primary-action w-full" onClick={onClose}>Concluído</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
