import DepositTabs from "@/components/deposits/DepositTabs"
import PagamentosReferencia from "@/pages/pagamento-referencia"
import DepositosGpo from "@/pages/pagamentosGPO"

export default function DepositosPage() {
  return <DepositTabs reference={<PagamentosReferencia />} gpo={<DepositosGpo />} />
}
