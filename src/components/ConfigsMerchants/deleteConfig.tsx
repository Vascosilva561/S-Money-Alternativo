import { api } from "@/api"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import type { ReferenceConfiguration } from "@/types/configMerchant"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  config: ReferenceConfiguration | null
}

export default function DeleteConfig({ isOpen, onOpenChange, config }: Props) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const deleteConfig = async () => {
    if (!config?.id) {
      toast.error("Não foi possível identificar a configuração seleccionada.")
      return
    }

    try {
      setLoading(true)
      await api.delete(`/front/merchant/somoney_reference/client-configs/${encodeURIComponent(config.id)}`)
      await queryClient.invalidateQueries({ queryKey: ["ConfigIndicacoes"] })
      onOpenChange(false)
      toast.success("Configuração eliminada com sucesso.")
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message
        : undefined
      toast.error(message || "Não foi possível eliminar a configuração.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDeleteDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Eliminar configuração?"
      description={`A configuração${config?.id ? ` “${config.id}”` : " seleccionada"} será eliminada. Esta acção não pode ser anulada.`}
      confirmLabel="Eliminar configuração"
      isLoading={loading}
      onConfirm={deleteConfig}
    />
  )
}
