export const statusPayment = (status: string) => {
      switch (String(status ?? "").trim().toUpperCase()) {
        case "SUCCESS":
        case "COMPLETED":
        case "ACCEPTED":
        case "PAID":
          return "Concluído";
        case "ERROR":
        case "FAILED":
          return "Falhou";
        case "PENDING":
          return "Pendente";
        case "REJECTED":
          return "Rejeitado";
        case "REFUNDED":
          return "Reembolsado";
        default:
          return status || "—";
      }
    }
