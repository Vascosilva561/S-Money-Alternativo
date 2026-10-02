import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";
import { CopyTextButton } from "@/components/ui/copy-text-button";

type props = {
    itemSelected: any
}
export default function PgsPaymentDetailsComponent({ itemSelected }: props) {
    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Informações Gerais do Pagamento</p>
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
                        <p>Data:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.pgs_payment?.created_at)).toLocaleDateString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Custo:</p>
                        <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.pgs_payment?.custo)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>

                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Lucro:</p>
                        <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.pgs_payment?.lucro)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Desconto:</p>
                        <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.pgs_payment?.desconto)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>

                    </div>

                </div>

            </div>


            <p className="text-[#143163] font-semibold pt-2">Dados do utilizador (Conta de origem)</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
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
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.pgs_payment?.account_type === "User" ? "Particular" : "Empresa"}</p>
                    </div>

                </div>
            </div>


            <p className="text-[#143163] font-semibold pt-2">Detalhes do Pagamento</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>Beneficiário:</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.pgs_payment?.body_request?.unitel_telefone || itemSelected?.detalhe?.pgs_payment?.beneficiario}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.pgs_payment?.body_request?.unitel_telefone || itemSelected?.detalhe?.pgs_payment?.beneficiario} label="beneficiário" />
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Serviço:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.pgs_payment?.entity}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Produto:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.pgs_payment?.product_name}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Valor:</p>
                        <p className="h-5 font-semibold text-[#4B5563]">{itemSelected?.detalhe?.pgs_payment?.body_request?.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>

                </div>

            </div>


        </div>
    )
}
