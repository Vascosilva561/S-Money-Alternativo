import PaymentsTabs from "@/components/pagamentos/PaymentsTabs"
import UserContextOperationsPage from "@/pages/user_context_operations"

export default function UserContextPaymentsPage() {
  return (
    <div className="ui-context-page">
      <div className="mb-5">
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Pagamentos</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Pagamentos de serviços e por referência associados à conta seleccionada.</p>
      </div>

      <PaymentsTabs
        services={<UserContextOperationsPage operation="pagamentos" title="Pagamento de serviços" embedded />}
        reference={<UserContextOperationsPage operation="pagamentos-referencia" title="Pagamentos por referência" embedded />}
      />
    </div>
  )
}
