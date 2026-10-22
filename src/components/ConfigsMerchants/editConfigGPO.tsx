import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { 
    //AVAILABLE_PERMISSIONS,
     type MerchantUser } from "@/pages/configGPO"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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

    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [selectedServiceAccountId, setSelectedServiceAccountId] = useState(
        itemSelected?.service_accounts?.[0]?.id ?? ""
    )

    const [permissions, setPermissions] = useState<string[]>([])

    useEffect(() => {
        const account = itemSelected?.service_accounts?.find(
            (account) => account.id === selectedServiceAccountId
        )

        setPermissions(account?.permissions ?? [])
    }, [itemSelected, selectedServiceAccountId])

    // const handlePermissionChange = (permission: string) => {
    //     setPermissions((current) =>
    //         current.includes(permission)
    //             ? current.filter((item) => item !== permission)
    //             : [...current, permission]
    //     )
    // }

    useEffect(() => {
        if (itemSelected) {
            setFormData({
                minAmount:
                    itemSelected.gpo_min_amount_per_trx?.toString() || "",
                maxAmount:
                    itemSelected.gpo_max_amount_per_trx?.toString() || "",
                gpoStatus: itemSelected.gpo_status || "INACTIVE",
                gpoBilling:
                    itemSelected.gpo_billing?.toString() || "",
            })
            setSelectedServiceAccountId(
            itemSelected?.service_accounts?.[0]?.id ?? ""
        )
        }
    }, [itemSelected])


    async function updateGpo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!itemSelected) {
            toast.error("Merchant não selecionado.")
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
                permissions,
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
            <SheetContent
                style={{ minWidth: "35%" }}
                className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none"
            >
                <div className="flex justify-between items-center w-full">
                    <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                        Editar configuração GPO
                    </SheetHeader>

                    <SheetClose className="cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="25" height="25" rx="8" />

                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.293 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>
                </div>

                {itemSelected && (
                    <div className="mt-6">
                        <div className="mb-6">
                            <p className="text-[#143163] font-semibold text-[14px]">
                                Merchant
                            </p>

                            <p className="text-[#4B5563] text-sm mt-1">
                                {itemSelected.business_name || "—"}
                            </p>
                        </div>

                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-6" />

                        <form onSubmit={updateGpo}>
                            <div className="flex flex-col space-y-2 mt-6">
                                <label className="text-[#143163] font-semibold text-[14px]">
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
                                    className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                                />

                                <span className="text-xs text-[#8998B1]">
                                    Valor mínimo permitido por transação.
                                </span>
                            </div>

                            <div className="flex flex-col space-y-2 mt-6">
                                <label className="text-[#143163] font-semibold text-[14px]">
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
                                    className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                                />

                                <span className="text-xs text-[#8998B1]">
                                    Valor máximo permitido por transação.
                                </span>
                            </div>
                            <div className="flex flex-col space-y-2 mt-6">
                                <label className="text-[#143163] font-semibold text-[14px]">
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
                                        className="w-full p-2 pr-8 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8998B1] text-sm">
                                        %
                                    </span>
                                </div>

                                <span className="text-xs text-[#8998B1]">
                                    Percentual cobrado por transação. Deve estar entre 1% e 100%.
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <p className="text-[#143163] font-semibold text-[14px]">
                                    Integração via GPO:
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            gpoStatus:
                                                formData.gpoStatus === "ACTIVE"
                                                    ? "INACTIVE"
                                                    : "ACTIVE",
                                        })
                                    }
                                    disabled={loading}
                                    className="cursor-pointer duration-300 hover:opacity-55 disabled:opacity-50"
                                >
                                    {formData.gpoStatus === "ACTIVE" ? (
                                        <svg
                                            width="50"
                                            height="25"
                                            viewBox="0 0 50 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                width="50"
                                                height="25"
                                                rx="14"
                                                fill="#22C55E"
                                            />

                                            <circle
                                                cx="36"
                                                cy="12.5"
                                                r="10"
                                                fill="white"
                                                className="transition-all duration-300"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="50"
                                            height="25"
                                            viewBox="0 0 50 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                width="50"
                                                height="25"
                                                rx="14"
                                                fill="#D1D5DB"
                                            />

                                            <circle
                                                cx="14"
                                                cy="12.5"
                                                r="10"
                                                fill="white"
                                                className="transition-all duration-300"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {/* <div className="w-full flex justify-between items-center gap-4">
                                <p className="text-sm text-gray-600">Conta de serviço:</p>

                                <Select
                                    value={selectedServiceAccountId}
                                    onValueChange={setSelectedServiceAccountId}
                                >
                                    <SelectTrigger className="w-48 h-8 text-xs">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>

                                    <SelectContent className="text-xs">
                                        {itemSelected?.service_accounts?.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={account.id ?? ""}
                                                disabled={!account.id}
                                            >
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-5">
                                <p className="font-semibold text-[#143163]">
                                    Permissões da conta de serviço
                                </p>

                                <div className="ring-[0.5px] ring-[#A9B8CF] w-full mt-3 mb-4" />

                                <div className="space-y-3">
                                    {AVAILABLE_PERMISSIONS.map((group) => (
                                        <div
                                            key={group.label}
                                            className="rounded-lg border border-gray-200 p-3"
                                        >
                                            <p className="text-sm font-semibold text-[#143163] mb-3">
                                                {group.label}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3">
                                                {group.permissions.map((permission) => (
                                                    <label
                                                        key={permission.value}
                                                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={permissions.includes(permission.value)}
                                                            onChange={() =>
                                                                handlePermissionChange(permission.value)
                                                            }
                                                            className="h-4 w-4 accent-[#143163]"
                                                        />

                                                        {permission.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div> */}

                            <button
                                className="w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin" />
                                    </div>
                                ) : (
                                    "Guardar alterações"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}