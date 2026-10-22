
export const statusDeposit = (status: string) => {
      switch (String(status ?? "").trim().toUpperCase()) {
        case "ACCEPTED":
          return "Concluído";
        case "REJECTED":
        case "EXPIRED":
          return "Expirado";
        case "PENDING":
          return "Pendente";
        case "REFUNDED":
          return "Reembolso";
        default:
          return null;
      }
    }
