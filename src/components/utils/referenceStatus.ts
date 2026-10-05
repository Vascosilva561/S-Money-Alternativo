type ReferenceStatus = string | null | undefined

const normalizeReferenceStatus = (status: ReferenceStatus) =>
    String(status ?? "").trim().toUpperCase()

export const getReferenceStatusLabel = (status: ReferenceStatus) => {
    switch (normalizeReferenceStatus(status)) {
        case "ACTIVE":
            return "Activo"
        case "INACTIVE":
            return "Inactivo"
        case "PAID":
            return "Pago"
        case "PENDING":
            return "Pendente"
        case "PROCESSING":
            return "Em processamento"
        case "SUCCESS":
        case "ACCEPTED":
            return "Concluído"
        case "ERROR":
        case "FAILED":
            return "Falhou"
        case "REJECTED":
            return "Rejeitado"
        case "CANCELED":
        case "CANCELLED":
            return "Cancelado"
        case "EXPIRED":
            return "Expirado"
        default: {
            const words = String(status ?? "").trim().toLowerCase().split(/[_\s-]+/)
            const label = words
                .filter(Boolean)
                .map((word) => word.charAt(0).toLocaleUpperCase("pt-AO") + word.slice(1))
                .join(" ")

            return label || "—"
        }
    }
}

export const getReferenceStatusClass = (status: ReferenceStatus) => {
    switch (normalizeReferenceStatus(status)) {
        case "ACTIVE":
            return "bg-[#DEF7EC] text-[#03543F]"
        case "PAID":
            return "bg-[#DEE6F7] text-[#2678F2]"
        default:
            return status?.trim()
                ? "bg-[#FDE8E8] text-[#9B1C1C]"
                : "bg-[#F2F4F7] text-[#536176]"
    }
}
