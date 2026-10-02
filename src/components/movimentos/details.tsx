import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet"

import DepositsDetailsComponent from "./detailsComponents/depositsDetailComponent.tsx"
import WithdrawalDetailsComponent from "./detailsComponents/withdrawalDetailsComponent"
import PgsPaymentDetailsComponent from "./detailsComponents/pgsPaymentDetailsComponent.tsx"
import TransactionDetailsComponent from "./detailsComponents/transactionDetailComponent.tsx"
import PgsReferencePaymentDetailsComponent from "./detailsComponents/pgsReferenceDetailsComponente.tsx"
import { ExtendedTransactionDetails } from "./detailsComponents/extendedTransactionDetails"
import { X } from "lucide-react"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetalhesMovimentos({ onClose, isOpen, itemSelected }: props) {



    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
                    <div className="ui-detail-sheet-header flex items-start justify-between gap-4 w-full">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                            <SheetTitle>Detalhes da Operação</SheetTitle>
                            <SheetDescription>Consulte as informações e o estado deste registo.</SheetDescription>
                        </SheetHeader>
                        <SheetClose aria-label="Fechar detalhes da operação" className="cursor-pointer rounded bg-[#DBDEE3] transition duration-300 hover:bg-[#C5C9CE]">
                            <X className="size-4" aria-hidden="true" />
                        </SheetClose>
                    </div>

                    <div className="ui-detail-sheet-body">
                        {itemSelected?.type === "DepositGpoFrame" && <DepositsDetailsComponent itemSelected={itemSelected} />}
                        {itemSelected?.type === "Withdrawal" && <WithdrawalDetailsComponent itemSelected={itemSelected} />}
                        {itemSelected?.type === "PgsPayment" && <PgsPaymentDetailsComponent itemSelected={itemSelected} />}
                        {itemSelected?.type === "PaymentReferences" && <PgsReferencePaymentDetailsComponent itemSelected={itemSelected} />}
                        {itemSelected?.type === "Transaction" && <TransactionDetailsComponent itemSelected={itemSelected} />}
                        {["CampaignReward", "Referral", "MerchantTransaction"].includes(itemSelected?.type) && (
                            <ExtendedTransactionDetails itemSelected={itemSelected} />
                        )}
                    </div>

                    <div className="ui-detail-sheet-footer">
                        <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                            Concluído
                        </Button>
                    </div>
                </SheetContent>

            </Sheet>
        </>
    )
}
