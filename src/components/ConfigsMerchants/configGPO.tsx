import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Link2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import type { MerchantUser } from "@/pages/configGPO"
import { normalizeGpoStatus } from "@/components/ConfigsMerchants/gpoStatus"
import { NativeSelectField } from "@/components/ui/form-field"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: MerchantUser | null
}

export default function EditGpoMerchant({
    onClose,
    isOpen,
    itemSelected,
}: Props) {
    const [formData, setFormData] = useState({
        minAmount: "",
        maxAmount: "",
        gpoStatus: "INACTIVE",
        gpoBilling: "",

    })

    const [loading, setLoading] = useState(false)
    const [serviceAccountId, setServiceAccountId] = useState("")

    const queryClient = useQueryClient()

    useEffect(() => {
        if (itemSelected) {
            setServiceAccountId(itemSelected.service_accounts?.find((account) => account.id)?.id ?? "")
            setFormData({
                minAmount:
                    itemSelected.gpo_min_amount_per_trx?.toString() || "",
                maxAmount:
                    itemSelected.gpo_max_amount_per_trx?.toString() || "",
                gpoStatus: normalizeGpoStatus(itemSelected.gpo_status) ?? "INACTIVE",
                gpoBilling:
                    itemSelected.gpo_billing?.toString() || "",
            })
        }
    }, [itemSelected])

    

    async function updateGpo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!itemSelected) {
            toast.error("Comerciante não selecionado.")
            return
        }

        const minAmount = Number(formData.minAmount)
        const maxAmount = Number(formData.maxAmount)
        const gpoBilling = Number(formData.gpoBilling)

        if (gpoBilling < 1 || gpoBilling > 100) {
            toast.error("A cobrança GPO deve estar entre 1% e 100%.")
            return
        }

        if (minAmount < 0 || maxAmount < 0) {
            toast.error("Os valores não podem ser negativos.")
            return
        }

        if (minAmount > maxAmount) {
            toast.error(
                "O valor mínimo não pode ser maior que o valor máximo."
            )
            return
        }

        try {
            setLoading(true)

            const body = {
                gpo_min_amount_per_trx: minAmount,
                gpo_max_amount_per_trx: maxAmount,
                gpo_status: formData.gpoStatus,
                gpo_billing: gpoBilling,
                ...(serviceAccountId ? { permissions: itemSelected.service_accounts?.find((account) => account.id === serviceAccountId)?.permissions ?? [] } : {}),
            }

            await api.put(`/front/merchants/${itemSelected.id}`, body)

            await queryClient.invalidateQueries({
                queryKey: ["ListaDeMerchants"],
            })

            onClose()

            toast.success("Configuração GPO atualizada com sucesso!", {
                icon: (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7498C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075Z"
                            fill="#45B369"
                        />
                    </svg>
                ),
                style: {
                    borderLeft: "8px solid #45B369",
                },
                duration: 2000,
            })
        } catch (error) {
            console.log(error)

            if (isAxiosError(error)) {
                const message =
                    error?.response?.data?.error ||
                    "Erro ao atualizar configuração GPO."

                toast.error(message, {
                    duration: 2000,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet onOpenChange={onClose} open={isOpen}>
            <SheetContent className="ui-edit-sheet w-full overflow-y-auto sm:max-w-[520px]">
                <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Editar configuração GPO</SheetTitle>
                        <SheetDescription>Actualize os limites, a cobrança e o estado da integração GPO.</SheetDescription>
                    </SheetHeader>

                    <SheetClose aria-label="Fechar configuração GPO" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                {itemSelected && (
                    <div className="mt-2 flex min-h-0 flex-1 flex-col">
                        <div className="rounded-lg bg-[#F8FAFC] p-4">
                            <p className="text-sm font-semibold text-[#143163]">
                                Comerciante
                            </p>

                            <p className="text-[#4B5563] text-sm mt-1">
                                {itemSelected.business_name || "—"}
                            </p>
                        </div>

                        <form onSubmit={updateGpo} className="mt-5 flex min-h-0 flex-1 flex-col">
                            {itemSelected?.service_accounts?.some((account) => account.id) && <div className="mb-5">
                                <NativeSelectField label="Conta de serviço" value={serviceAccountId} onChange={(event) => setServiceAccountId(event.target.value)} disabled={loading}
                                    hint="As permissões da conta seleccionada são preservadas ao actualizar a configuração GPO.">
                                    {itemSelected.service_accounts.filter((account) => account.id).map((account) => (
                                        <option key={account.id} value={account.id ?? ""}>{account.name || account.id}</option>
                                    ))}
                                </NativeSelectField>
                            </div>}
                            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="ui-field-label">
                                        Valor mínimo por transação
                                    </label>

                                    <input
                                        required
                                        min="0"
                                        step="0.01"
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                minAmount: e.target.value,
                                            })
                                        }
                                        placeholder="Ex.: 100"
                                        className="ui-control px-3"
                                    />

                                    <span className="text-xs text-[#8998B1]">
                                        Valor mínimo permitido por transação.
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="ui-field-label">
                                        Valor máximo por transação
                                    </label>

                                    <input
                                        required
                                        min="0"
                                        step="0.01"
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                maxAmount: e.target.value,
                                            })
                                        }
                                        placeholder="Ex.: 50000"
                                        className="ui-control px-3"
                                    />

                                    <span className="text-xs text-[#8998B1]">
                                        Valor máximo permitido por transação.
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="ui-field-label">
                                        Cobrança GPO
                                    </label>

                                    <div className="relative">
                                        <input
                                            required
                                            min="1"
                                            max="100"
                                            step="0.01"
                                            type="number"
                                            value={formData.gpoBilling}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    gpoBilling: e.target.value,
                                                })
                                            }
                                            placeholder="Ex.: 5"
                                            className="ui-control px-3 pr-8"
                                        />

                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8998B1] text-sm">
                                            %
                                        </span>
                                    </div>

                                    <span className="text-xs text-[#8998B1]">
                                        Percentual cobrado por transação. Deve estar entre 1% e 100%.
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4 shadow-[0_1px_2px_rgba(20,49,99,0.04)]">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
                                        <Link2 className="size-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#143163]">Integração via GPO</p>
                                        <p className="mt-1 text-sm leading-5 text-[#667085]">Permite ao comerciante processar pagamentos por GPO.</p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={formData.gpoStatus === "ACTIVE"}
                                        aria-label={`Integração GPO ${formData.gpoStatus === "ACTIVE" ? "activa" : "inactiva"}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                gpoStatus: formData.gpoStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                                            })
                                        }
                                        disabled={loading}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${formData.gpoStatus === "ACTIVE" ? "bg-[#22C55E]" : "bg-[#D1D5DB]"}`}
                                    >
                                        <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.gpoStatus === "ACTIVE" ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            </div>

                            <SheetFooter className="ui-edit-sheet-footer--horizontal mt-auto flex-row justify-end gap-3 border-t border-[#E5EBF4] p-0 pt-4">
                                <SheetClose asChild>
                                    <Button type="button" variant="outline" className="h-11 flex-1 rounded-lg" disabled={loading}>
                                        Cancelar
                                    </Button>
                                </SheetClose>
                                <Button type="submit" variant="brand" className="h-11 flex-1 rounded-lg font-semibold" disabled={loading}>
                                    {loading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Guardar alterações"}
                                </Button>
                            </SheetFooter>
                        </form>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
