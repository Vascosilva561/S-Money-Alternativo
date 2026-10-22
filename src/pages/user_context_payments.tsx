import PaymentsTabs from "@/components/pagamentos/PaymentsTabs"
import UserContextOperationsPage from "@/pages/user_context_operations"
import { useUserContext } from "@/pages/user_context_types"

export default function UserContextPaymentsPage() {
  const user = useUserContext()
  const isMerchant = user.account_type === "Merchant" || Boolean(user.business_name)

  return (
    <div className="ui-context-page">
      <div className="mb-5">
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Pagamentos</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{isMerchant ? "Pagamentos de serviços, por referência e por GPO associados à conta seleccionada." : "Pagamentos de serviços e por referência associados à conta seleccionada."}</p>
      </div>

      <PaymentsTabs
        services={<UserContextOperationsPage key="payment-services" operation="pagamentos" title="Pagamento de serviços" embedded />}
        reference={<UserContextOperationsPage key="payment-reference" operation="pagamentos-referencia" title="Pagamentos por referência" embedded />}
        gpo={isMerchant ? <UserContextOperationsPage key="payment-gpo" operation="pagamentos-gpo" title="Pagamentos por GPO" embedded /> : undefined}
      />
    </div>
  )
}
