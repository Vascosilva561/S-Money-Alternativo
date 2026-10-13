import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetailsRule({ onClose, isOpen, itemSelected }: props) {

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent style={{ minWidth: '35%' }} className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none" >
                    <div className="flex justify-between items-center w-full ">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0">Detalhes do Nível</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                            <svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="25" height="25" rx="8" />
                                <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                            </svg>
                        </SheetClose>
                    </div>

                    <div className="space-y-5 mt-5">
                        <p className="font-semibold text-[#143163]">
                            Resumo do Nível
                        </p>

                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8" />

                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-3">

                                {/* Tipo de Conta */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Tipo de Conta:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.account_type === "User" ? "Particular" : "Empresa"}
                                    </p>
                                </div>

                                {/* Tipo de Regra */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Nível:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.rule_type ?? "-"}
                                    </p>
                                </div>

                                {/* Limite por Transação */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Por Transação:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.transaction_rules != null
                                            ? `${itemSelected.transaction_rules.toLocaleString("pt-AO")} Kz`
                                            : "-"}
                                    </p>
                                </div>

                                {/* Limite Diário */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Por Dia:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.per_day != null
                                            ? `${itemSelected.per_day.toLocaleString("pt-AO")} Kz`
                                            : "-"}
                                    </p>
                                </div>

                                {/* Limite Mensal */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Por Mês:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.per_mounth != null
                                            ? `${itemSelected.per_mounth.toLocaleString("pt-AO")} Kz`
                                            : "-"}
                                    </p>
                                </div>

                                {/* Fundo Total */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <p className="shrink-0">
                                        Fundo Total:
                                    </p>

                                    <p className="text-[#4B5563] text-right">
                                        {itemSelected?.found_total != null
                                            ? `${itemSelected.found_total.toLocaleString("pt-AO")} Kz`
                                            : "-"}
                                    </p>
                                </div>

                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer
      bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA]
      transition duration-300 ring-1 ring-[#ADCBD0]
      text-[#143163] font-semibold"
                            type="button"
                        >
                            Concluído
                        </button>
                    </div>
                </SheetContent>

            </Sheet>
        </>
    )
}