import { Button } from "@/components/ui/button"
import { api } from "@/api"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"
import type { Permissions } from "@/types/permissions"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { getControllers } from "../utils/getControllers"
import { Spinner } from "../utils/spinner"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any,
    cargo: string | undefined,
    currentView: number,
    setCurrentView: (valeu: number) => void
}

export default function DetailsPermissoesCargos({ onClose, isOpen, itemSelected, cargo, setCurrentView, currentView }: props) {

    async function pegaPermissoesCargos() {
        if (!cargo) return
        try {
            const urlCargosPermissoes = `/front/permissions/${cargo}`
            //console.log(urlLogs)
            const { data } = await api.get(urlCargosPermissoes)

            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, isLoading } = useQuery<Permissions[]>({
        queryKey: ['listaDePermissoes', cargo, itemSelected],
        queryFn: () => pegaPermissoesCargos(),
        placeholderData: keepPreviousData,
    })

    const dadosAgrupados = data?.reduce((acc: any, item) => {
        if (!acc[item?.controller]) {
            acc[item?.controller] = [];
        }
        acc[item?.controller]?.push(item);
        return acc;
    }, {});

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Consulte as informações e o estado deste registo.">Detalhes do Cargo</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                            <svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="25" height="25" rx="8" />
                                <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                            </svg>
                        </SheetClose>
                    </div>

                    <div className="">
                        <div className="ui-modal-tabs flex space-x-1.5 mt-5 pr-1 pl-1">
                            <button
                                onClick={() => setCurrentView(0)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer ${!currentView ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[12px] p-2 ring-1 ring-[#A9B8CF]`}>Detalhes do Cargo</button>
                            <button
                                onClick={() => setCurrentView(1)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer ${currentView ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[12px] p-2 ring-1 ring-[#A9B8CF]`}>Permissões</button>

                        </div>
                    </div>
                    <div className="overflow-hidden relative w-full h-auto">
                        <div className={`flex transition ease-out duration-500 w-[200%] h-auto`}
                            style={{
                                transform: `translateX(-${currentView * 50}%)`,
                            }}
                        >
                            <div className="space-y-5 w-full px-1 mt-8">

                                <div className="w-full">
                                    <div className="text-sm text-[#143163] space-y-2">

                                        <div className="w-full flex justify-between items-center">
                                            <p>Nome do Cargo:</p>
                                            <p className="h-5 font-semibold">{cargo}</p>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <p>Descrição:</p>
                                            <p className="h-5">{itemSelected?.description}</p>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <p>Estado:</p>
                                            <span className={`ui-status-tag ${itemSelected?.status === "Active" ? "bg-[#45B36938] text-[#0D9339]" :
                                                "bg-[#8E8E8E30] text-[#575757]"}`}>{itemSelected?.status === "Active" ? "Activo" : "Inativo"}</span>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <p>Responsável:</p>
                                            <p className="h-5">{itemSelected?.responsavel}</p>
                                        </div>


                                        <div className="w-full flex justify-between items-center">
                                            <p>Data de Criação:</p>
                                            <p className="h-5">{itemSelected?.created_at ? (new Date(itemSelected.created_at)).toLocaleDateString('pt-BR') : ''}</p>
                                        </div>

                                    </div>

                                </div>

                                <Button onClick={onClose} className=" w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                                    type="button" variant="brand">
                                    Concluído
                                </Button>
                            </div>
                            <div className="relative w-full h-full flex flex-col ">

                                <div className="mb-10 flex-1 overflow-y-auto px-2 mt-4 max-h-[550px] pb-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                                    <Accordion type="single" collapsible className="">
                                        {isLoading ?
                                            <div className="relative">
                                                <div className="absolute flex justify-center w-full mt-20">
                                                    <Spinner color="#143163" width="8" height="8" />
                                                </div>
                                            </div> :
                                            dadosAgrupados && Object?.entries(dadosAgrupados)?.map(([controller, permissoes]) => (
                                                <AccordionItem key={controller} value={controller} className="border-b-0 text-[#143163] ">
                                                    <AccordionTrigger
                                                        className="capitalize flex justify-between w-full items-center p-2 py-4 cursor-pointer duration-300 hover:bg-[#f0f4fa] ">
                                                        <span className="font-semibold ">{getControllers(controller)}</span>
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="mt-2">
                                                            {Array.isArray(permissoes) && permissoes.map((p: any, i: any) => (
                                                                <div key={i} className="capitalize flex justify-between w-full items-center bg-[#F3F7FD] mb-2 p-2 rounded ">
                                                                    <span >{p.descricao}</span>
                                                                    {p.bool === 1 ? <span className="text-[#14B94A] font-semibold">Permitido</span> : <span className="font-semibold text-[#EF4A00]">Não Permitido</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                    </Accordion>

                                </div>
                                <div className="p-2 bg-white sticky bottom-0">
                                    <Button onClick={onClose} className=" w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                                        type="button" variant="brand">
                                        Concluído
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>

            </Sheet >
        </>
    )
}
