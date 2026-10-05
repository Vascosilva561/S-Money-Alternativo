
import { api } from "@/api"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import type { ReferenceConfiguration } from "@/types/configMerchant"
import type { ReferencePool } from "@/types/poolsType"
import type { PaymentReference } from "@/types/references"
import { getReferenceStatusClass, getReferenceStatusLabel } from "@/components/utils/referenceStatus"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { LoaderCircle, Locate, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: ReferencePool | ReferenceConfiguration | PaymentReference | null
}

export default function DetailsPools({ onClose, isOpen, itemSelected }: Props) {
    const isPool = !!itemSelected && "reference_length" in itemSelected
    const isConfig = !!itemSelected && "client_id" in itemSelected
    const isReference = !!itemSelected && "payment_reference" in itemSelected

    const [isLoadingAloca, setIsLoading] = useState(false)
    const queryClient = useQueryClient()

    const alocarConfig = async () => {
        if (!isConfig || !itemSelected?.id) {
            toast.error("Erro ao obter os detalhes da configuração")
            return
        }

        try {
            setIsLoading(true)

            await api.put(
                `front/merchant/somoney_reference/client-configs/${itemSelected.id}/allocation`
            )

            await queryClient.invalidateQueries({
                queryKey: ["ConfigIndicacoes"],
            })

            toast.success("Configuração alocada com sucesso!")
            onClose()
        } catch (error) {
            console.log(error)

            if (isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error ||
                    "Não foi possível alocar a configuração"
                )
            } else {
                toast.error("Não foi possível alocar a configuração")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const formatAmount = (value: number | null) => {
        if (value === null || value === undefined) return "—"

        return value.toLocaleString("pt-AO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const formatDate = (value: string | null) => {
        if (!value) return "—"

        return new Date(`${value}T00:00:00`).toLocaleDateString("pt-AO")
    }

    const getTitle = () => {
        if (isPool) return "Detalhes do pool"
        if (isConfig) return "Detalhes da configuração"
        if (isReference) return "Detalhes da referência"

        return "Detalhes"
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
                <div className="ui-detail-sheet-header flex items-start justify-between gap-4 w-full">
                    <SheetHeader className="p-0">
                        <SheetTitle>{getTitle()}</SheetTitle>
                        <SheetDescription>Consulte os dados associados a este registo.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar detalhes" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-detail-sheet-body flex flex-col gap-4">
                    <div className="w-full">
                        <p className="font-semibold text-[#143163]">Detalhes</p>
                        <div className="mt-2 h-px w-full bg-[#E3EAF4]" aria-hidden="true" />
                    </div>

                    {itemSelected && (
                        <div className="w-full">
                            <div className={`text-sm text-[#143163] ${isReference ? "" : "space-y-4"}`}>

                                {/* POOL */}
                                {isPool && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>ID:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.id}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-start gap-4">
                                                <p>Descrição:</p>
                                                <p className="text-[#4B5563] text-right max-w-[65%]">
                                                    {itemSelected.description}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Tamanho da referência:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.reference_length} dígitos
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* CONFIGURAÇÃO */}
                                {isConfig && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>ID:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.id}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Cliente:</p>
                                                <p className="text-[#4B5563] text-right max-w-[65%]">
                                                    {itemSelected.client_id}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Pool:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.pool_id}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Perfil:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.profile}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Volume médio diário:</p>
                                                <p className="text-[#4B5563] text-right">
                                                    {itemSelected.average_daily_volume?.toLocaleString("pt-AO") || "—"}
                                                </p>
                                            </div>

                                            <div className="w-full flex justify-between items-center gap-4">
                                                <p>Alocar config:</p>

                                                <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={alocarConfig} disabled={isLoadingAloca}>
                                                    {isLoadingAloca ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Locate aria-hidden="true" />}
                                                    {isLoadingAloca ? "A alocar…" : "Alocar configuração"}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* REFERÊNCIA */}
                                {isReference && (
                                    <>
                                        <div className="w-full flex justify-between items-center">
                                            <p>Referência de pagamento:</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="font-semibold">{itemSelected.payment_reference}</span>
                                                <CopyTextButton value={itemSelected.payment_reference} label="referência de pagamento" />
                                            </div>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Cliente:</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="font-semibold">{itemSelected.merchant.business_name}</span>
                                                <CopyTextButton value={itemSelected.merchant.business_name} label="empresa" />
                                            </div>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Nº do cliente:</p>
                                            <p className="text-[#4B5563] text-right font-medium">
                                                {itemSelected.merchant.merchant_payment_number}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Email:</p>
                                            <p className="text-[#4B5563] text-right max-w-[65%] break-all">
                                                {itemSelected.merchant.email}
                                            </p>
                                        </div>

                                        <div aria-hidden="true" className="my-2 h-px w-full bg-[#E3EAF4]" />

                                        <div className="w-full flex justify-between items-center">
                                            <p>Referência da transação:</p>
                                            <p className="text-[#4B5563] text-right font-medium">
                                                {itemSelected.transaction_reference}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Estado:</p>
                                            <span className={`ui-status-tag ${getReferenceStatusClass(itemSelected.status)}`}>
                                                {getReferenceStatusLabel(itemSelected.status)}
                                            </span>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Data de início:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {formatDate(itemSelected.payment_start_date)}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Prazo de pagamento:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {formatDate(itemSelected.payment_deadline)}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center">
                                            <p>Linhas:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.number_of_lines}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-start">
                                            <p>Texto do recibo:</p>
                                            <p className="text-[#4B5563] text-right max-w-[65%]">
                                                {itemSelected.receipt_text}
                                            </p>
                                        </div>

                                        <div aria-hidden="true" className="my-2 h-px w-full bg-[#E3EAF4]" />

                                        <div className="w-full flex justify-between items-center">
                                            <p>Valor fixo:</p>
                                            <p className={`text-[#4B5563] text-right ${itemSelected.fixed_amount !== null ? "font-semibold" : ""}`}>
                                                {formatAmount(itemSelected.fixed_amount)}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Valor mínimo:</p>
                                            <p className={`text-[#4B5563] text-right ${itemSelected.minimum_amount !== null ? "font-semibold" : ""}`}>
                                                {formatAmount(itemSelected.minimum_amount)}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Valor máximo:</p>
                                            <p className={`text-[#4B5563] text-right ${itemSelected.maximum_amount !== null ? "font-semibold" : ""}`}>
                                                {formatAmount(itemSelected.maximum_amount)}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Uso único:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.single_use ? "Sim" : "Não"}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>NIB:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.nib || "—"}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Opcional 1:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.optional_1 || "—"}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Opcional 2:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.optional_2 || "—"}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <p>Opcional 3:</p>
                                            <p className="text-[#4B5563] text-right">
                                                {itemSelected.optional_3 || "—"}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </div>
                <div className="ui-detail-sheet-footer">
                    <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                        Concluído
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

