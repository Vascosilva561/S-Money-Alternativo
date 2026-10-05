import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

import { statusPayment } from "../utils/statusPayment"
import { statusPaymentColor } from "../utils/statusPaymentColor"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { X } from "lucide-react"


type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetalhesPagamento({ onClose, isOpen, itemSelected }: props) {
    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
                    <div className="ui-detail-sheet-header flex items-start justify-between gap-4 w-full">
                        <SheetHeader className="p-0">
                            <SheetTitle>Detalhes do Pagamento</SheetTitle>
                            <SheetDescription>Consulte as informações e o estado deste pagamento.</SheetDescription>
                        </SheetHeader>
                        <SheetClose aria-label="Fechar detalhes do pagamento">
                            <X className="size-4" aria-hidden="true" />
                        </SheetClose>
                    </div>



                    <div className="ui-detail-sheet-body">
                    <div className="space-y-5 mt-5">
                        <p className="font-semibold text-[#143163]">Informações Gerais do Pagamento</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                {/* <div className="w-full flex justify-between items-center">
                                    <p>ID do Pagamento:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.id}</p>
                                </div> */}
                                <div className="w-full flex justify-between items-center">
                                    <p>Estado do Pagamento:</p>
                                    <span className={`ui-status-tag ${statusPaymentColor(itemSelected?.status) ?? ""}`}>
                                        {statusPayment(itemSelected?.status) ?? itemSelected?.status ?? "—"}
                                    </span>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data:</p>
                                    <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.created_at)).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Custo:</p>
                                    <p className="h-5 text-[#4B5563]">{(itemSelected?.custo)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>

                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Lucro:</p>
                                    <p className="h-5 text-[#4B5563]">{(itemSelected?.lucro)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Desconto:</p>
                                    <p className="h-5 text-[#4B5563]">{(itemSelected?.desconto)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>

                                </div>
                               

                            </div>   

                        </div>

                        <p className="text-[#143163] font-semibold pt-2">Dados do utilizador (Conta de origem)</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10"></div>
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>Utilizador:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.account_type === "User" ? `${itemSelected?.account?.first_name} ${itemSelected?.account?.last_name}` : `${itemSelected?.account?.business_name}`}</p>
                                        <CopyTextButton value={itemSelected?.account_type === "User" ? `${itemSelected?.account?.first_name} ${itemSelected?.account?.last_name}` : itemSelected?.account?.business_name} label="utilizador" />
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Telemóvel:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.account?.phone_number}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Tipo de Conta:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.account_type === "User" ? "Particular" : "Empresa"}</p>
                                </div>

                            </div>
                        </div>

                        <p className="text-[#143163] font-semibold pt-2">Detalhes do Pagamento</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10"></div>
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>Beneficiário:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.beneficiario ?? "N/A"}</p>
                                        <CopyTextButton value={itemSelected?.beneficiario} label="beneficiário" />
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Serviço:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.entity}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Produto:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.product_name}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Valor:</p>
                                    <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.body_request?.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                                </div>

                                 <div className="w-full flex justify-between items-center">
                                    <p>Token:</p>
                                    <p className="h-5 text-[#4B5563]">{itemSelected?.body_response?.token_recarga || "N/A"}</p>
                                </div>

                            </div>

                        </div>

                    </div>
                    </div>
                    <div className="ui-detail-sheet-footer">
                        <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                            Concluído
                        </Button>
                    </div>
                </SheetContent>

            </Sheet>
        </>
    )
}
