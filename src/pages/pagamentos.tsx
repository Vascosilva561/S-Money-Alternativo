import PaymentsTabs from "@/components/pagamentos/PaymentsTabs"
import PagamentosDeServices from "@/pages/pagamentos-services"
import PagamentosReferencia from "@/pages/pagamento-referencia"
import PagamentosGPO from "@/pages/pagamentosGPO"

export default function PagamentosPage() {
  return (
    <PaymentsTabs
      services={<PagamentosDeServices />}
      reference={<PagamentosReferencia />}
      gpo={<PagamentosGPO />}
    />
  )
}