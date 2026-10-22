export const statusPaymentGPOLabel = (status: string | null | undefined) => {
    const normalizedStatus = String(status ?? "").trim().toUpperCase()

    switch (normalizedStatus) {
        case "SUCCESS":
        case "PAID":
        case "ACCEPTED":
            return "Concluído"
        case "FAILED":
        case "REJECTED":
        case "ERROR":
        case "CANCELED":
        case "CANCELLED":
            return "Falhou"
        case "PENDING":
            return "Pendente"
        default:
            return String(status ?? "").trim() || "—"
    }
}
