import DepositTabs from "@/components/deposits/DepositTabs"
import DepositReference from "@/pages/depositReference"
import DepositosGpo from "@/pages/depositGPO"

export default function DepositosPage() {
  return <DepositTabs reference={<DepositReference />} gpo={<DepositosGpo />} />
}
