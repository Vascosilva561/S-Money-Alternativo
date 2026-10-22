export const statusPaymentGPOColor = (status: string | null | undefined) => {
    const normalizedStatus = String(status ?? "").trim().toUpperCase()

    switch (normalizedStatus) {
        case "SUCCESS":
        case "PAID":
        case "ACCEPTED":
            return "bg-[#CFE7D7] text-[#0D9339]"
        case "FAILED":
        case "REJECTED":
        case "ERROR":
        case "CANCELED":
        case "CANCELLED":
            return "bg-[#FDE4EA] text-[#EF4A00]"
        case "PENDING":
            return "bg-[#FDE9B0] text-[#A26C07]"
        default:
            return "bg-[#EAF6F8] text-[#53657A]"
    }
}
