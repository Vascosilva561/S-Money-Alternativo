export const statusPaymentColor = (status: string) => {
  switch (String(status ?? "").trim().toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
    case "PAID":
    case "ACCEPTED":
      return "bg-[#CFE7D7] text-[#0D9339]";
    case "PENDING":
    case "PROCESSING":
      return "bg-[#FDE9B0] text-[#A26C07]";
    case "REFUNDED":
      return "bg-[#F3CFFF] text-[#7100C8]";
    case "ERROR":
    case "REJECTED":
    case "FAILED":
    case "CANCELED":
    case "CANCELLED":
      return "bg-[#FDE4EA] text-[#EF4A00]";
    default:
      return null;
  }
}
