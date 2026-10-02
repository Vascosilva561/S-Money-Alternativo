import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";
import { CopyTextButton } from "@/components/ui/copy-text-button";

type props = {
    itemSelected: any
}
export default function TransactionDetailsComponent({ itemSelected }: props) {
    console.log((Number(itemSelected?.detalhe?.transaction?.balance_receiver), Number(itemSelected?.detalhe?.amount)))
    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Resumo da Transacção</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>ID da Transação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.id}</p>
                    </div>
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
                        <p>Data:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.transaction?.created_at)).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Estado do Deposito:</p>
                        <span className={`ui-status-tag ${statusMovimentoColor(statusMovimento(itemSelected))}`}>{statusMovimento(itemSelected)}</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Valor da Transação:</p>
                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.transaction?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Taxa/Comissão</p>
                        <p className="h-5 text-[#4B5563]">indefinida por enquanto</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Descrição da Operação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.description}</p>
                    </div>

                </div>

            </div>


            <p className="text-[#143163] font-semibold pt-2">Dados do Remetente (Conta de Origem)</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>Utilizador remetente:</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.transaction?.sender_name}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.transaction?.sender_name} label="remetente" />
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>ID da Conta:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.sender_id}</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Telemóvel:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.contacto_sender}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Conta:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.sender_type === "User" ? "Particular" : "Empresa"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo antes da transação:</p>
                        <p className="h-5 text-[#4B5563]">{(Number(itemSelected?.detalhe?.transaction?.balance_sender) + Number(itemSelected?.detalhe?.transaction?.amount))?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo após transação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.balance_sender?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                </div>
            </div>

            <p className="text-[#143163] font-semibold pt-2">Dados do Destinatário (Conta de Destino)</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>Utilizador destinatário:</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.transaction?.receiver_name}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.transaction?.receiver_name} label="destinatário" />
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>ID da Conta:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.receiver_id}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Telemóvel:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.contacto_receiver}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Conta:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.receiver_type === "User" ? "Particular" : "Empresa"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo antes da transação:</p>
                        <p className="h-5 text-[#4B5563]">{(Number(itemSelected?.detalhe?.transaction?.balance_receiver) - Number(itemSelected?.detalhe?.transaction?.amount))?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo após transação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.transaction?.balance_receiver?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>

                </div>

            </div>

        </div>
    )
}
