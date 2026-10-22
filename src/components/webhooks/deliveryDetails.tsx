import { Button } from "@/components/ui/button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { WebhookDelivery, WebhookDeliveryLog } from "@/types/webhookDelivery"
import { Check, Clipboard, LoaderCircle, X } from "lucide-react"
import { useState, type ReactNode } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  delivery: WebhookDelivery | null
  logs: WebhookDeliveryLog[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function JsonBlock({ title, data }: { title: string; data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(data ?? {}, null, 2)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#143163]">{title}</h4>
        <Button type="button" variant="outline" className="h-8 rounded-lg px-2.5 text-xs" onClick={() => { void copy() }}>
          {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
          {copied ? "Copiado" : "Copiar JSON"}
        </Button>
      </div>
      <pre className="max-h-[260px] overflow-auto rounded-lg border border-[#E3EAF4] bg-[#F7F9FC] p-3 text-xs leading-5 text-[#27364B]"><code>{json}</code></pre>
    </section>
  )
}

function DetailRow({ label, children, copyValue }: { label: string; children: ReactNode; copyValue?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <p className="shrink-0 text-[#637590]">{label}:</p>
      <div className="max-w-[65%] break-all text-right font-medium text-[#4B5563]">
        {copyValue !== undefined ? (
          <div className="flex items-center justify-end gap-1"><span>{children}</span><CopyTextButton value={copyValue} label={label.toLowerCase()} /></div>
        ) : children}
      </div>
    </div>
  )
}

export default function WebhookDeliveryDetails({ isOpen, onClose, delivery, logs, isLoading, isError, onRetry }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full sm:max-w-3xl">
        <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
          <SheetHeader className="p-0">
            <SheetTitle>Detalhes da entrega</SheetTitle>
            <SheetDescription>Consulte os dados da entrega e as tentativas de request e response.</SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar detalhes" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]"><X className="size-4" aria-hidden="true" /></SheetClose>
        </div>

        <div className="ui-detail-sheet-body space-y-6">
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-[#637590]" role="status"><LoaderCircle className="size-5 animate-spin text-[#2678F2]" />A carregar detalhes da entrega…</div>
          ) : isError ? (
            <div className="rounded-xl border border-[#E3EAF4] bg-[#F8FAFC] p-6 text-center">
              <p className="text-sm text-[#637590]">Não foi possível carregar os detalhes desta entrega.</p>
              <Button type="button" variant="outline" className="mt-3 h-9 rounded-lg" onClick={onRetry}>Tentar novamente</Button>
            </div>
          ) : delivery ? (
            <>
              <section>
                <h3 className="font-semibold text-[#143163]">Resumo da entrega</h3>
                <div className="my-2 h-px w-full bg-[#E3EAF4]" />
                <div className="space-y-1 text-sm">
                  <DetailRow label="ID da entrega" copyValue={String(delivery.id)}>{delivery.id}</DetailRow>
                  <DetailRow label="Estado"><span className={`ui-status-tag ${delivery.status.toUpperCase() === "SUCCESS" ? "bg-[#DEF7EC] text-[#03543F]" : delivery.status.toUpperCase() === "FAILED" ? "bg-[#FDECEC] text-[#B42318]" : "bg-[#F2F4F7] text-[#536176]"}`}>{delivery.status}</span></DetailRow>
                  <DetailRow label="Evento">{delivery.hook || "—"}</DetailRow>
                  <DetailRow label="Serviço">{delivery.service || "—"}</DetailRow>
                  <DetailRow label="Nº do comerciante">{delivery.merchant_number || "—"}</DetailRow>
                  <DetailRow label="Data de ocorrência">{formatDate(delivery.occurred_at)}</DetailRow>
                  <DetailRow label="Tentativas">{delivery.retries}</DetailRow>
                  <DetailRow label="Reenvio"><span className={`ui-status-tag ${delivery.is_replay ? "bg-[#E8F0FF] text-[#2678F2]" : "bg-[#F2F4F7] text-[#536176]"}`}>{delivery.is_replay ? "Sim" : "Não"}</span></DetailRow>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-[#143163]">Tentativas de entrega</h3>
                  <span className="rounded-full bg-[#F1F5FA] px-2.5 py-1 text-xs font-semibold text-[#637590]">{logs.length}</span>
                </div>
                <div className="my-2 h-px w-full bg-[#E3EAF4]" />
                {logs.length ? (
                  <div className="space-y-4">
                    {logs.map((log, index) => (
                      <article key={`${log.delivery_id}-${log.created_at}-${index}`} className="space-y-4 rounded-xl border border-[#E3EAF4] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#637590]">
                            <span>Tentativa {index + 1}</span>
                            <span>Código HTTP: <strong className="text-[#143163]">{log.status_code || "—"}</strong></span>
                            <span>{formatDate(log.created_at)}</span>
                          </div>
                          <CopyTextButton value={log.delivery_id} label="ID da entrega" />
                        </div>
                        <JsonBlock title="Request" data={log.request ?? {}} />
                        <JsonBlock title="Response" data={log.response ?? {}} />
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg bg-[#F8FAFC] px-4 py-5 text-center text-sm text-[#637590]">Ainda não existem tentativas registadas para esta entrega.</p>
                )}
              </section>
            </>
          ) : (
            <p className="rounded-lg bg-[#F8FAFC] px-4 py-5 text-center text-sm text-[#637590]">Nenhum detalhe de entrega seleccionado.</p>
          )}
        </div>

        <SheetFooter className="ui-detail-sheet-footer">
          <Button type="button" variant="brand" className="ui-detail-sheet-primary-action w-full" onClick={onClose}>Concluído</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
