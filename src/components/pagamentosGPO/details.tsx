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
import { X } from "lucide-react"

import { statusPaymentGPOColor } from "@/components/utils/statusPaymentGPO"
import { statusPaymentGPOLabel } from "@/components/utils/statusPaymentGPOLabel"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import type { GpoPayment } from "@/types/gpoPayment"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: GpoPayment | undefined
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

export default function DetalhesPagamentoGPO({ onClose, isOpen, itemSelected }: Props) {
    if (!itemSelected) return null

    return (
        <Sheet onOpenChange={(open) => { if (!open) onClose() }} open={isOpen}>
            <SheetContent className="ui-detail-sheet ui-detail-sheet--structured ui-gpo-detail-sheet w-full">
                <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Detalhes do pagamento GPO</SheetTitle>
                        <SheetDescription>Consulte as informações e o estado deste pagamento.</SheetDescription>
                    </SheetHeader>
                    <SheetClose
                        aria-label="Fechar detalhes do pagamento GPO"
                        className="ui-gpo-sheet-close"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-detail-sheet-body ui-gpo-detail-body">
                    <div className="ui-gpo-detail-content">
                        <DetailSection title="Resumo do pagamento">
                            <DetailRow label="Referência:">
                                {itemSelected.payment_reference || "—"}
                            </DetailRow>
                            <DetailRow label="Referência da transação:">
                                {itemSelected.transaction_reference || "—"}
                            </DetailRow>
                            <DetailRow label="Estado do pagamento:">
                                <span className={"ui-status-tag " + statusPaymentGPOColor(itemSelected.status)}>
                                    {statusPaymentGPOLabel(itemSelected.status)}
                                </span>
                            </DetailRow>
                            <DetailRow label="Valor:">
                                <span className="font-semibold">{formatCurrency(itemSelected.amount, "Kz")}</span>
                            </DetailRow>
                            <DetailRow label="Telefone do pagamento:">
                                {itemSelected.phone_number || "—"}
                            </DetailRow>
                            <DetailRow label="Data de criação:">
                                {formatDateTime(itemSelected.created_at)}
                            </DetailRow>
                            <DetailRow label="Última actualização:">
                                {formatDateTime(itemSelected.updated_at)}
                            </DetailRow>
                            <DetailRow label="ID externo do pagamento:">
                                {itemSelected.external_payment_id || "—"}
                            </DetailRow>
                            <DetailRow label="ID externo do cliente:">
                                {itemSelected.external_customer_id || "—"}
                            </DetailRow>
                        </DetailSection>

                        <DetailSection title="Dados do comerciante">
                            <DetailRow label="Empresa:">
                                {itemSelected.merchant?.business_name || "—"}
                            </DetailRow>
                            <DetailRow label="Número do comerciante:">
                                {itemSelected.merchant_number || "—"}
                            </DetailRow>
                            <DetailRow label="Email:">
                                {itemSelected.merchant?.email || "—"}
                            </DetailRow>
                            <DetailRow label="Telefone:">
                                {itemSelected.merchant?.phone_number || "—"}
                            </DetailRow>
                            <DetailRow label="NIF:">
                                {itemSelected.merchant?.nif || "—"}
                            </DetailRow>
                        </DetailSection>
                    </div>
                </div>

                <SheetFooter className="ui-detail-sheet-footer">
                    <Button
                        onClick={onClose}
                        className="ui-detail-sheet-primary-action w-full"
                        type="button"
                        variant="brand"
                    >
                        Concluído
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}