import { api } from "@/api"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import type { Webhook } from "@/types/webhook"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  webhook: Webhook | null
  previewOnly?: boolean
}

export default function DeleteWebhook({ isOpen, onOpenChange, webhook, previewOnly = false }: Props) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const deleteWebhook = async () => {
    if (previewOnly) {
      onOpenChange(false)
      toast.info("Pré-visualização: nenhum webhook foi eliminado.")
      return
    }
    if (webhook?.id === undefined || webhook?.id === null || webhook.id === "") {
      toast.error("Não foi possível identificar o webhook seleccionado.")
      return
    }

    try {
      setLoading(true)
      await api.delete(`/api/v1/portal/webhooks/${encodeURIComponent(String(webhook.id))}`)
      await queryClient.invalidateQueries({ queryKey: ["ListaDeWebhooks"] })
      onOpenChange(false)
      toast.success("Webhook eliminado com sucesso.")
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message
        : undefined
      toast.error(message || "Não foi possível eliminar o webhook.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDeleteDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Eliminar webhook?"
      description={previewOnly
        ? `Pré-visualização com dados de exemplo. O webhook${webhook?.name ? ` “${webhook.name}”` : " seleccionado"} não será eliminado.`
        : `O webhook${webhook?.name ? ` “${webhook.name}”` : " seleccionado"} será eliminado. Esta acção não pode ser anulada.`}
      confirmLabel="Eliminar webhook"
      isLoading={loading}
      onConfirm={deleteWebhook}
    />
  )
}
