import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { NativeSelectField, TextField } from "@/components/ui/form-field"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Webhook } from "@/types/webhook"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onClose: () => void
  webhook: Webhook | null
  previewOnly?: boolean
}

type WebhookFormData = {
  name: string
  url: string
  events: string
  channels: string
  active: boolean
  verifySsl: boolean
}

const emptyForm: WebhookFormData = {
  name: "",
  url: "",
  events: "",
  channels: "",
  active: true,
  verifySsl: true,
}

function formatCollection(value: string[] | number | undefined) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "")
}

function parseCollection(value: string, original: string[] | number | undefined) {
  if (Array.isArray(original)) {
    return value.split(",").map((item) => item.trim()).filter(Boolean)
  }
  if (typeof original === "number") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : original
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

export default function WebhookEdit({ isOpen, onClose, webhook, previewOnly = false }: Props) {
  const [formData, setFormData] = useState<WebhookFormData>(emptyForm)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isOpen || !webhook) {
      setFormData(emptyForm)
      return
    }

    setFormData({
      name: webhook.name ?? "",
      url: webhook.url ?? "",
      events: formatCollection(webhook.events),
      channels: formatCollection(webhook.channels),
      active: Boolean(webhook.active),
      verifySsl: Boolean(webhook.verify_ssl),
    })
  }, [isOpen, webhook])

  const updateWebhook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (previewOnly) {
      toast.info("Pré-visualização: nenhuma alteração foi gravada.")
      return
    }
    if (webhook?.id === undefined || webhook?.id === null || webhook.id === "") {
      toast.error("Não foi possível identificar o webhook seleccionado.")
      return
    }

    try {
      setLoading(true)
      await api.put(`/api/v1/portal/webhooks/${encodeURIComponent(String(webhook.id))}`, {
        name: formData.name.trim(),
        url: formData.url.trim(),
        events: parseCollection(formData.events, webhook.events),
        channels: parseCollection(formData.channels, webhook.channels),
        active: formData.active,
        verify_ssl: formData.verifySsl,
      })
      await queryClient.invalidateQueries({ queryKey: ["ListaDeWebhooks"] })
      onClose()
      toast.success("Webhook actualizado com sucesso.")
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message
        : undefined
      toast.error(message || "Não foi possível actualizar o webhook.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="ui-edit-sheet w-full overflow-hidden sm:max-w-[440px]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <SheetHeader className="p-0">
            <SheetTitle>Editar webhook</SheetTitle>
            <SheetDescription>Actualize os dados e as opções de entrega deste webhook.</SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar edição" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        <form onSubmit={updateWebhook} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5">
            {previewOnly && (
              <p className="rounded-lg border border-[#D7E2F2] bg-[#F5F7FB] px-3 py-2 text-sm text-[#536176]" role="status">
                Pré-visualização com dados de exemplo. As alterações não serão gravadas.
              </p>
            )}
            <TextField
              label="Nome"
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              disabled={loading || !webhook}
            />
            <TextField
              label="URL de destino"
              type="url"
              required
              value={formData.url}
              onChange={(event) => setFormData({ ...formData, url: event.target.value })}
              disabled={loading || !webhook}
            />
            <TextField
              label="Eventos (separados por vírgulas)"
              value={formData.events}
              onChange={(event) => setFormData({ ...formData, events: event.target.value })}
              disabled={loading || !webhook}
              hint={Array.isArray(webhook?.events) ? "Separe cada evento por vírgula." : "O valor recebido é uma quantidade e será mantido como número."}
            />
            <TextField
              label="Canais (separados por vírgulas)"
              value={formData.channels}
              onChange={(event) => setFormData({ ...formData, channels: event.target.value })}
              disabled={loading || !webhook}
              hint={Array.isArray(webhook?.channels) ? "Separe cada canal por vírgula." : "O valor recebido é uma quantidade e será mantido como número."}
            />
            <NativeSelectField
              label="Estado do webhook"
              value={formData.active ? "active" : "inactive"}
              onChange={(event) => setFormData({ ...formData, active: event.target.value === "active" })}
              disabled={loading || !webhook}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </NativeSelectField>
            <NativeSelectField
              label="Verificação SSL"
              value={formData.verifySsl ? "enabled" : "disabled"}
              onChange={(event) => setFormData({ ...formData, verifySsl: event.target.value === "enabled" })}
              disabled={loading || !webhook}
            >
              <option value="enabled">Activada</option>
              <option value="disabled">Desactivada</option>
            </NativeSelectField>
          </div>

          <SheetFooter className="ui-edit-sheet-footer--horizontal mt-auto flex-row justify-end gap-3 border-t border-[#E5EBF4] p-0 pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11 flex-1 rounded-lg" disabled={loading}>Cancelar</Button>
            </SheetClose>
            <Button type="submit" variant="brand" className="h-11 flex-1 rounded-lg font-semibold" disabled={loading || !webhook}>
              {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Guardar alterações"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
