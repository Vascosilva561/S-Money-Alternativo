import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { NativeSelectField, TextAreaField, TextField } from "@/components/ui/form-field"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSelectedAccount } from "@/context/selectedAccountCntext"
import type { Webhook, WebhookServiceType, WebhookSubscriberType } from "@/types/webhook"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { Link2, X } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onClose: () => void
  webhook: Webhook | null
  createMode?: boolean
  merchantId?: string | number
}

type WebhookFormData = {
  service_type: WebhookServiceType
  subscriber_type: WebhookSubscriberType
  name: string
  url: string
  token_prefix: string
  dynamic_auth_per_tx: boolean
  dynamic_auth_algorithm: string
  dynamic_auth_secret_word: string
  is_active: boolean
  check_ssl: boolean
  auth_token: string
}

type EventOption = { key: string; label: string }

const eventsByService: Record<WebhookServiceType, EventOption[]> = {
  gpo: [
    { key: "gpo-payment.refunded", label: "Transação reembolsada" },
    { key: "gpo-payment.accepted", label: "Transação aceite" },
    { key: "gpo-payment.rejected", label: "Transação rejeitada" },
  ],
  sector: [
    { key: "sector-payment.files", label: "Ficheiro de pagamentos recebido" },
    { key: "sector-payment.realtime", label: "Pagamento em tempo real" },
    { key: "sector-payment.reconciliated", label: "Pagamento confirmado por ficheiro" },
  ],
}

const defaultForm: WebhookFormData = {
  service_type: "sector",
  subscriber_type: "external_payments",
  name: "",
  url: "",
  token_prefix: "bearer",
  dynamic_auth_per_tx: false,
  dynamic_auth_algorithm: "sha256",
  dynamic_auth_secret_word: "",
  is_active: true,
  check_ssl: true,
  auth_token: "",
}

function formFromWebhook(webhook: Webhook | null): WebhookFormData {
  if (!webhook) return defaultForm
  return {
    ...defaultForm,
    service_type: webhook.service_type,
    subscriber_type: webhook.subscriber_type,
    name: webhook.name ?? "",
    url: webhook.url ?? "",
    token_prefix: webhook.token_prefix || "bearer",
    dynamic_auth_per_tx: Boolean(webhook.dynamic_auth_per_tx),
    is_active: Boolean(webhook.is_active),
    check_ssl: Boolean(webhook.check_ssl),
  }
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled: boolean
}) {
  return (
    <div className="rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4 shadow-[0_1px_2px_rgba(20,49,99,0.04)]">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
          <Link2 className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#143163]">{label}</p>
          <p className="mt-1 text-sm leading-5 text-[#667085]">{description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label} ${checked ? "activo" : "inactivo"}`}
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${checked ? "bg-[#22C55E]" : "bg-[#D1D5DB]"}`}
        >
          <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </button>
      </div>
    </div>
  )
}

