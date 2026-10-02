import DepositTabs from "@/components/deposits/DepositTabs"
import UserContextOperationsPage from "@/pages/user_context_operations"

export default function UserContextDepositsPage() {
  return (
    <div className="ui-context-page">
      <div className="mb-5">
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Depósitos</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Depósitos por referência e por GPO associados à conta seleccionada.</p>
      </div>

      <DepositTabs
        reference={<UserContextOperationsPage operation="pagamentos-referencia" title="Depósitos por Referência" embeddedInDeposits />}
        gpo={<UserContextOperationsPage operation="pagamento-gpo" title="Depósitos por GPO" embeddedInDeposits />}
      />
    </div>
  )
}
