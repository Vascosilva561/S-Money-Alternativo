export const statusTransactionsColor = (status: string) => {
  switch (String(status ?? "").trim().toUpperCase()) {
    case "PAID":
    case "SUCCESS":
    case "ACCEPTED":
      return "bg-[#CFE7D7] text-[#0D9339]";
    case "PENDING":
    case "PROCESSING":
      return "bg-[#FDE9B0] text-[#A26C07]";
    case "REJECTED":
    case "FAILED":
    case "CANCELED":
    case "CANCELLED":
      return "bg-[#FDE4EA] text-[#EF4A00]";
    default:
      return null;
  }
}
