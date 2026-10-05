import { Button } from "@/components/ui/button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Webhook } from "@/types/webhook"
import { X } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  webhook: Webhook | null
}

function formatCollection(value: string[] | number | undefined) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—"
  return value ?? "—"
}

function formatDate(value: string) {
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

function DetailRow({ label, children, copyValue }: { label: string; children: ReactNode; copyValue?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="shrink-0 text-[#637590]">{label}</p>
      <div className="max-w-[65%] break-all text-right text-[#4B5563]">
        {copyValue !== undefined ? (
          <div className="flex items-center justify-end gap-1">
            <span className="font-semibold">{children}</span>
            <CopyTextButton value={copyValue} label={label.toLowerCase()} />
          </div>
        ) : children}
      </div>
    </div>
  )
}

export default function WebhookDetails({ isOpen, onClose, webhook }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
        <div className="ui-detail-sheet-header flex items-start justify-between gap-4 w-full">
          <SheetHeader className="p-0">
            <SheetTitle>Detalhes do webhook</SheetTitle>
            <SheetDescription>Consulte a configuração e o estado deste webhook.</SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar detalhes" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        {webhook && (
          <div className="ui-detail-sheet-body space-y-5">
            <div className="w-full">
              <p className="font-semibold text-[#143163]">Detalhes</p>
              <div className="my-2 h-px w-full bg-[#E3EAF4]" aria-hidden="true" />
              <div className="mt-4 text-sm text-[#143163]">
                <DetailRow label="Nome" copyValue={webhook.name}>{webhook.name || "—"}</DetailRow>
                <DetailRow label="URL" copyValue={webhook.url}>{webhook.url || "—"}</DetailRow>
                <DetailRow label="Eventos">{formatCollection(webhook.events)}</DetailRow>
                <DetailRow label="Canais">{formatCollection(webhook.channels)}</DetailRow>
                <DetailRow label="Estado">
                  <span className={`ui-status-tag ${webhook.active ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#F2F4F7] text-[#536176]"}`}>
                    {webhook.active ? "Activo" : "Inactivo"}
                  </span>
                </DetailRow>
                <DetailRow label="Verificação SSL">
                  <span className={`ui-status-tag ${webhook.verify_ssl ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#F2F4F7] text-[#536176]"}`}>
                    {webhook.verify_ssl ? "Activada" : "Desactivada"}
                  </span>
                </DetailRow>
                <DetailRow label="Criado em">{formatDate(webhook.created_at)}</DetailRow>
              </div>
            </div>
          </div>
        )}

        <div className="ui-detail-sheet-footer">
          <Button type="button" variant="brand" className="ui-detail-sheet-primary-action w-full" onClick={onClose}>
            Concluído
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
