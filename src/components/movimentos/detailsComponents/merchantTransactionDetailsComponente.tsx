import type { ActivityItem } from "@/components/interface/merchantTransaction";
import { formatNumberPtAO } from "@/components/utils/formmat";
import { TypeTransaction } from "@/components/utils/getTypeMoviment";
import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";


type props = {
    itemSelected: ActivityItem | null; // ou qualquer outro tipo que represente o item selecionado
}

// Traduz o campo "operation" pra português
function traduzOperacao(operation: string | undefined) {
    if(operation === undefined) return "—";
    const map: Record<string, string> = {
        withdraw: "Levantamento",
        deposit: "Depósito",
        transfer: "Transferência",
    };
    return map[operation] ?? operation;
}



export default function MerchantTransactionDetailsComponent({ itemSelected }: props) {

    const merchantTx = itemSelected?.detalhe?.merchant_transaction;
    // Resolve o nome de exibição de uma conta (merchant ou customer) dentro da MerchantTransaction
    function resolveAccountName(
        accountType: "merchant" | "customer" | undefined,
        merchantTx: any
    ): string {
        if (accountType === "merchant") {
            return merchantTx?.merchant?.business_name ?? "—";
        }
        if (accountType === "customer") {
            const user = merchantTx?.user;
            return user ? `${user.first_name} ${user.last_name}` : "—";
        }
        return "—";
    }
    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Resumo da Transação</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">

                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Movimento:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.signal === "CREDIT" ? "Crédito" : "Débito"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Transação:</p>
                        <p className="h-5 text-[#4B5563]">{TypeTransaction(itemSelected?.type)}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Tipo de Conta:</p>
                        <p className="h-5 text-[#4B5563]">{itemSelected?.account_type}</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Operação:</p>
                        <p className="h-5 text-[#4B5563]">{traduzOperacao(merchantTx?.operation)}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Referência:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.reference}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Referência Externa:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.external_reference ?? "—"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Estado:</p>
                        <span className={`h-6 rounded-full px-3 grid place-items-center ${statusMovimentoColor(statusMovimento(itemSelected))}`}>
                            {statusMovimento(itemSelected)}
                        </span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Data da Transação:</p>
                        <p className="h-5 text-[#4B5563]">
                            {merchantTx?.created_at &&
                                new Date(merchantTx.created_at).toLocaleDateString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                        </p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Valor:</p>
                        <p className="h-5 text-[#4B5563]">
                            {formatNumberPtAO(Number(merchantTx?.amount ?? 0), 2)} Kz
                        </p>
                    </div>
                     <div className="w-full flex justify-between items-center">
                        <p>Conta de Origem:</p>
                        <p className="h-5 text-[#4B5563]">
                            {resolveAccountName(merchantTx?.source_type, merchantTx)}
                            <span className="text-[rgb(125,140,166)] text-[11px] ml-1">
                                ({merchantTx?.source_type === "merchant" ? "Empresa" : "Cliente"})
                            </span>
                        </p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Conta de Destino:</p>
                        <p className="h-5 text-[#4B5563]">
                            {resolveAccountName(merchantTx?.destination_type, merchantTx)}
                            <span className="text-[#7D8CA6] text-[11px] ml-1">
                                ({merchantTx?.destination_type === "merchant" ? "Empresa" : "Cliente"})
                            </span>
                        </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 mt-2">
                        <p className="font-semibold text-[#143163] mb-1">Empresa</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Nome do Negócio:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.merchant?.business_name}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>NIF:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.merchant?.nif}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Email:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.merchant?.email ?? "—"}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 mt-2">
                        <p className="font-semibold text-[#143163] mb-1">Cliente</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Nome:</p>
                        <p className="h-5 text-[#4B5563]">
                            {merchantTx?.user?.first_name} {merchantTx?.user?.last_name}
                        </p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Telefone:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.user?.phone_number ?? "—"}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Nível:</p>
                        <p className="h-5 text-[#4B5563]">{merchantTx?.user?.level}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}