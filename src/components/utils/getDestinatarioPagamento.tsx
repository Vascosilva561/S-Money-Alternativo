

export const getDestinatarioPagamento = (item: any) => {
      
  switch (item?.entity) {
        case "UNITEL":
          return item?.body_request?.unitel_telefone
        case "AFRICELL":
          return item?.body_request?.produto_id;
         case "MOVICEL":
          return item?.body_request?.produto_id;
        case "ENDE":
          return item?.body_request?.produto_id;
         case "ELEPHANTBET":
          return item?.body_request?.produto_id;
        case "DSTV":
          return item?.body_request?.produto_id;
         case "BANTUBET":
          return item?.body_request?.produto_id;
        case "ZAP":
          return item?.body_request?.produto_id;
         case "ZAP FIBRA":
          return item?.body_request?.produto_id;
        default:
          return null;
      }
    }