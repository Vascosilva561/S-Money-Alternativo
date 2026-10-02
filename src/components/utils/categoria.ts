
export const Categoria = (item: string) => {
  switch (item) {
        
        case "TV":
          return "Televisão";
        case "BET":
          return "Apostas" ;
         case "RECHARGE":
          return "Telefonia";
        case "PUBLIC_SERVICE":
            return  "Serviços Públicos";
        default:
          return null;
      }
    }