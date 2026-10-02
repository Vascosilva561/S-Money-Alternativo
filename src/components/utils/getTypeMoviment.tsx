export const TypeTransaction = (status: string | undefined) => {
      switch (status) {
        case "Transaction":
          return "Transferencia";
        case "Withdrawal":
          return "Levantamento";
        case "PgsPayment":
          return "Pag/Serviço";
        case "DepositGpoFrame":
          return "Depósito";
        case "PaymentReferences":
          return "Pag.Referência"
        case "CampaignReward":
          return "Promoção";
        case "Referral":
          return "Bónus de convite";
        case "MerchantTransaction":
          return "Transacção via API";
        default:
          return null;
      }
    }
