import { formatCurrency } from "./formmat";

export const GetAmount = (item: any) => {
  let amount: unknown;
      
  switch (item?.type) {
        
        case "Transaction":
          amount = item?.detalhe?.transaction?.amount;
          break;
        case "Withdrawal":
          amount = item?.detalhe?.withdrawal?.amount;
          break;
         case "PgsPayment":
          amount = item?.detalhe?.pgs_payment?.amount;
          break;
        case "DepositGpoFrame":
            amount = item?.detalhe?.deposit_gpo_frame?.amount;
            break;
        case "PaymentReferences":
          amount = item?.detalhe?.payment_references?.amount;
          break;
        case "MerchantTransaction":
          amount = item?.detalhe?.merchant_transaction?.amount;
          break;
        case "CampaignReward":
          amount = item?.detalhe?.campaign_reward?.amount
            ?? item?.detalhe?.campaign?.amount
            ?? item?.detalhe?.deposit_gpo_frame?.amount
            ?? item?.amount
            ?? item?.valor;
          break;
        case "Referral":
          amount = item?.detalhe?.referral?.amount
            ?? item?.detalhe?.deposit_gpo_frame?.amount
            ?? item?.amount
            ?? item?.valor;
          break;
        default:
          return null;
      }

  return formatCurrency(amount, "", 2, "").trim() || null;
};
