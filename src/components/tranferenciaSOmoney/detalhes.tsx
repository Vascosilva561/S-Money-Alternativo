import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"
import { statusTransactionsColor } from "../utils/statusTransactionsColor"
import { statusTransactions } from "../utils/statusTransactions"
import { CopyTextButton } from "@/components/ui/copy-text-button"


type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function Detalhes({ onClose, isOpen, itemSelected }: props) {


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none" >
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Consulte as informações e o estado deste registo.">Detalhes da transação</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                            <svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="25" height="25" rx="8" />
                                <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                            </svg>
                        </SheetClose>
                    </div>



                    <div className="space-y-5 mt-5">
                        <p className="font-semibold text-[#143163]">Informações Gerais da Transacção</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                {/* <div className="w-full flex justify-between items-center">
                                    <p>ID da Transação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.id}</p>
                                </div> */}
                                <div className="w-full flex justify-between items-center">
                                    <p>Tipo de Transação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.signal==="DEBIT"?"Débito":"Crédito"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data:</p>
                                    <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.created_at)).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Estado da Transação:</p>
                                    
                                    <span className={`ui-status-tag ${statusTransactionsColor(itemSelected?.status)}`}>
                                        {statusTransactions(itemSelected?.status)}
                                    </span>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Valor da Transação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Taxa/Comissão</p>
                                    <p className="h-5 text-[#4B5563]">indefinida por enquanto</p>
                                </div>

                                <div className="w-full flex justify-between items-center">
                                    <p>Descrição da Operação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.description}</p>
                                </div>

                            </div>

                        </div>

                       

                        <p className="text-[#143163] font-semibold pt-2">Dados do Remetente (Conta de Origem)</p>
                         <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10"></div>
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>Utilizador remetente:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.sender_name}</p>
                                        <CopyTextButton value={itemSelected?.sender_name} label="remetente" />
                                    </div>
                                </div>
                                {/* <div className="w-full flex justify-between items-center">
                                    <p>ID da Conta:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.sender_id}</p>
                                </div> */}

                                <div className="w-full flex justify-between items-center">
                                    <p>Telemóvel:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.contacto_sender}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Tipo de Conta:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.sender_type === "User"? "Particular": "Empresa"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Saldo antes da transação:</p>
                                    <p className="h-5 text-[#4B5563]">{(Number(itemSelected?.balance_sender) + Number(itemSelected?.amount))?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Saldo após transação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.balance_sender?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>
                            </div>
                        </div>

                       

                        <p className="text-[#143163] font-semibold pt-2">Dados do Remetente (Conta de Destino)</p>
                         <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10"></div>
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>Utilizador destinatário:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.receiver_name}</p>
                                        <CopyTextButton value={itemSelected?.receiver_name} label="destinatário" />
                                    </div>
                                </div>
                                {/* <div className="w-full flex justify-between items-center">
                                    <p>ID da Conta:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.receiver_id}</p>
                                </div> */}
                                <div className="w-full flex justify-between items-center">
                                    <p>Telemóvel:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.contacto_receiver}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Tipo de Conta:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.receiver_type === "User"? "Particular": "Empresa"}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Saldo antes da transação:</p>
                                    <p className="h-5 text-[#4B5563]">{(Number(itemSelected?.balance_receiver) - Number(itemSelected?.amount))?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Saldo após transação:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.balance_receiver?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>

                            </div>

                        </div>

                        <Button onClick={onClose} className=" w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="button" variant="brand">
                            Concluido
                        </Button>
                    </div>
                </SheetContent>

            </Sheet>
        </>
    )
}
