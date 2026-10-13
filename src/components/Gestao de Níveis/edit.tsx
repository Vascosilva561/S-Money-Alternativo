import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"

import { useEffect, useState, useTransition } from "react"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: any
}

export default function EditRule({
    onClose,
    isOpen,
    itemSelected,
}: Props) {

    const [formData, setFormData] = useState({
        rule_type: "",
        transaction_rules: "",
        per_day: "",
        per_mounth: "",
        found_total: "",
        account_type: "",
    })

    const [loading, setLoading] = useState(false)

    const [_isPending, startTransition] = useTransition()

    const queryClient = useQueryClient()

    useEffect(() => {
        if (!itemSelected) return

        setFormData({
            rule_type: itemSelected?.rule_type?.toString() || "",
            transaction_rules: itemSelected?.transaction_rules?.toString() || "",
            per_day: itemSelected?.per_day?.toString() || "",
            per_mounth: itemSelected?.per_mounth?.toString() || "",
            found_total: itemSelected?.found_total?.toString() || "",
            account_type: itemSelected?.account_type || "",
        })
    }, [itemSelected])


    async function updateRule(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            setLoading(true)

            const body = {
                rule_type: Number(formData.rule_type),
                transaction_rules: Number(formData.transaction_rules),
                per_day: Number(formData.per_day),
                per_mounth: Number(formData.per_mounth),
                found_total: Number(formData.found_total),
                account_type: formData.account_type,
            }

            await api.put(
                `/front/rules/${itemSelected?.id}`,
                body
            )

            startTransition(() => {
                queryClient.invalidateQueries({
                    queryKey: ["ListaDeRules"],
                })
            })


            onClose()

            toast.success("Alterações efectuadas com sucesso!", {
                icon: (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075Z"
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
                    "Não foi possível actualizar a regra."

                toast.error(message, {
                    duration: 2000,
                })
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet
            onOpenChange={onClose}
            open={isOpen}
        >
            <SheetContent
                style={{ minWidth: "35%" }}
                className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none"
            >

                <div className="flex justify-between items-center w-full">

                    <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                        Editar Nível
                    </SheetHeader>

                    <SheetClose className="cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>

                </div>

                <form onSubmit={updateRule}>

                    {/* Tipo de Regra */}
                    <div className="flex flex-col space-y-2 mt-6">

                        <label className="text-[#143163] font-semibold text-[14px]">
                            Nível
                        </label>

                        <input
                            required
                            type="number"
                            value={formData.rule_type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    rule_type: e.target.value,
                                })
                            }
                            className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                        />

                    </div>

                    {/* Regras de Transação */}
                    <div className="flex flex-col space-y-2 mt-6">

                        <label className="text-[#143163] font-semibold text-[14px]">
                            Total por Transação
                        </label>

                        <input
                            required
                            type="number"
                            value={formData.transaction_rules}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    transaction_rules: e.target.value,
                                })
                            }
                            className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                        />
                        <p className="text-[#143163] text-[12px] opacity-50">
                            {Number(formData.transaction_rules)?.toLocaleString("pt-BR")} Kz
                        </p>

                    </div>

                    {/* Limites */}
                    <div className="flex items-center justify-between gap-2">

                        <div className="flex flex-col space-y-2 mt-6 w-full min-w-0">

                            <label className="text-[#143163] font-semibold text-[14px]">
                                Por Dia
                            </label>

                            <input
                                required
                                type="number"
                                value={formData.per_day}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        per_day: e.target.value,
                                    })
                                }
                                className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                            />
                            <p className="text-[#143163] text-[12px] opacity-50">
                                {Number(formData.per_day)?.toLocaleString("pt-BR")} Kz
                            </p>

                        </div>

                        <div className="flex flex-col space-y-2 mt-6 w-full min-w-0">

                            <label className="text-[#143163] font-semibold text-[14px]">
                                Por Mês
                            </label>

                            <input
                                required
                                type="number"
                                value={formData.per_mounth}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        per_mounth: e.target.value,
                                    })
                                }
                                className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                            />
                            <p className="text-[#143163] text-[12px] opacity-50">
                                {Number(formData.per_mounth)?.toLocaleString("pt-BR")} Kz
                            </p>

                        </div>

                    </div>

                    {/* Fundo Total */}
                    <div className="flex flex-col space-y-2 mt-6">

                        <label className="text-[#143163] font-semibold text-[14px]">
                            Fundo Total
                        </label>

                        <input
                            required
                            type="number"
                            value={formData.found_total}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    found_total: e.target.value,
                                })
                            }
                            className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                        />
                        <p className="text-[#143163] text-[12px] opacity-50">
                            {Number(formData.found_total)?.toLocaleString("pt-BR")} Kz
                        </p>

                    </div>

                    {/* Tipo de Conta */}
                    <div className="flex flex-col space-y-2 mt-6">

                        <label className="text-[#143163] font-semibold text-[14px]">
                            Tipo de Conta
                        </label>


                        <Select

                            onValueChange={(value) => setFormData({ ...formData, account_type: value })} value={formData.account_type}>
                            <SelectTrigger
                                className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] 
                                                         focus:outline-none text-[#143163] text-sm"
                            >
                                <SelectValue placeholder="Selecione o tipo de conta" />
                            </SelectTrigger>
                            <SelectContent
                                className=" ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] 
                                                        focus:outline-none text-[#143163] text-sm"
                            >
                                <SelectItem value="User">Particular</SelectItem>
                                <SelectItem value="Merchant">Empresa</SelectItem>
                            </SelectContent>
                        </Select>


                    </div>

                    <button
                        className="w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="w-6 h-6 rounded-full border border-t-transparent border-[#143163] animate-spin" />
                            </div>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </button>

                </form>

            </SheetContent>
        </Sheet>
    )
}