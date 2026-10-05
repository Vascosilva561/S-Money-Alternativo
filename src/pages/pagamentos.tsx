import PaymentsTabs from "@/components/pagamentos/PaymentsTabs"
import PagamentosDeServices from "@/pages/pagamentos-services"
import PagamentosReferencia from "@/pages/pagamento-referencia"

export default function PagamentosPage() {
  return (
    <PaymentsTabs
      services={<PagamentosDeServices />}
      reference={<PagamentosReferencia />}
    />
  )
}
