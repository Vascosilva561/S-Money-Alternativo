export const statusMovimento = (item: any) => {
      switch (item?.type) {
        case "Withdrawal":
          return item?.detalhe?.withdrawal?.status === "ACCEPTED"?"Concluído":(item?.detalhe?.withdrawal?.status === "PENDING"?"Pendente":"Falhou");
        case "Transaction":
          return item?.detalhe?.transaction?.status === "PAID"?"Concluído":(item?.detalhe?.transaction?.status === "PENDING"?"Pendente":"Falhou");
        case "PgsPayment":
          return item?.detalhe?.pgs_payment?.status === "SUCCESS"?"Concluído":"Falhou";
        case "DepositGpoFrame":
          return item?.detalhe?.deposit_gpo_frame?.status === "ACCEPTED"?"Concluído":(item?.detalhe?.deposit_gpo_frame?.status === "PENDING"?"Pendente":"Falhou");
        case "PaymentReferences":
          return item?.detalhe?.payment_references?.status === "SUCCESS"?"Concluído":"Falhou";
        case "MerchantTransaction": {
          const status = item?.detalhe?.merchant_transaction?.status ?? item?.status;
          if (!status) return null;
          if (["APPROVED", "SUCCESS", "PAID", "ACCEPTED"].includes(status)) return "Concluído";
          if (status === "PENDING") return "Pendente";
          return ["REJECTED", "FAILED", "ERROR", "CANCELLED", "CANCELED"].includes(status) ? "Falhou" : null;
        }
        case "CampaignReward":
        case "Referral": {
          const detail = item?.type === "CampaignReward"
            ? item?.detalhe?.campaign_reward ?? item?.detalhe?.campaign ?? item?.detalhe?.deposit_gpo_frame
            : item?.detalhe?.referral ?? item?.detalhe?.deposit_gpo_frame;
          const status = detail?.status ?? item?.status;
          if (!status) return null;
          if (["APPROVED", "SUCCESS", "PAID", "ACCEPTED", "VALIDATED"].includes(status)) return "Concluído";
          if (status === "PENDING") return "Pendente";
          return ["REJECTED", "FAILED", "ERROR", "CANCELLED", "CANCELED"].includes(status) ? "Falhou" : null;
        }
        default:
          return null;
      }
    }
