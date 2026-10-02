

export const statusLevantamento = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return "Processado";
        case "REJECTED":
          return "Recusado";
        case "PENDING":
          return "Pendente";
        default:
          return null;
      }
    }