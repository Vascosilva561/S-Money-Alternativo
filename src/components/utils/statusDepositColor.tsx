export const statusDepositColor = (status: string) => {
  switch (String(status ?? "").trim().toUpperCase()) {
    case "ACCEPTED":
    case "SUCCESS":
    case "PAID":
      return "bg-[#CFE7D7] text-[#0D9339]";
    case "REJECTED":
    case "ERROR":
    case "FAILED":
    case "CANCELED":
    case "CANCELLED":
      return "bg-[#FDE4EA] text-[#EF4A00]";
    case "PENDING":
    case "PROCESSING":
      return "bg-[#FDE9B0] text-[#A26C07]";
    case "REFUNDED":
      return "bg-[#F3CFFF] text-[#7100C8]";
    default:
      return null;
  }
}
