import {
    Wallet,
    WalletCards,
    ArrowLeftRight,
    ArrowDownToLine,
    ArrowUpFromLine,
    CreditCard,
    ReceiptText,
    Clock3,
} from "lucide-react";

export const IconsCardsDashboardUser = (item: string) => {
    const iconClass = "w-5 h-5 text-white";

    switch (item) {
        case "saldoDisponivel":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#143163] to-[#315DA8] flex items-center justify-center shrink-0">
                    <Wallet className={iconClass} />
                </div>
            );

        case "saldoTotal":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#2678F2] to-[#4AB9F0] flex items-center justify-center shrink-0">
                    <WalletCards className={iconClass} />
                </div>
            );

        case "transferencias":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7986FC] to-[#2A45D1] flex items-center justify-center shrink-0">
                    <ArrowLeftRight className={iconClass} />
                </div>
            );

        case "depositos":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#07A139] to-[#65C466] flex items-center justify-center shrink-0">
                    <ArrowDownToLine className={iconClass} />
                </div>
            );

        case "levantamentos":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#E99610] to-[#FF7A27] flex items-center justify-center shrink-0">
                    <ArrowUpFromLine className={iconClass} />
                </div>
            );

        case "pagamentos":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#5E0EB4] to-[#9A27FF] flex items-center justify-center shrink-0">
                    <CreditCard className={iconClass} />
                </div>
            );

        case "pagamentosReferencia":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#C4974F] to-[#795B2A] flex items-center justify-center shrink-0">
                    <ReceiptText className={iconClass} />
                </div>
            );

        case "ultimaAtividade":
            return (
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#4AB9F0] to-[#2678F2] flex items-center justify-center shrink-0">
                    <Clock3 className={iconClass} />
                </div>
            );

        default:
            return null;
    }
};