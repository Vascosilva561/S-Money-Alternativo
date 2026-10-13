import { PegaDestinoMovimento } from "@/components/utils/destinoMovimento";
import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { PegaOrigemMovimento } from "@/components/utils/origemMovimento";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";

type props = {
    itemSelected: any
}
export default function CampaignDetailsComponent({ itemSelected }: props) {
    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Resumo da Promoção</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="text-sm text-[#143163] space-y-1">

                <div className="w-full flex justify-between items-center">
                    <p>Tipo de Movimento:</p>
                    <p className="h-5 text-[#4B5563]">{itemSelected?.signal === "CREDIT" ? `Crédito` : "Débito"}</p>
                </div>
                <div className="w-full flex justify-between items-center">
                    <p>Tipo de Transação:</p>
                    <p className="h-5 text-[#4B5563]">{TypeTransaction(itemSelected?.type) || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between items-center">
                    <p>Origem:</p>
                    <p className="h-5 text-[#4B5563]">{PegaOrigemMovimento(itemSelected?.type) || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between items-center">
                    <p>Destino:</p>
                    <p className="h-5 text-[#4B5563]">{PegaDestinoMovimento(itemSelected?.type) || "N/A"}</p>
                </div>

                <div className="w-full flex justify-between items-center">
                    <p>Valor da Promoção:</p>
                    <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.deposit_gpo_frame?.amount?.toLocaleString('pt-BR',
                         { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } kz</p>
                </div>

                <div className="w-full flex justify-between items-center">
                    <p>Estado:</p>
                    <span className={`h-6 rounded-full pr-4 pl-4  ${statusMovimentoColor(statusMovimento(itemSelected))}`}>{statusMovimento(itemSelected)}</span>
                </div>

                <div className="w-full flex justify-between items-center">
                    <p>Data de início:</p>
                    <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.deposit_gpo_frame?.created_at)).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}</p>
                </div>
                <div className="w-full flex justify-between items-center">
                    <p>Data de término:</p>
                    <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.deposit_gpo_frame?.created_at)).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}</p>
                </div>

                <div className="w-full flex justify-between items-center">
                    <p>Data de criação:</p>
                    <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.deposit_gpo_frame?.created_at)).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}</p>
                </div>

            </div>

        </div>
    )
}