export const statusTransactions = (status: string) => {
      switch (status) {
        case "PAID":
          return "Processada";
        case "PENDING":
          return "Pendente";
        case "REJECTED":
          return "Não Processada";
        default:
          return null;
      }
    }