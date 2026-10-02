import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

type props = {
    isOpen: boolean,
    onClose: () => void,


}


export default function Configurar({ onClose, isOpen }: props) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        rewardAmount: "",
        budget: "",
        active: true,
    })
    const [loading, setLoading] = useState(false)

    const clearInputs = () => {
        setFormData({
            ...formData,
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            rewardAmount: "",
            budget: "",
            active: true,
        })
    }

    const queryClient = useQueryClient()

    async function configurar(e: any) {
        e.preventDefault()

        try {
            const body = {
                name: formData.name,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                reward_amount: parseFloat(formData.rewardAmount),
                budget: parseFloat(formData.budget),
                active: formData.active
            }
            setLoading(true)

            await api.post("/front/invite_promotions", body)

            queryClient.invalidateQueries({
                queryKey: ['ConfigIndicacoes'],
            })

            clearInputs()
            onClose()

            toast.success(`Configuração feita com sucesso!`, {
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
                const message = error?.response?.data?.error || "Erro ao configurar"

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

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Revise os parâmetros que serão aplicados nesta configuração.">Configurar</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <form onSubmit={configurar} className="w-full">

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Título</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Descrição</label>
                            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
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
                        </div>

                        <div className="flex items-center justify-between space-x-2 relative">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Valor do prémio</label>
                                <input required type="number" step="0.01" min="0" value={formData.rewardAmount} onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>

                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Orçamento</label>
                                <input required type="number" step="0.01" min="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="flex cursor-pointer items-center gap-2 text-[#143163] font-semibold text-[14px]">
                                <Checkbox checked={formData.active} onCheckedChange={(active) => setFormData({ ...formData, active })} />
                                Ativo
                            </label>
                        </div>

                        {<Button className=" w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="submit" variant="brand">
                            {loading ?
                                <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                </div> : "Configurar"
                            }
                        </Button>}
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
