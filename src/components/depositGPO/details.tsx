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
import { statusDepositColor } from "@/components/utils/statusDepositColor"
import { statusDeposit } from "@/components/utils/statusDeposit"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import type { DepositRecord } from "@/types/depotiType"
import { X } from "lucide-react"

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: unknown
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

export default function DetalhesDeposito({ onClose, isOpen, itemSelected }: Props) {
    if (!itemSelected || typeof itemSelected !== "object") return null
    const deposit = itemSelected as Partial<DepositRecord>

    return (
        <Sheet onOpenChange={(open) => { if (!open) onClose() }} open={isOpen}>
            <SheetContent className="ui-detail-sheet ui-detail-sheet--structured ui-gpo-detail-sheet w-full">
                <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Detalhes do Depósito</SheetTitle>
                        <SheetDescription>Consulte as informações e o estado deste depósito.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar detalhes do depósito GPO" className="ui-gpo-sheet-close">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-detail-sheet-body ui-gpo-detail-body">
                    <div className="ui-gpo-detail-content">
                        <DetailSection title="Resumo da Transação">
                            <DetailRow label="Referência:">{deposit.payment_reference || "—"}</DetailRow>
                            <DetailRow label="Estado do Depósito:">
                                <span className={"ui-status-tag " + (statusDepositColor(deposit.status || "") || "bg-[#EEF1F5] text-[#637590]")}>
                                    {statusDeposit(deposit.status || "") || deposit.status || "—"}
                                </span>
                            </DetailRow>
                            <DetailRow label="Data da Geração de Ref:">{formatDateTime(deposit.created_at)}</DetailRow>
                            <DetailRow label="Data do Pagamento:">{formatDateTime(deposit.created_at)}</DetailRow>
                            <DetailRow label="Canal de Entrada:">{deposit.canal || "—"}</DetailRow>
                            <DetailRow label="Valor Recebido:">
                                <span className="font-semibold">{formatCurrency(deposit.amount, "Kz")}</span>
                            </DetailRow>
                            <DetailRow label="Saldo Antes:">
                                {deposit.balance == null ? "—" : formatCurrency(deposit.balance, "Kz")}
                            </DetailRow>
                            <DetailRow label="Saldo Após:">
                                {deposit.balance_after == null ? "—" : formatCurrency(deposit.balance_after, "Kz")}
                            </DetailRow>
                        </DetailSection>

                        <DetailSection title="Dados do Utilizador">
                            <DetailRow label="Nome do Utilizador:">{deposit.user_name || "—"}</DetailRow>
                            <DetailRow label="Telemóvel:">{deposit.user_phone_number || deposit.phone_number || "—"}</DetailRow>
                            <DetailRow label="Tipo de Conta:">
                                {deposit.account_type === "User" ? "Particular" : deposit.account_type === "Merchant" ? "Empresa" : deposit.account_type || "—"}
                            </DetailRow>
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
