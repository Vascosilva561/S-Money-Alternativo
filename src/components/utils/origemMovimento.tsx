
export const tipo_de_Terminal = [
  {
      description: "Pagamento Automático (POS)",
      value: "B",
  },
  {
      description: "ATM",
      value: "A",
  },
  {
      description: "Internet Banking (IB)",
      value: "L",
  },
  {
      description: "Express",
      value: "M",
  },
  {
      description: "POS Digital",
      value: "Z",
  },
];

export const PegaOrigemMovimento = (item: any) => {

  const canalFIltered: {description:string, value:string} = tipo_de_Terminal?.find((terminal)=>terminal?.value === item?.detalhe?.payment_references?.channel) || {description: "", value: ""}
      
  switch (item?.type) {
        
        case "Transaction":
          return item?.detalhe?.transaction?.sender_name || ""
        case "Withdrawal":
          return  item?.account_type === "User" ? `${item?.detalhe?.withdrawal?.account?.first_name} ${item?.detalhe?.withdrawal?.account?.last_name}` :
           `${item?.detalhe?.withdrawal?.account?.business_name}` || "";
         case "PgsPayment":
          return  item?.account_type === "User" ? `${item?.detalhe?.pgs_payment?.account?.first_name} ${item?.detalhe?.pgs_payment?.account?.last_name}` : 
          `${item?.detalhe?.withdrawal?.account?.business_name}` || "";
        case "DepositGpoFrame":
            return  item?.detalhe?.deposit_gpo_frame?.canal
        case "PaymentReferences":
          return item?.detalhe?.payment_references?.reference || "";
        case "CampaignReward":
          return item?.detalhe?.campaign_reward?.source_name || item?.detalhe?.campaign?.source_name || "Sómoney";
        case "Referral":
          return canalFIltered?.description || item?.detalhe?.referral?.source_name || item?.detalhe?.referral?.channel || "Sómoney";
        case "MerchantTransaction": {
            const merchantTx = item?.detalhe?.merchant_transaction;
            if (merchantTx?.source_type === "merchant") {
                return merchantTx?.merchant?.business_name || "";
            }
            if (merchantTx?.source_type === "customer") {
                return [merchantTx?.user?.first_name, merchantTx?.user?.last_name].filter(Boolean).join(" ");
            }
            return "";
        }
        default:
          return null;
      }
    }

