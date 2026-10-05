import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { NativeSelectField } from "@/components/ui/form-field"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ReferenceConfiguration } from "@/types/configMerchant"
import type { ReferencePool, ReferencePoolResponse } from "@/types/poolsType"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onClose: () => void
  mode?: "create" | "edit"
  config?: ReferenceConfiguration | null
}

type Merchant = {
  id: string
  business_name: string
  merchant_payment_number: string
}

type MerchantResponse = { dados: Merchant[] }
type ReferenceProfile = {
  profile: string
  description?: string
  min: number
  max: number | null
}
type ReferenceProfilesResponse = { data: ReferenceProfile[] }
type ConfigFormData = { clientId: string; poolId: string; profile: string }

const emptyForm: ConfigFormData = { clientId: "", poolId: "", profile: "" }

export default function AddConfig({ onClose, isOpen, mode = "create", config = null }: Props) {
  const [formData, setFormData] = useState<ConfigFormData>(emptyForm)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const isEditing = mode === "edit"

  const { data: poolsData = [], isLoading: isLoadingPools } = useQuery<ReferencePoolResponse>({
    queryKey: ["ListaDePools"],
    queryFn: async () => {
      const response = await api.get("/front/merchant/somoney_reference/pools")
      return response.data
    },
    enabled: isOpen,
  })

  const { data: merchantsData, isLoading: isLoadingMerchants } = useQuery<MerchantResponse>({
    queryKey: ["ListaDeMerchants"],
    queryFn: async () => {
      const response = await api.get("/front/merchants?per_page=100&page=1")
      return response.data
    },
    enabled: isOpen,
  })

  const { data: profilesResponse, isLoading: isLoadingProfiles } = useQuery<ReferenceProfilesResponse>({
    queryKey: ["ListaDeProfile"],
    queryFn: async () => {
      const response = await api.get("/front/merchant/somoney_reference/reference-ranges")
      return response.data
    },
    enabled: isOpen,
  })

  useEffect(() => {
    if (!isOpen) {
      setFormData(emptyForm)
      return
    }

    setFormData({
      clientId: config?.client_id ?? "",
      poolId: config?.pool_id ?? "",
      profile: config?.profile ?? "",
    })
  }, [config, isOpen, mode])

  const selectedProfile = profilesResponse?.data?.find((item) => item.profile === formData.profile)
  const merchants = merchantsData?.dados ?? []

  async function submitConfig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isEditing && !config?.id) {
      toast.error("Não foi possível identificar a configuração seleccionada.")
      return
    }

    try {
      setLoading(true)
      const body = {
        client_id: formData.clientId,
        pool_id: formData.poolId,
        profile: formData.profile,
      }

      if (isEditing && config) {
        await api.put(`/front/merchant/somoney_reference/client-configs/${encodeURIComponent(config.id)}`, body)
      } else {
        await api.post("/front/merchant/somoney_reference/client-configs", body)
      }

      await queryClient.invalidateQueries({ queryKey: ["ConfigIndicacoes"] })
      onClose()
      toast.success(isEditing ? "Configuração actualizada com sucesso." : "Configuração criada com sucesso.")
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message
        : undefined
      toast.error(message || (isEditing ? "Não foi possível actualizar a configuração." : "Não foi possível criar a configuração."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="ui-edit-sheet w-full overflow-hidden sm:max-w-[440px]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <SheetHeader className="p-0">
            <SheetTitle>{isEditing ? "Editar configuração" : "Adicionar configuração"}</SheetTitle>
            <SheetDescription>
              {isEditing ? "Actualize os dados desta configuração." : "Associe um cliente, um pool e um perfil de referências."}
            </SheetDescription>
          </SheetHeader>
          <SheetClose aria-label="Fechar formulário" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        <form onSubmit={submitConfig} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5">
            <NativeSelectField
              label="Cliente"
              required
              value={formData.clientId}
              onChange={(event) => setFormData({ ...formData, clientId: event.target.value })}
              disabled={isLoadingMerchants}
            >
              <option value="">{isLoadingMerchants ? "A carregar clientes…" : "Seleccione um cliente"}</option>
              {isEditing && config?.client_id && !merchants.some((item) => item.merchant_payment_number === config.client_id) && (
                <option value={config.client_id}>{config.merchant?.business_name || config.client_id}</option>
              )}
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.merchant_payment_number}>
                  {merchant.business_name || merchant.merchant_payment_number}
                </option>
              ))}
            </NativeSelectField>

            <NativeSelectField
              label="Pool"
              required
              value={formData.poolId}
              onChange={(event) => setFormData({ ...formData, poolId: event.target.value })}
              disabled={isLoadingPools}
            >
              <option value="">{isLoadingPools ? "A carregar pools…" : "Seleccione um pool"}</option>
              {isEditing && config?.pool_id && !poolsData.some((item) => item.id === config.pool_id) && (
                <option value={config.pool_id}>{config.pool_id}</option>
              )}
              {poolsData.map((pool: ReferencePool) => (
                <option key={pool.id} value={pool.id}>{pool.description} ({pool.reference_length} dígitos)</option>
              ))}
            </NativeSelectField>

            <NativeSelectField
              label="Perfil"
              required
              value={formData.profile}
              onChange={(event) => setFormData({ ...formData, profile: event.target.value })}
              disabled={isLoadingProfiles}
            >
              <option value="">{isLoadingProfiles ? "A carregar perfis…" : "Seleccione um perfil"}</option>
              {isEditing && config?.profile && !profilesResponse?.data?.some((item) => item.profile === config.profile) && (
                <option value={config.profile}>{config.profile}</option>
              )}
              {profilesResponse?.data?.map((profile) => (
                <option key={profile.profile} value={profile.profile}>{profile.description || profile.profile}</option>
              ))}
            </NativeSelectField>

            {selectedProfile && (
              <div className="rounded-lg border border-[#E3EAF4] bg-[#F8FAFC] p-3 text-sm text-[#637590]">
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <span><strong className="text-[#143163]">Mínimo:</strong> {selectedProfile.min.toLocaleString("pt-PT")}</span>
                  <span><strong className="text-[#143163]">Máximo:</strong> {selectedProfile.max !== null ? selectedProfile.max.toLocaleString("pt-PT") : "Sem limite"}</span>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="ui-edit-sheet-footer--horizontal mt-auto flex-row justify-end gap-3 border-t border-[#E5EBF4] p-0 pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11 flex-1 rounded-lg" disabled={loading}>Cancelar</Button>
            </SheetClose>
            <Button type="submit" variant="brand" className="h-11 flex-1 rounded-lg font-semibold" disabled={loading || (isEditing && !config)}>
              {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : isEditing ? "Guardar alterações" : "Adicionar configuração"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
