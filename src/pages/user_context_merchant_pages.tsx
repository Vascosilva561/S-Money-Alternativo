import Webhooks from "@/pages/webhooks"
import Referencias from "@/pages/referencias"
import { useUserContext } from "@/pages/user_context_types"
import { Navigate } from "react-router"

export function UserContextWebhooks() {
  const user = useUserContext()
  const isMerchant = user.account_type === "Merchant" || Boolean(user.business_name)

  if (!isMerchant || !user.id) return <Navigate to="../visao-geral" replace />

  return (
    <div className="ui-context-page space-y-4">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Webhooks</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Configure os destinos e consulte as entregas de notificações desta empresa.</p>
      </div>
      <Webhooks contextMerchantId={user.id} />
    </div>
  )
}

export function UserContextReferences() {
  const user = useUserContext()
  const isMerchant = user.account_type === "Merchant" || Boolean(user.business_name)

  if (!isMerchant || !user.id) return <Navigate to="../visao-geral" replace />

  return (
    <div className="ui-context-page space-y-4">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">Contexto da conta</p>
        <h2 className="mt-1 text-2xl font-bold text-[#143163]">Referências</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Consulte as referências de pagamento associadas a esta empresa.</p>
      </div>
      <Referencias contextMerchantNumber={user.merchant_payment_number} contextual />
    </div>
  )
}
