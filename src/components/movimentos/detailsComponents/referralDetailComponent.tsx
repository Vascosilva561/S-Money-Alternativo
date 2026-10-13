import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";

type props = {
    itemSelected: any
}
export default function ReferralDetailsComponent({ itemSelected }: props) {
    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Resumo da Transação</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>ID da Transação:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.id}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Movimento:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.signal === "CREDIT" ? `Crédito` : "Débito"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Transação:</p>
                        <p className="h-5 text-[#4B5563]">{TypeTransaction(itemSelected?.type)}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>ID do Parceiro:</p>
                        <p className="h-5 text-[#4B5563]"></p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Referencia:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.deposit_gpo_frame?.payment_reference}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Estado do Deposito:</p>
                        <span className={`h-6 rounded-full pr-4 pl-4  ${statusMovimentoColor(statusMovimento(itemSelected))}`}>{statusMovimento(itemSelected)}</span>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Data da geração da Ref:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.deposit_gpo_frame?.created_at)).toLocaleDateString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Data do pagamento:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.deposit_gpo_frame?.created_at)).toLocaleDateString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Validade da Referência:</p>
                        <p className="h-5 text-[#4B5563]">{/*(new Date(itemSelected?.created_at)).toLocaleDateString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })*/}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Canal de Entrada:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.deposit_gpo_frame?.canal}</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Valor Recebido:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.deposit_gpo_frame?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Saldo Antes:</p>
                        <div className="flex items-center space-x-2">
                            <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.deposit_gpo_frame?.balance)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                            <p className="h-5 text-[#0D9339]">(+{(itemSelected?.detalhe?.deposit_gpo_frame?.amount)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz)</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo Após:</p>
                        <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.deposit_gpo_frame?.balance_after)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>

                </div>

            </div>

        </div>
    )
}