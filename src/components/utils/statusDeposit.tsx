
export const statusDeposit = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return "Concluído";
        case "REJECTED":
          return "Expirado";
        case "PENDING":
          return "Pendente";
        case "REFUNDED":
          return "Reembolso";
        default:
          return null;
      }
    }