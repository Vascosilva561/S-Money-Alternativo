export type WebhookServiceType = "gpo" | "sector";

export interface WebhookEventOption {
    key: string;
    description: {
        en: string;
        pt: string;
    };
}

export const WEBHOOK_EVENTS: Record<
    WebhookServiceType,
    WebhookEventOption[]
> = {
    gpo: [
        {
            key: "gpo-payment.refunded",
            description: {
                en: "Transaction refunded",
                pt: "Transação reembolsada",
            },
        },
        {
            key: "gpo-payment.accepted",
            description: {
                en: "Transaction accepted",
                pt: "Transação aceite",
            },
        },
        {
            key: "gpo-payment.rejected",
            description: {
                en: "Transaction rejected",
                pt: "Transação rejeitada",
            },
        },
    ],
    sector: [
        {
            key: "sector-payment.files",
            description: {
                en: "Event triggered when payment files are received",
                pt: "Evento acionado quando ficheiros de pagamentos são recebidos",
            },
        },
        {
            key: "sector-payment.realtime",
            description: {
                en: "Event triggered when a real-time payment occurs",
                pt: "Evento acionado quando acontece um pagamento em tempo real",
            },
        },
        {
            key: "sector-payment.reconciliated",
            description: {
                en: "Event triggered when a real-time payment is verified using a confirmation file",
                pt: "Evento acionado quando um pagamento em tempo real é verificado através de ficheiro",
            },
        },
    ],
};