export default function WebhookEdit({ isOpen, onClose, webhook, createMode = false, merchantId: contextMerchantId }: Props) {
  const [formData, setFormData] = useState<WebhookFormData>(defaultForm)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { account } = useSelectedAccount()
  const merchantId = contextMerchantId ?? account?.id

  useEffect(() => {
    if (!isOpen) return
    const initial = formFromWebhook(createMode ? null : webhook)
    setFormData(initial)
    setSelectedEvents(createMode ? [] : webhook?.events ?? [])
  }, [createMode, isOpen, webhook])

  const close = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!merchantId) {
      toast.error("Seleccione uma conta comerciante para configurar o webhook.")
      return
    }

    if (!createMode && !webhook) {
      toast.error("Nenhum webhook seleccionado.")
      return
    }
    if (!selectedEvents.length) {
      toast.error("Seleccione pelo menos um evento.")
      return
    }
    if (formData.dynamic_auth_per_tx && !formData.dynamic_auth_secret_word.trim() && (createMode || !webhook?.dynamic_auth_per_tx)) {
      toast.error("Informe a chave secreta de autenticação dinâmica.")
      return
    }

    const payload = {
      ...(createMode ? {} : { id: webhook!.id }),
      service_type: formData.service_type,
      subscriber_type: formData.subscriber_type,
      name: formData.name.trim(),
      url: formData.url.trim(),
      events: selectedEvents,
      token_prefix: formData.token_prefix.trim() || "bearer",
      dynamic_auth_per_tx: formData.dynamic_auth_per_tx,
      dynamic_auth_algorithm: formData.dynamic_auth_per_tx ? formData.dynamic_auth_algorithm : null,
      ...(formData.dynamic_auth_per_tx
        ? (formData.dynamic_auth_secret_word.trim() ? { dynamic_auth_secret_word: formData.dynamic_auth_secret_word.trim() } : {})
        : { dynamic_auth_secret_word: null }),
      is_active: formData.is_active,
      check_ssl: formData.check_ssl,
      ...(formData.auth_token.trim() ? { token_access: formData.auth_token.trim() } : {}),
    }

    try {
      setLoading(true)
      const path = `/front/merchants/${merchantId}/webhooks/${createMode ? "create" : "update"}`
      if (createMode) {
        await api.post(path, { ...payload, token_access: formData.auth_token.trim() })
      } else {
        await api.put(path, payload)
      }
      await queryClient.invalidateQueries({ queryKey: ["ListaDeWebhooks"] })
      toast.success(createMode ? "Webhook criado com sucesso." : "Webhook actualizado com sucesso.")
      onClose()
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.error ?? error.response?.data?.message : undefined
      toast.error(typeof message === "string" ? message : `Não foi possível ${createMode ? "criar" : "actualizar"} o webhook.`)
    } finally {
      setLoading(false)
    }
  }

  const setField = <K extends keyof WebhookFormData>(field: K, value: WebhookFormData[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const handleServiceChange = (service: WebhookServiceType) => {
    setField("service_type", service)
    setSelectedEvents([])
  }

  const toggleEvent = (eventKey: string, checked: boolean) => {
    setSelectedEvents((previous) => checked
      ? (previous.includes(eventKey) ? previous : [...previous, eventKey])
      : previous.filter((value) => value !== eventKey))
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) close() }}>
      <SheetContent className="ui-edit-sheet ui-webhook-edit-sheet w-full gap-0 overflow-y-auto sm:max-w-[560px]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <SheetHeader className="p-0">
            <SheetTitle>{createMode ? "Novo webhook" : "Editar webhook"}</SheetTitle>
            <SheetDescription>Configure o destino, os eventos e a autenticação deste webhook.</SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar formulário" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        <form onSubmit={handleSubmit} className="flex shrink-0 flex-col">
          <div className="ui-webhook-edit-body flex flex-col gap-5 py-5">
            <TextField
              label="Nome"
              required
              value={formData.name}
              onChange={(event) => setField("name", event.target.value)}
              disabled={loading}
              placeholder="Ex.: Webhook de pagamentos"
            />
            <TextField
              label="URL do webhook"
              type="url"
              required
              value={formData.url}
              onChange={(event) => setField("url", event.target.value)}
              disabled={loading}
              placeholder="https://exemplo.com/webhook"
              pattern="https://.*"
              hint="Utilize um endereço HTTPS acessível pelo serviço."
            />
            <NativeSelectField
              label="Finalidade"
              required
              value={formData.subscriber_type}
              onChange={(event) => setField("subscriber_type", event.target.value as WebhookSubscriberType)}
              disabled={loading}
            >
              <option value="internal_payments">Pagamentos Sómoney</option>
              <option value="external_payments">Serviços externos</option>
            </NativeSelectField>
            <NativeSelectField
              label="Tipo de serviço"
              required
              value={formData.service_type}
              onChange={(event) => handleServiceChange(event.target.value as WebhookServiceType)}
              disabled={loading}
            >
              <option value="sector">Pagamentos por referência (Sector)</option>
              <option value="gpo">Pagamentos GPO</option>
            </NativeSelectField>
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#143163]">Eventos</h3>
                <span className="text-xs text-[#8998B1]">{selectedEvents.length} seleccionado(s)</span>
              </div>
              <div className="divide-y divide-[#E9EDF3] overflow-hidden rounded-lg border border-[#DCE4EF]">
                {eventsByService[formData.service_type].map((eventOption) => (
                  <label key={eventOption.key} className="flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-[#F5F8FC]">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-[#143163]"
                      checked={selectedEvents.includes(eventOption.key)}
                      onChange={(event) => toggleEvent(eventOption.key, event.target.checked)}
                      disabled={loading}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[#143163]">{eventOption.label}</span>
                      <span className="mt-0.5 block break-all text-xs text-[#8998B1]">{eventOption.key}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
            <NativeSelectField
              label="Prefixo de autenticação"
              required
              value={formData.token_prefix}
              onChange={(event) => setField("token_prefix", event.target.value)}
              disabled={loading}
            >
              <option value="bearer">Bearer</option>
              <option value="token">Token</option>
            </NativeSelectField>
            <TextAreaField
              label="Token de autenticação"
              autoComplete="off"
              rows={5}
              className="min-h-[120px] resize-y"
              value={formData.auth_token}
              onChange={(event) => setField("auth_token", event.target.value)}
              disabled={loading}
              placeholder={createMode ? "Introduza o token de autenticação..." : "Deixe em branco para manter"}
              hint={createMode
                ? "Introduza o token que será utilizado na autenticação do webhook."
                : "Deixe vazio para não enviar um novo token."}
            />
            <ToggleCard
              label="Webhook activo"
              description="Permite o envio de notificações."
              checked={formData.is_active}
              onChange={(checked) => setField("is_active", checked)}
              disabled={loading}
            />
            <ToggleCard
              label="Verificação SSL"
              description="Valida o certificado SSL do endereço."
              checked={formData.check_ssl}
              onChange={(checked) => setField("check_ssl", checked)}
              disabled={loading}
            />
            <ToggleCard
              label="Autenticação dinâmica por transação"
              description="Gera uma autenticação diferente para cada transação."
              checked={formData.dynamic_auth_per_tx}
              onChange={(checked) => setField("dynamic_auth_per_tx", checked)}
              disabled={loading}
            />

            {formData.dynamic_auth_per_tx && (
              <>
                <TextField
                  label="Algoritmo de autenticação"
                  required
                  value={formData.dynamic_auth_algorithm}
                  onChange={(event) => setField("dynamic_auth_algorithm", event.target.value)}
                  disabled={loading}
                  placeholder="sha256"
                />
                <TextField
                  label="Chave secreta"
                  type="password"
                  autoComplete="new-password"
                  required={createMode || !webhook?.dynamic_auth_per_tx}
                  value={formData.dynamic_auth_secret_word}
                  onChange={(event) => setField("dynamic_auth_secret_word", event.target.value)}
                  disabled={loading}
                  placeholder={webhook?.dynamic_auth_per_tx ? "Deixe em branco para manter" : "Introduza a chave"}
                />
              </>
            )}
          </div>

          <SheetFooter className="ui-edit-sheet-footer--horizontal mt-auto flex-row justify-end gap-3 border-t border-[#E5EBF4] p-0 pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11 flex-1 rounded-lg" disabled={loading}>Cancelar</Button>
            </SheetClose>
            <Button type="submit" variant="brand" className="h-11 flex-1 rounded-lg font-semibold" disabled={loading}>
              {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : createMode ? "Criar webhook" : "Guardar alterações"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
