import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import { statusPayment } from "../utils/statusPayment"
import { statusPaymentColor } from "../utils/statusPaymentColor"
import type { ReferencePaymentType } from "@/types/referencePayment"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: ReferencePaymentType | null
}

export default function DetalhesPagamentoReference({
    onClose,
    isOpen,
    itemSelected,
}: Props) {
    if (!itemSelected) return null

    const formatDate = (date?: string) => {
        if (!date) return "N/A"

        return new Date(date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    const formatAmount = (amount?: string) => {
        return Number(amount || 0).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    return (
        <Sheet onOpenChange={onClose} open={isOpen}>
            <SheetContent
                style={{ minWidth: "35%" }}
                className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none"
            >
                <div className="flex justify-between items-center w-full">
                    <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                        Detalhes do Pagamento por Referência
                    </SheetHeader>

                    <SheetClose className="cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="25" height="25" rx="8" />

                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.3173 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>
                </div>

                <div className="space-y-5 mt-5">
                    {/* INFORMAÇÕES GERAIS */}
                    <p className="font-semibold text-[#143163]">
                        Informações Gerais do Pagamento
                    </p>

                    <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8" />

                    <div className="w-full">
                        <div className="text-sm text-[#143163] space-y-2">

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>ID do pagamento:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.payment_id || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Código da entidade:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.entity_code || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Estado do pagamento:</p>

                                <span
                                    className={`h-6 rounded-full pr-4 pl-4 ${statusPaymentColor(
                                        itemSelected?.payment_status
                                    )}`}
                                >
                                    {statusPayment(itemSelected?.payment_status)}
                                </span>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Data da transação:</p>

                                <p className="text-[#4B5563] text-right">
                                    {formatDate(itemSelected?.transaction_datetime)}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Data do pagamento:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.payment_date
                                        ? new Date(
                                              `${itemSelected.payment_date}T${itemSelected.payment_time}`
                                          ).toLocaleString("pt-BR")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DETALHES */}
                    <p className="text-[#143163] font-semibold pt-2">
                        Detalhes do Pagamento
                    </p>

                    <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10" />

                    <div className="w-full">
                        <div className="text-sm text-[#143163] space-y-2">

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Referência:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.payment_reference || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Valor:</p>

                                <p className="text-[#4B5563] text-right">
                                    {formatAmount(itemSelected?.operation_amount)} Kz
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Data de processamento:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.processing_date || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Local do pagamento:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.payment_location?.trim() || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Produto:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.product_code || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Estado de processamento:</p>

                                <span
                                    className={`h-6 rounded-full pr-4 pl-4 ${statusPaymentColor(
                                        itemSelected?.prt_status
                                    )}`}
                                >
                                    {statusPayment(itemSelected?.prt_status)}
                                </span>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Estado MFT:</p>

                                <span
                                    className={`h-6 rounded-full pr-4 pl-4 ${statusPaymentColor(
                                        itemSelected?.mft_status
                                    )}`}
                                >
                                    {statusPayment(itemSelected?.mft_status)}
                                </span>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>ID do log:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.log_id || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Número do log:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.log_number || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Canal da referência:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.reference_channels?.join(", ") || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Código da moeda:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.currency_code || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* INFORMAÇÕES TÉCNICAS */}
                    <p className="text-[#143163] font-semibold pt-2">
                        Informações Técnicas
                    </p>

                    <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-10" />

                    <div className="w-full">
                        <div className="text-sm text-[#143163] space-y-2">

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Tipo de terminal:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.terminal_type || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>ID do terminal:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.terminal_id || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>NIB:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.nib || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>ID da transação local:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.local_transaction_id || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Período contabilístico:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.accounting_period || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Aplicação PDD:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.pdd_application || "N/A"}
                                </p>
                            </div>

                            <div className="w-full flex justify-between items-center gap-4">
                                <p>Taxa aplicada:</p>

                                <p className="text-[#4B5563] text-right">
                                    {itemSelected?.applied_fee ?? "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full p-2 mt-[40px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        type="button"
                    >
                        Concluído
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}