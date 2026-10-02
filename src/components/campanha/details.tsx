import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"
import type { Campanha } from "@/types/campanha"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: Campanha | undefined
}

export default function DetailsCampanha({ onClose, isOpen, itemSelected }: props) {

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none" >
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Consulte as informações e o estado deste registo.">Detalhes da campanha</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                            <svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="25" height="25" rx="8" />
                                <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                            </svg>
                        </SheetClose>
                    </div>

                    <div className="space-y-5 mt-5">

                        <p className="font-semibold text-[#143163]">Detalhes</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-2">
                                <div className="w-full flex justify-between items-center">
                                    <p>Título:</p>
                                    <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.title}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Valor do prémio:</p>
                                    <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.reward_amount}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Estado:</p>
                                    <span className={`ui-status-tag ${itemSelected?.active ? "bg-[#45B36938] text-[#0D9339]" : "bg-[#8E8E8E30] text-[#575757]"}`}>
                                        {itemSelected?.active ? "Activo" : "Inativo"}</span>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Orçamento:</p>
                                    <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.budget}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Total de prémios distribuidos:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.total_distributed_rewards}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data de início:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.start_date ? (new Date(itemSelected?.start_date)).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : "N/A"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data de término:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.end_date ? (new Date(itemSelected?.end_date)).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : "N/A"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data de Criação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.created_at ? (new Date(itemSelected?.created_at)).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : "N/A"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Última Actualização:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.updated_at ? (new Date(itemSelected?.updated_at)).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : "N/A"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Promotor da indicação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.user_promoter?.business_name || (itemSelected?.user_promoter?.first_name + " " + itemSelected?.user_promoter?.last_name) || "N/A"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Código de indicação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.invite_code  || "N/A"}</p>
                                </div>


                                <div className="flex flex-col space-y-2">
                                    <label>Descrição:</label>
                                    <span className="ring-1 ring-zinc-200 bg-zinc-50 p-2 rounded">{itemSelected?.description || ""}</span>
                                </div>
                            </div>
                        </div>

                        <Button onClick={onClose} className=" w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="button" variant="brand">
                            Concluído
                        </Button>
                    </div>
                </SheetContent>

            </Sheet>
        </>
    )
}
