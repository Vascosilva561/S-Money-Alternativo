import { useEffect, useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { FormField, TextField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Rule } from "@/types/rules"

type LevelFormSheetProps = {
  open: boolean
  mode: "create" | "edit"
  rule?: Rule
  onClose: () => void
}

type FormValues = {
  account_type: string
  rule_type: string
  transaction_rules: string
  per_day: string
  per_mounth: string
  found_total: string
}

const emptyForm: FormValues = {
  account_type: "",
  rule_type: "",
  transaction_rules: "",
  per_day: "",
  per_mounth: "",
  found_total: "",
}

function formatPreview(value: string) {
  const amount = Number(value)
  if (!value.trim() || !Number.isFinite(amount)) return "—"
  return new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " Kz"
}

function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message
  }
  return error instanceof Error ? error.message : "Não foi possível guardar o nível."
}

export function LevelFormSheet({ open, mode, rule, onClose }: LevelFormSheetProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && rule) {
      setForm({
        account_type: String(rule.account_type || ""),
        rule_type: String(rule.rule_type ?? ""),
        transaction_rules: String(rule.transaction_rules ?? ""),
        per_day: String(rule.per_day ?? ""),
        per_mounth: String(rule.per_mounth ?? ""),
        found_total: String(rule.found_total ?? ""),
      })
      return
    }
    setForm(emptyForm)
  }, [mode, open, rule])

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const levelNumber = Number(form.rule_type)
    const limitFields = [form.transaction_rules, form.per_day, form.per_mounth, form.found_total]
    const hasInvalidLimit = limitFields.some((value) => value.trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0)
    if (!form.account_type || form.rule_type.trim() === "" || !Number.isInteger(levelNumber) || levelNumber < 1 || hasInvalidLimit) {
      toast.error("Preencha os campos com valores válidos.")
      return
    }

    const payload = {
      account_type: form.account_type,
      rule_type: Number(form.rule_type),
      transaction_rules: Number(form.transaction_rules),
      per_day: Number(form.per_day),
      per_mounth: Number(form.per_mounth),
      found_total: Number(form.found_total),
    }

    setIsSaving(true)
    try {
      if (mode === "edit" && rule?.id !== undefined) {
        await api.put("/front/rules/" + rule.id, payload)
        toast.success("Nível actualizado com sucesso.")
      } else {
        await api.post("/front/rules", payload)
        toast.success("Nível adicionado com sucesso.")
      }
      await queryClient.invalidateQueries({ queryKey: ["account-level-rules"] })
      onClose()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const title = mode === "create" ? "Adicionar nível" : "Editar nível"
  const levelBadgeName = getLevelBadgeName(form.rule_type)

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <SheetContent className="ui-level-form-sheet ui-edit-sheet w-full gap-0 overflow-y-auto p-5 sm:max-w-[560px] sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <div>
            <SheetHeader className="p-0"><SheetTitle className="text-lg font-semibold text-[#143163]">{title}</SheetTitle></SheetHeader>
            <p className="mt-1 text-sm text-[#667085]">Defina os limites aplicáveis a esta conta.</p>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Fechar formulário"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition-colors hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </SheetClose>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="ui-level-form-fields grid shrink-0 grid-cols-1 content-start items-start gap-4 pb-4 pt-8 sm:grid-cols-2">
            <FormField label="Tipo de conta" required>
              <Select
                value={form.account_type}
                disabled={mode === "edit"}
                onValueChange={(value) => updateField("account_type", value)}
              >
                <SelectTrigger aria-label="Tipo de conta">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">Particular</SelectItem>
                  <SelectItem value="Merchant">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <TextField
              label="Nível"
              required
              type="number"
              min="1"
              step="1"
              value={form.rule_type}
              hint={levelBadgeName ? (
                <span className="inline-flex items-center gap-1.5">
                  <LevelBadgeIcon level={form.rule_type} className="size-4 shrink-0" />
                  {levelBadgeName}
                </span>
              ) : undefined}
              onChange={(event) => updateField("rule_type", event.target.value)}
            />
            <TextField
              label="Limite por transacção"
              required
              type="number"
              min="0"
              step="any"
              value={form.transaction_rules}
              hint={formatPreview(form.transaction_rules)}
              onChange={(event) => updateField("transaction_rules", event.target.value)}
            />
            <TextField
              label="Limite por dia"
              required
              type="number"
              min="0"
              step="any"
              value={form.per_day}
              hint={formatPreview(form.per_day)}
              onChange={(event) => updateField("per_day", event.target.value)}
            />
            <TextField
              label="Limite por mês"
              required
              type="number"
              min="0"
              step="any"
              value={form.per_mounth}
              hint={formatPreview(form.per_mounth)}
              onChange={(event) => updateField("per_mounth", event.target.value)}
            />
            <TextField
              label="Fundo total"
              required
              type="number"
              min="0"
              step="any"
              value={form.found_total}
              hint={formatPreview(form.found_total)}
              onChange={(event) => updateField("found_total", event.target.value)}
            />
          </div>

          <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 border-t border-[#E5EBF4] bg-white py-4">
            <Button type="button" variant="outline" className="h-11 w-full rounded-[8px]" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" variant="brand" className="h-11 w-full rounded-[8px] bg-[#143163] text-white ring-0 hover:bg-[#1D467F] hover:ring-0" disabled={isSaving}>
              {isSaving ? "A guardar..." : mode === "create" ? "Adicionar nível" : "Guardar alterações"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
