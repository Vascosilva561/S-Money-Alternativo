
export const PegaDestinoMovimento = (item: any) => {
  switch (item?.type) {
        
        case "Transaction":
          return item?.detalhe?.transaction?.receiver_name || "";
        case "Withdrawal":
          return  item?.detalhe?.withdrawal?.iban || "";
         case "PgsPayment":
          return item?.detalhe?.pgs_payment?.beneficiario || ""
        case "DepositGpoFrame":
            return  item?.detalhe?.deposit_gpo_frame?.user_name || "";
        case "PaymentReferences":
          return item?.detalhe?.payment_references?.reference || "";
        case "CampaignReward":
          return [item?.account?.first_name, item?.account?.last_name].filter(Boolean).join(" ")
            || item?.account?.business_name
            || item?.detalhe?.campaign_reward?.account?.business_name
            || "";
        case "Referral":
          return [item?.detalhe?.referral?.account?.first_name, item?.detalhe?.referral?.account?.last_name].filter(Boolean).join(" ")
            || item?.detalhe?.referral?.account?.business_name
            || "";
        case "MerchantTransaction": {
            const merchantTx = item?.detalhe?.merchant_transaction;
            if (merchantTx?.destination_type === "merchant") {
                return merchantTx?.merchant?.business_name || "";
            }
            if (merchantTx?.destination_type === "customer") {
                return [merchantTx?.user?.first_name, merchantTx?.user?.last_name].filter(Boolean).join(" ");
            }
            return "";
        }
        default:
          return null;
      }
    }
