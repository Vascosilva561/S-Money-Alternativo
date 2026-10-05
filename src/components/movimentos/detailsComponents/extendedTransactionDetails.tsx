import type { ReactNode } from "react"
import { PegaDestinoMovimento } from "@/components/utils/destinoMovimento"
import { PegaOrigemMovimento } from "@/components/utils/origemMovimento"
import { TypeTransaction } from "@/components/utils/getTypeMoviment"
import { statusMovimento } from "@/components/utils/statusMoviment"
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor"
import { formatNumberPtAO } from "@/components/utils/formmat"
import { LevelBadge } from "@/components/gestaoDeContas/level-badge"

type DetailRecord = Record<string, unknown>

type MovementRecord = {
  id?: string | number
  type?: string
  signal?: string
  account_type?: string
  status?: string
  amount?: string | number
  valor?: string | number
  created_at?: string
  account?: DetailRecord
  detalhe?: DetailRecord
}

function record(value: unknown): DetailRecord {
  return value && typeof value === "object" ? value as DetailRecord : {}
}

function text(value: unknown, fallback = "—"): string {
  if (value === undefined || value === null || value === "") return fallback
  return String(value)
}

function accountName(value: unknown) {
  const account = record(value)
  const fullName = [account.first_name, account.last_name].filter(Boolean).map(String).join(" ").trim()
  return fullName || text(account.business_name)
}

function formatDate(value: unknown) {
  if (!value) return "—"
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat("pt-AO", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function formatMoney(value: unknown) {
  if (value === undefined || value === null || value === "") return "—"
  const amount = Number(value)
  if (!Number.isFinite(amount)) return text(value)
  return formatNumberPtAO(amount, 2) + " Kz"
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full flex justify-between items-center">
      <p>{label}:</p>
      <div className="max-w-[65%] break-words text-right text-[#4B5563]">{children}</div>
    </div>
  )
}

function DetailSection({ title, rows }: { title: string; rows: Array<{ label: string; value: ReactNode }> }) {
  return (
    <section className="ui-movement-detail-section">
      <p className="pt-2 font-semibold text-[#143163]">{title}</p>
      <div className="ring-[0.5px] ring-[#A9B8CF] w-full mb-8" />
      <div className="w-full">
        <div className="space-y-1 text-sm text-[#143163]">
          {rows.map((row) => <DetailRow key={row.label} label={row.label}>{row.value}</DetailRow>)}
        </div>
      </div>
    </section>
  )
}

function CommonRows({ item, amount }: { item: MovementRecord; amount: unknown }) {
  const movementStatus = statusMovimento(item) || text(item.status)
  const statusClass = statusMovimentoColor(movementStatus) || "bg-[#F2F4F7] text-[#536176]"
  return [
    { label: "ID da transacção", value: text(item.id) },
    { label: "Tipo de movimento", value: item.signal === "CREDIT" ? "Crédito" : item.signal === "DEBIT" ? "Débito" : "—" },
    { label: "Tipo de transacção", value: TypeTransaction(item.type) || "—" },
    { label: "Valor", value: formatMoney(amount) },
    {
      label: "Estado",
      value: <span className={"ui-status-tag " + statusClass}>{movementStatus}</span>,
    },
    { label: "Data", value: formatDate(item.created_at) },
    { label: "Origem", value: text(PegaOrigemMovimento(item)) },
    { label: "Destino", value: text(PegaDestinoMovimento(item)) },
  ]
}

function CampaignRewardDetails({ itemSelected }: { itemSelected: MovementRecord }) {
  const detail = record(itemSelected.detalhe)
  const campaign = record(detail.campaign_reward ?? detail.campaign ?? detail.deposit_gpo_frame)
  const amount = campaign.amount ?? itemSelected.amount ?? itemSelected.valor
  return (
    <div className="mt-5 space-y-5">
      <DetailSection title="Resumo da promoção" rows={CommonRows({ item: itemSelected, amount })} />
      <DetailSection title="Dados da campanha" rows={[
        { label: "Campanha", value: text(campaign.campaign_name ?? campaign.name ?? campaign.title) },
        { label: "Código", value: text(campaign.campaign_code ?? campaign.code) },
        { label: "Descrição", value: text(campaign.description) },
        { label: "Conta beneficiária", value: accountName(itemSelected.account ?? campaign.account) },
        { label: "Início", value: formatDate(campaign.start_date ?? campaign.started_at) },
        { label: "Término", value: formatDate(campaign.end_date ?? campaign.ended_at) },
      ]} />
    </div>
  )
}

function ReferralDetails({ itemSelected }: { itemSelected: MovementRecord }) {
  const detail = record(itemSelected.detalhe)
  const referral = record(detail.referral ?? detail.deposit_gpo_frame)
  const account = record(referral.account)
  const amount = referral.amount ?? itemSelected.amount ?? itemSelected.valor
  return (
    <div className="mt-5 space-y-5">
      <DetailSection title="Resumo da indicação" rows={CommonRows({ item: itemSelected, amount })} />
      <DetailSection title="Dados da indicação" rows={[
        { label: "Conta indicada", value: accountName(account) },
        { label: "Código de indicação", value: text(referral.code ?? referral.reference) },
        { label: "Referência de pagamento", value: text(referral.payment_reference) },
        { label: "Canal", value: text(referral.channel ?? referral.canal) },
        { label: "Validada", value: text(referral.validated_referral) },
        { label: "Data de geração", value: formatDate(referral.created_at) },
      ]} />
    </div>
  )
}

function MerchantTransactionDetails({ itemSelected }: { itemSelected: MovementRecord }) {
  const detail = record(itemSelected.detalhe)
  const merchantTransaction = record(detail.merchant_transaction)
  const merchant = record(merchantTransaction.merchant)
  const user = record(merchantTransaction.user)
  const source = merchantTransaction.source_type === "merchant" ? accountName(merchant) : accountName(user)
  const destination = merchantTransaction.destination_type === "merchant" ? accountName(merchant) : accountName(user)
  return (
    <div className="mt-5 space-y-5">
      <DetailSection title="Resumo da transacção" rows={[
        ...CommonRows({
          item: itemSelected,
          amount: merchantTransaction.amount ?? itemSelected.amount ?? itemSelected.valor,
        }),
        { label: "Tipo de conta", value: text(itemSelected.account_type) },
        { label: "Operação", value: text(merchantTransaction.operation) },
        { label: "Referência", value: text(merchantTransaction.reference) },
        { label: "Referência externa", value: text(merchantTransaction.external_reference) },
        { label: "Conta de origem", value: source },
        { label: "Conta de destino", value: destination },
      ]} />
      <DetailSection title="Empresa" rows={[
        { label: "Nome", value: text(merchant.business_name) },
        { label: "NIF", value: text(merchant.nif) },
        { label: "Email", value: text(merchant.email) },
      ]} />
      <DetailSection title="Cliente" rows={[
        { label: "Nome", value: accountName(user) },
        { label: "Telefone", value: text(user.phone_number) },
        { label: "Nível", value: <div className="flex justify-end"><LevelBadge level={user.level} /></div> },
      ]} />
    </div>
  )
}

export function ExtendedTransactionDetails({ itemSelected }: { itemSelected: MovementRecord }) {
  if (itemSelected.type === "CampaignReward") return <CampaignRewardDetails itemSelected={itemSelected} />
  if (itemSelected.type === "Referral") return <ReferralDetails itemSelected={itemSelected} />
  if (itemSelected.type === "MerchantTransaction") return <MerchantTransactionDetails itemSelected={itemSelected} />
  return null
}
