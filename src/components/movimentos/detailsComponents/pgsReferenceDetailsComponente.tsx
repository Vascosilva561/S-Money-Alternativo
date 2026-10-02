import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";
import { CopyTextButton } from "@/components/ui/copy-text-button";

type props = {
    itemSelected: any
}
export default function PgsReferencePaymentDetailsComponent({ itemSelected }: props) {

    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Informações Gerais do Pagamento por referência</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">

                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Movimento:</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.signal === "CREDIT" ? `Crédito` : "Débito"}</p>
                            <CopyTextButton value={itemSelected?.signal === "CREDIT" ? "Crédito" : "Débito"} label="movimento" />
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Transação:</p>
                        <p className="h-5 font-semibold text-[#4B5563]">{TypeTransaction(itemSelected?.type)}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Estado do Pagamento:</p>
                        <span className={`ui-status-tag ${statusMovimentoColor(statusMovimento(itemSelected))}`}>{statusMovimento(itemSelected)}</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Referência:</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.payment_references?.reference}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.payment_references?.reference} label="referência" />
                        </div>
                    </div>
                    
                    <div className="w-full flex justify-between items-center">
                        <p>Data:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.payment_references?.created_at)).toLocaleDateString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</p>
                    </div>
                </div>

            </div>


            <p className="text-[#143163] font-semibold pt-2">Dados do utilizador (Conta de origem)</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>Utilizador:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.account_type === "User" ? `${itemSelected?.account?.first_name} ${itemSelected?.account?.last_name}` : `${itemSelected?.account?.business_name}`}</p>
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
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>Id da transação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.payment_references?.id_transaction}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Id do Período:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.payment_references?.period_id}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Beneficiário :</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.payment_references?.reference || "N/A"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Valor:</p>
                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.payment_references?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
