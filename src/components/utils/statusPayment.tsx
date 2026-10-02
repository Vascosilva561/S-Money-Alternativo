export const statusPayment = (status: string) => {
      switch (status) {
        case "SUCCESS":
          return "Concluído";
        case "ERROR":
          return "Falhou";
        default:
          return null;
      }
    }