import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"
import type { Rule } from "@/types/rules"

type LevelDetailsSheetProps = {
  open: boolean
  rule?: Rule
  onClose: () => void
}

function formatCurrency(value?: number | string | null) {
  if (value === undefined || value === null || String(value).trim() === "") return "—"
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "—"
  return new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " Kz"
}

function levelLabel(level: number | string | null | undefined) {
  return getLevelBadgeName(level) ?? (level === null || level === undefined || String(level).trim() === "" ? "Sem nível definido" : "Nível " + level)
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] py-3 last:border-b-0">
      <dt className="text-sm text-[#667085]">{label}</dt>
      <dd className="text-right text-sm font-medium text-[#143163]">{value || "—"}</dd>
    </div>
  )
}

export function LevelDetailsSheet({ open, rule, onClose }: LevelDetailsSheetProps) {
  const badgeLabel = getLevelBadgeName(rule?.rule_type)
  const hasBadgeIcon = Boolean(badgeLabel)
  const accountTypeLabel = rule?.account_type === "Merchant" ? "Empresa" : "Particular"

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <SheetContent className="ui-detail-sheet w-full overflow-y-auto sm:max-w-lg">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <div>
            <SheetHeader className="p-0"><SheetTitle className="text-lg font-semibold text-[#143163]">Detalhes do nível</SheetTitle></SheetHeader>
            <p className="mt-1 text-sm text-[#667085]">Limites configurados para a conta.</p>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Fechar detalhes"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition-colors hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </SheetClose>
        </div>

        {rule && (
          <>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4">
              <span className="grid size-11 shrink-0 place-items-center text-base font-bold text-[#143163]">
                {hasBadgeIcon
                  ? <LevelBadgeIcon level={rule.rule_type} className="size-8 shrink-0" />
                  : (rule.rule_type === null || rule.rule_type === undefined || String(rule.rule_type).trim() === "" ? "—" : rule.rule_type)}
              </span>
              <div>
                <p className="font-semibold text-[#143163]">{levelLabel(rule.rule_type)}</p>
                <p className="text-sm text-[#667085]">{accountTypeLabel}{badgeLabel ? " · Nível " + rule.rule_type : ""}</p>
              </div>
            </div>

            <dl className="mt-4 divide-y divide-[#EEF2F7] rounded-xl border border-[#E5EBF4] px-4">
              <DetailRow label="Limite por transacção" value={formatCurrency(rule.transaction_rules)} />
              <DetailRow label="Limite por dia" value={formatCurrency(rule.per_day)} />
              <DetailRow label="Limite por mês" value={formatCurrency(rule.per_mounth)} />
              <DetailRow label="Fundo total" value={formatCurrency(rule.found_total)} />
            </dl>
          </>
        )}

        <SheetFooter>
          <Button type="button" variant="brand" className="h-11 rounded-lg font-semibold" onClick={onClose}>Fechar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
