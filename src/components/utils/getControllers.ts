
export const getControllers = (controller: string) => {
      switch (controller) {
        
        case "users":
            return "Utilizadores";
         case "banks":
          return "Bancos";
        case "faqs":
            return "Perguntas frequentes";
        case "ibans":
          return "Ibans";
        case "permissions":
          return "Permissões";
        case "deposit_gpo_frame":
          return "Depósitos GPO";
        case "merchants":
          return "Comerciantes";
        case "otp_token":
          return "Tokens OTP";
        case "pgs_entity":
          return "Entidades Pagasó";
        case "pgs_payment":
          return "Pagamentos Pagasó";
        case "pgs_request":
          return "Requesições Pagasó";
        case "transaction":
          return "Transações";
        case "wallet_configuration":
          return "Configurações da Carteira";
        case "wallets":
          return "Carteiras";
        case "withdrawal":
          return "Criar Retirada de Dinheiro";
        case "pgs_produtos":
          return "Produtos Pagasó";
        case "logger_somoney":
          return "Logger Somoney";
        case "managers":
          return "Gerentes";
        case "activities":
          return "Atividades";
        case "history_file":
          return "Histórico de Arquivos";
        case "product":
          return "Produtos"
        case "partners":
          return "Parceiros"
        case "desconto_partner":
          return "Descontos por Parceiros"
        case "pgs_produto": 
        return "Produtos PGS"
        case "position":
          return "Cargos"
        case "sub_product":
          return "Sub-produtos"
        default:
          return null;
      }
    }

