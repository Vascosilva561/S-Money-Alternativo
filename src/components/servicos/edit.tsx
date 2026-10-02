import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"


type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}


export default function EditService({ onClose, isOpen, itemSelected }: props) {
    const [formData, setFormData] = useState({
        margemSomoney: "",
        margemParceio: ""
    })
    const [_categoria, setCategoria] = useState("")
    const [_status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => {
        setFormData({
            ...formData,
            margemSomoney: itemSelected?.margem_somoney,
            margemParceio: itemSelected?.margem_parceiro
        })
        setCategoria(itemSelected?.category)
        setStatus(itemSelected?.status)
    }, [itemSelected])

    const editService = async() => {
        setLoading(true)
        try {
            await api.put(`/front/entity/${itemSelected?.id}/update`, {
                margem_somoney: Number(formData.margemSomoney),
                margem_parceiro: Number(formData.margemParceio),
            })
            toast.success("Serviço editado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ['ListaDeServicos'] })
            onClose()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao editar serviço!")
        }finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-edit-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Actualize os dados deste registo e guarde as alterações.">Editar Serviço - {itemSelected?.name}</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <div className="">

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Margem Sómoney</label>
                                <input type="number" value={formData.margemSomoney} onChange={(e) => setFormData({ ...formData, margemSomoney: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Margem Parceiro</label>
                                <input type="number" value={formData.margemParceio} onChange={(e) => setFormData({ ...formData, margemParceio: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>

                        {/* <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Categoria</label>
                                <Select onValueChange={setCategoria} value={categoria}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos"/>
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="PUBLIC_SERVICE">Serviços Públicos</SelectItem>
                                        <SelectItem value="RECHARGE">Telefonia</SelectItem>
                                        <SelectItem value="TV">Televisão</SelectItem>
                                       
                                        <SelectItem value="BET">Apostas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Estado</label>
                                <Select onValueChange={setStatus} value={status}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="ENABLED">Activo</SelectItem>
                                        <SelectItem value="DISABLED">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div> */}

                        <Button type="button" onClick={editService} disabled={loading}
                        className=" w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold" variant="brand">
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}
