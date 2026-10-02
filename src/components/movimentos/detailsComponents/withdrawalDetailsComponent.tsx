import { statusMovimento } from "@/components/utils/statusMoviment";
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor";
import { CopyTextButton } from "@/components/ui/copy-text-button";
import bancos from "../../json/bancos.json"
import { TypeTransaction } from "@/components/utils/getTypeMoviment";

type props = {
    itemSelected: any
}
export default function WithdrawalDetailsComponent({ itemSelected }: props) {

    const codigoDoBanco = itemSelected?.iban?.slice(4, 8) as keyof typeof bancos | undefined; // Pula 'AOxx' e pega os próximos 4 dígitos

    const nomeBanco = (codigoDoBanco && bancos[codigoDoBanco]) || "Banco não encontrado";

    return (
        <div className="space-y-5 mt-5">
            <p className="font-semibold text-[#143163]">Resumo da Operação</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>

            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>ID do Pedido:</p>
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
                        <p>Valor:</p>
                        <p className="h-5 font-semibold text-[#4B5563]">{(itemSelected?.detalhe?.withdrawal?.amount)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Data do Pedido:</p>
                        <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.withdrawal?.created_at)).toLocaleDateString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Estado do Deposito:</p>
                        <span className={`ui-status-tag ${statusMovimentoColor(statusMovimento(itemSelected))}`}>{statusMovimento(itemSelected)}</span>
                    </div>

                    <div className="w-full flex justify-between items-center">
                        <p>Saldo Antes:</p>
                        <div className="h-5 text-[#EF4A00] flex space-x-1 items-center">
                            <p className="text-[#4B5563]">{(itemSelected?.detalhe?.withdrawal?.balance_before)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                            <p className="text-[#EF4A00] font-semibold">(-{(itemSelected?.detalhe?.withdrawal?.amount)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz)</p>
                        </div>

                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Saldo Após:</p>
                        <p className="h-5 text-[#4B5563]">{(itemSelected?.detalhe?.withdrawal?.balance_after)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz</p>
                    </div>
                    {itemSelected?.detalhe?.withdrawal?.satus !== "PENDING" &&
                        <div className="w-full flex justify-between items-center">
                            <p>Responsável:</p>
                            <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.withdrawal?.responsavel?.name}</p>
                        </div>}
                    {itemSelected?.detalhe?.withdrawal?.status === "ACCEPTED" &&
                        <>
                            <div className="w-full flex justify-between items-center">
                                <p>Data da Confirmação:</p>
                                <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.withdrawal?.updated_at))?.toLocaleDateString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</p>
                            </div>
                            <p>Comprovativo de Pagamento:</p>
                            <a href={itemSelected?.detalhe?.withdrawal?.comprovativo} target="_blank" className="flex items-center justify-center space-x-2 w-full p-2 mt-[10px] mb-10 rounded-[6px] cursor-pointer bg-[#F5F6FA]
                                          transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold text-[10px]"
                                type="button">
                                <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.46997 13.8464C8.17697 13.5534 8.17697 13.0784 8.46997 12.7854C8.76297 12.4924 9.23801 12.4924 9.53101 12.7854L11.251 14.5054V3.31641C11.251 2.90241 11.587 2.56641 12.001 2.56641C12.415 2.56641 12.751 2.90241 12.751 3.31641V14.5054L14.4709 12.7854C14.7639 12.4924 15.239 12.4924 15.532 12.7854C15.825 13.0784 15.825 13.5534 15.532 13.8464L12.532 16.8464C12.463 16.9154 12.3801 16.9704 12.2881 17.0084C12.1961 17.0464 12.099 17.0664 12.001 17.0664C11.903 17.0664 11.8061 17.0464 11.7141 17.0084C11.6221 16.9704 11.539 16.9154 11.47 16.8464L8.46997 13.8464ZM18 9.56641C17.586 9.56641 17.25 9.90241 17.25 10.3164C17.25 10.7304 17.586 11.0664 18 11.0664C19.577 11.0664 20.25 11.7394 20.25 13.3164V18.3164C20.25 19.8934 19.577 20.5664 18 20.5664H6C4.423 20.5664 3.75 19.8934 3.75 18.3164V13.3164C3.75 11.7394 4.423 11.0664 6 11.0664C6.414 11.0664 6.75 10.7304 6.75 10.3164C6.75 9.90241 6.414 9.56641 6 9.56641C3.582 9.56641 2.25 10.8984 2.25 13.3164V18.3164C2.25 20.7344 3.582 22.0664 6 22.0664H18C20.418 22.0664 21.75 20.7344 21.75 18.3164V13.3164C21.75 10.8984 20.418 9.56641 18 9.56641Z" fill="#487FFF" />
                                </svg>
                                <p>Comprovativo {nomeBanco}.pdf</p>
                            </a>
                        </>
                    }
                    {itemSelected?.detalhe?.withdrawal?.status === "REJECTED" &&
                        <>
                            <div className="w-full flex justify-between items-center">
                                <p>Data da Recusa:</p>
                                <p className="h-5 text-[#4B5563]">{(new Date(itemSelected?.detalhe?.withdrawal?.updated_at))?.toLocaleDateString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</p>
                            </div>
                            <div className="w-full flex justify-between items-center">
                                <p>Motivo:</p>
                                <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.withdrawal?.motivo} </p>
                            </div>
                        </>
                    }
                </div>

            </div>


            <p className="text-[#143163] font-semibold pt-2">Dados do utilizador</p>
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
                        <p className="h-5 text-[#4B5563]">{itemSelected?.account_type === "User" ? "Particular" : "Empresa"}</p>
                    </div>

                </div>
            </div>

            <p className="text-[#143163] font-semibold pt-2">Dados Bancários</p>
            <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8"></div>
            <div className="w-full">
                <div className="text-sm text-[#143163] space-y-1">
                    <div className="w-full flex justify-between items-center">
                        <p>IBAN de Destino:</p>
                        <div className="flex items-center space-x-1">
                            <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.withdrawal?.iban}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.withdrawal?.iban} label="IBAN de destino" />
                            {/* <svg onClick={() => Copiar(itemSelected?.detalhe?.withdrawal?.iban)} className="cursor-pointer" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5827 3.89583H15.3352C15.2462 2.74633 14.5019 2.0625 13.291 2.0625H8.70768C7.49677 2.0625 6.75245 2.74633 6.66353 3.89583H6.41602C4.19952 3.89583 2.97852 5.11683 2.97852 7.33333V16.5C2.97852 18.7165 4.19952 19.9375 6.41602 19.9375H15.5827C17.7992 19.9375 19.0202 18.7165 19.0202 16.5V7.33333C19.0202 5.11683 17.7992 3.89583 15.5827 3.89583ZM8.02018 4.125C8.02018 3.58508 8.16777 3.4375 8.70768 3.4375H13.291C13.8309 3.4375 13.9785 3.58508 13.9785 4.125V5.04167C13.9785 5.58158 13.8309 5.72917 13.291 5.72917H8.70768C8.16777 5.72917 8.02018 5.58158 8.02018 5.04167V4.125ZM17.6452 16.5C17.6452 17.9456 17.0283 18.5625 15.5827 18.5625H6.41602C4.97043 18.5625 4.35352 17.9456 4.35352 16.5V7.33333C4.35352 5.88775 4.97043 5.27083 6.41602 5.27083H6.66353C6.75245 6.42033 7.49677 7.10417 8.70768 7.10417H13.291C14.5019 7.10417 15.2462 6.42033 15.3352 5.27083H15.5827C17.0283 5.27083 17.6452 5.88775 17.6452 7.33333V16.5ZM14.4368 11C14.4368 11.3795 14.1288 11.6875 13.7493 11.6875H8.24935C7.86985 11.6875 7.56185 11.3795 7.56185 11C7.56185 10.6205 7.86985 10.3125 8.24935 10.3125H13.7493C14.1288 10.3125 14.4368 10.6205 14.4368 11ZM12.6035 14.6667C12.6035 15.0462 12.2955 15.3542 11.916 15.3542H8.24935C7.86985 15.3542 7.56185 15.0462 7.56185 14.6667C7.56185 14.2872 7.86985 13.9792 8.24935 13.9792H11.916C12.2955 13.9792 12.6035 14.2872 12.6035 14.6667Z" fill="#4B5563" />
                            </svg> */}

                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Nome do Banco:</p>
                        <p className="h-5 text-[#4B5563]">{nomeBanco}</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p>Nome do Beneficiário:</p>
                        <div className="flex items-center space-x-1">
                            <p className="h-5 text-[#4B5563]">{itemSelected?.detalhe?.withdrawal?.beneficiario}</p>
                            <CopyTextButton value={itemSelected?.detalhe?.withdrawal?.beneficiario} label="beneficiário" />
                            {/* <svg onClick={() => Copiar(itemSelected?.detalhe?.withdrawal?.beneficiario)} className="cursor-pointer" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5827 3.89583H15.3352C15.2462 2.74633 14.5019 2.0625 13.291 2.0625H8.70768C7.49677 2.0625 6.75245 2.74633 6.66353 3.89583H6.41602C4.19952 3.89583 2.97852 5.11683 2.97852 7.33333V16.5C2.97852 18.7165 4.19952 19.9375 6.41602 19.9375H15.5827C17.7992 19.9375 19.0202 18.7165 19.0202 16.5V7.33333C19.0202 5.11683 17.7992 3.89583 15.5827 3.89583ZM8.02018 4.125C8.02018 3.58508 8.16777 3.4375 8.70768 3.4375H13.291C13.8309 3.4375 13.9785 3.58508 13.9785 4.125V5.04167C13.9785 5.58158 13.8309 5.72917 13.291 5.72917H8.70768C8.16777 5.72917 8.02018 5.58158 8.02018 5.04167V4.125ZM17.6452 16.5C17.6452 17.9456 17.0283 18.5625 15.5827 18.5625H6.41602C4.97043 18.5625 4.35352 17.9456 4.35352 16.5V7.33333C4.35352 5.88775 4.97043 5.27083 6.41602 5.27083H6.66353C6.75245 6.42033 7.49677 7.10417 8.70768 7.10417H13.291C14.5019 7.10417 15.2462 6.42033 15.3352 5.27083H15.5827C17.0283 5.27083 17.6452 5.88775 17.6452 7.33333V16.5ZM14.4368 11C14.4368 11.3795 14.1288 11.6875 13.7493 11.6875H8.24935C7.86985 11.6875 7.56185 11.3795 7.56185 11C7.56185 10.6205 7.86985 10.3125 8.24935 10.3125H13.7493C14.1288 10.3125 14.4368 10.6205 14.4368 11ZM12.6035 14.6667C12.6035 15.0462 12.2955 15.3542 11.916 15.3542H8.24935C7.86985 15.3542 7.56185 15.0462 7.56185 14.6667C7.56185 14.2872 7.86985 13.9792 8.24935 13.9792H11.916C12.2955 13.9792 12.6035 14.2872 12.6035 14.6667Z" fill="#4B5563" />
                            </svg> */}
                        </div>
                    </div>

                </div>

            </div>


        </div>
    )
}
