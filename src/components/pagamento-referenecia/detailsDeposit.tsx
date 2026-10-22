import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { tipo_de_Terminal } from "@/components/utils/origemMovimento"
import { statusPaymentColor } from "@/components/utils/statusPaymentColor"
import type { ReferenceDepositType } from "@/types/reference_deposit"
import { X } from "lucide-react"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: ReferenceDepositType | null
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ui-gpo-detail-row">
            <p className="ui-gpo-detail-label">{label}</p>
            <div className="ui-gpo-detail-value">{children}</div>
        </div>
    )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="ui-gpo-detail-section">
            <p className="font-semibold text-[#143163]">{title}</p>
            <div className="ui-gpo-detail-divider" />
            <div className="ui-gpo-detail-list">{children}</div>
        </section>
    )
}

function paymentStatusLabel(status?: string) {
    switch (status?.toUpperCase()) {
        case "SUCCESS":
        case "PAID":
        case "ACCEPTED":
        case "COMPLETED":
            return "Concluído"
        case "PENDING":
        case "PROCESSING":
            return "Pendente"
        case "ERROR":
        case "FAILED":
        case "REJECTED":
        case "CANCELED":
        case "CANCELLED":
            return "Falhou"
        case "REFUNDED":
            return "Reembolsado"
        default:
            return status || "—"
    }
}

export default function DetalhesDepositoReference({ onClose, isOpen, itemSelected }: Props) {
    if (!itemSelected) return null

    const channel = tipo_de_Terminal.find((terminal) => terminal.value === itemSelected.channel)?.description || itemSelected.channel || "—"
    const accountName = itemSelected.account?.business_name ||
        [itemSelected.account?.first_name, itemSelected.account?.last_name].filter(Boolean).join(" ") ||
        itemSelected.account?.name || "—"

    return (
        <Sheet onOpenChange={(open) => { if (!open) onClose() }} open={isOpen}>
            <SheetContent className="ui-detail-sheet ui-detail-sheet--structured ui-gpo-detail-sheet w-full">
                <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Detalhes do Depósito por Referência</SheetTitle>
                        <SheetDescription>Consulte as informações e o estado deste depósito.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar detalhes do depósito por referência" className="ui-gpo-sheet-close">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-detail-sheet-body ui-gpo-detail-body">
                    <div className="ui-gpo-detail-content">
                        <DetailSection title="Informações Gerais do Pagamento">
                            <DetailRow label="Nome do Titular:">{accountName}</DetailRow>
                            <DetailRow label="E-mail:">{itemSelected.account?.email || "—"}</DetailRow>
                            <DetailRow label="Estado do Pagamento:">
                                <span className={"ui-status-tag " + (statusPaymentColor(itemSelected.status) || "bg-[#EEF1F5] text-[#637590]")}>
                                    {paymentStatusLabel(itemSelected.status)}
                                </span>
                            </DetailRow>
                            <DetailRow label="Data de Criação:">{formatDateTime(itemSelected.created_at)}</DetailRow>
                        </DetailSection>

                        <DetailSection title="Detalhes do Depósito">
                            <DetailRow label="ID do Depósito:">
                                <span className="break-all">{itemSelected.id || "—"}</span>
                            </DetailRow>
                            <DetailRow label="ID da Transação:">
                                <span className="break-all">{itemSelected.id_transaction || "—"}</span>
                            </DetailRow>
                            <DetailRow label="Referência:">
                                <span className="inline-flex max-w-full items-center justify-end gap-1.5">
                                    <span className="break-all">{itemSelected.reference || "—"}</span>
                                    {itemSelected.reference && <CopyTextButton value={itemSelected.reference} label="referência" />}
                                </span>
                            </DetailRow>
                            <DetailRow label="Canal:">{channel}</DetailRow>
                            <DetailRow label="ID do Período:">
                                <span className="break-all">{itemSelected.period_id || "—"}</span>
                            </DetailRow>
                            <DetailRow label="Valor:">
                                <span className="font-semibold">{formatCurrency(itemSelected.amount, "Kz")}</span>
                            </DetailRow>
                            <DetailRow label="Última Atualização:">{formatDateTime(itemSelected.updated_at)}</DetailRow>
                        </DetailSection>
                    </div>
                </div>

                <SheetFooter className="ui-detail-sheet-footer">
                    <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                        Concluído
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
