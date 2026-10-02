import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import { useState } from "react"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type props = {
    isOpen: boolean,
    onClose: () => void,
}

const semana = ["Domingo", "2ª feira", "3ª feira", "4ª feira", "5ª feira", "6ª feira", "Sábado"]


export default function CriarCampanha({ onClose, isOpen }: props) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        rewardAmount: "",
        budget: "",
        active: true,
        tipo: "indicacao",
        codigo: "",
        operadora: "",
        produto: "",
        diaSemana: "",
        valorPromocional: "",
        percentual: "",

    })
    const [loading, setLoading] = useState(false)
    const [loadingCodigo, setLoadingCodigo] = useState(false)
    const [userSend, setUserSend] = useState("")
    const [isVerifided, setIsVeryfieded] = useState(false)
    const [tipoDesconto, setTipoDesconto] = useState<"percentual" | "valor">("valor")
    const [idSelecionado, setIdSelecionado] = useState("")

    console.log(idSelecionado)

    const clearInputs = () => {
        setFormData({
            ...formData,
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            rewardAmount: "",
            budget: "",
            active: true,
            tipo: "indicacao",
            codigo: "",
            operadora: ""
        })
        setUserSend("")
    }

    const queryClient = useQueryClient()

    async function criarCampanha(e: any) {
        e.preventDefault()

        if (!isVerifided) return toast?.error("Código de convite não verificado!");

        try {
            const body = {
                title: formData.title,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                reward_amount: formData.rewardAmount,
                budget: formData.budget,
                active: formData.active,
                invite_code: formData.codigo
            }
            setLoading(true)

            await api.post("/front/campaigns", body)

            queryClient.invalidateQueries({
                queryKey: ['ListaDeCampanhas'],
            })

            clearInputs()
            onClose()

            toast.success(`Campanha criada com sucesso!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },
                duration: 2000

            })

        } catch (error) {
            console.log(error)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.error || "Erro ao criar campanha"

                toast.error(`${message}`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 2000

                })
            }
        } finally {
            setLoading(false);
        }
    }

    async function verificarCodigo(codigo: string, e?: any,) {
        e?.preventDefault()

        if (!codigo) return toast?.error("Código de convite não encontrado!");

        try {

            setLoadingCodigo(true)

            const res = await api.get(`/front/users/by_invite_code/${codigo}`)

            setUserSend(res?.data?.name)
            setIsVeryfieded(true)

        } catch (error) {
            console.log(error)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.errors[0]?.message || "Erro ao verificar código de convite"

                toast.error(`${message}`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 2000

                })
            }
            setIsVeryfieded(false)
        } finally {
            setLoadingCodigo(false);
        }
    }

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Preencha os campos para adicionar um novo registo.">Criar campanha</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-[14px]">Tipo de Campanha</label>
                        <Select onValueChange={(value) => setFormData({ ...formData, tipo: value })} value={formData?.tipo}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="indicacao">Indicação</SelectItem>
                                <SelectItem value="desconto-servico">Desconto de Serviço</SelectItem>
                                {/* <SelectItem value="cash-back">Cash-Back</SelectItem> */}
                            </SelectContent>
                        </Select>
                    </div>

                    <form onSubmit={criarCampanha} className="w-full">


                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Título</label>
                            <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Descrição</label>
                            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        {formData?.tipo === "desconto-servico" && <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Operadora</label>
                            <Select onValueChange={(value) => setFormData({ ...formData, operadora: value })} value={formData?.operadora}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a operadora" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unitel">Unitel</SelectItem>
                                    <SelectItem value="africell">Africell</SelectItem>
                                    <SelectItem value="movicel">Moviel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>}
                        {(formData?.operadora && formData?.tipo === "desconto-servico") && <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Produto</label>
                            <Select onValueChange={(value) => setFormData({ ...formData, produto: value })} value={formData?.produto}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o produto" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="valor">Valor</SelectItem>
                                    <SelectItem value="percentual">Percentual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>}
                        {formData?.tipo === "desconto-servico" && <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Tipo de desconto</label>
                            <Select onValueChange={(e: "percentual" | "valor") => setTipoDesconto(e)} value={tipoDesconto}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="valor">Valor</SelectItem>
                                    <SelectItem value="percentual">Percentual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>}

                        {formData?.tipo === "indicacao" && <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Data de início</label>
                                <input required type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none
                                     text-[#143163] text-sm`} />
                            </div>

                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Data de término</label>
                                <input required type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none 
                                    text-[#143163] text-sm`} />
                            </div>
                        </div>}

                        <div className="flex items-center justify-between space-x-2 relative">
                            {formData?.tipo === "indicacao" && <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Valor do prémio</label>
                                <input required type="number" step="0.01" min="0" value={formData.rewardAmount} onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>}

                            {formData?.tipo === "desconto-servico" && <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">
                                    {tipoDesconto === "valor" ? "Valor promocional" : "Percentual"}
                                </label>
                                <input required type={tipoDesconto === "valor" ? "number" : "text"} step="0.01" min="0" value={formData.rewardAmount} onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            }
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Orçamento</label>
                                <input required type="number" step="0.01" min="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>
                        {formData?.tipo === "desconto-servico" && <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Dia da semana</label>
                            <div className="flex flex-wrap gap-2 w-full">{semana?.map((dia) =>
                                <p
                                    onClick={() => setIdSelecionado(dia)}
                                    className={` rounded p-2 text-[#143163] 
                                 font-semibold cursor-pointer duration-150
                                 text-sm max-h-8 min-h-fit wfit ring-1 ring-blue-200
                                  ${dia === idSelecionado ? "bg-blue-200" : "bg-blue-50"} hover:bg-blue-100 active:bg-blue-200`}>
                                    {dia}
                                </p>
                            )}
                            </div>
                        </div>}
                        {formData?.tipo === "indicacao" && <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Código de indicação</label>
                            <div className="relative ">

                                <input required type="text" step="0.01" min="0" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] 
                                    focus:outline-none text-[#143163] text-sm`} />
                                <Button type="button" disabled={loadingCodigo} onClick={() => verificarCodigo(formData?.codigo)}
                                    className={`ui-inline-validation absolute ${loadingCodigo ? "bg-[#f2f7f8] text-zinc-500" : "bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA]"}
                                 transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold
                                 p-2 rounded-r text-sm px-3 h- flex flex-col justify-center top-0 right-0 cursor-pointer`} variant="brand">
                                    {loadingCodigo ? "A validar..." : "Validar"}
                                </Button>
                            </div>

                            {<p className="text-green-600 text-sm font-semibold">{userSend || ""}</p>}
                        </div>}

                        <div className="flex justify-between items-center space-x-2 mt-6">
                            
                            <label className="text-[#143163] font-semibold text-[14px]">Estado da campanha </label>
                            <button
                                type="button"
                                title={formData?.active?"Inactivar campanha":"Activar campanha"}
                                onClick={() => setFormData({ ...formData, active: !formData?.active })}
                            >
                                {formData.active ? <svg className="duration-300 hover:opacity-55" width="50" height="25" viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="50" height="25" rx="14" fill="#22C55E" />
                                    <circle cx="36" cy="12.5" r="10" fill="white" className={`transition-all duration-300
                                 ${!formData.active ? "translate-x-[23px]" : "translate-x-0"
                                        }`} />
                                </svg> :

                                    <svg className="duration-300 hover:opacity-55" width="50" height="25" viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="50" height="25" rx="14" fill="#D1D5DB" />
                                        <circle cx="14" cy="12.5" r="10" fill="white" className={`transition-all duration-300
                                 ${formData.active ? "translate-x-[23px]" : "translate-x-0"
                                            }`} />
                                    </svg>
                                }


                            </button>
                        </div>

                        {<Button className=" w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer
                        bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0]
                         text-[#143163] font-semibold"
                            type="submit" variant="brand">
                            {loading ?
                                <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                </div> : "Criar Campanha"
                            }
                        </Button>}

                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
