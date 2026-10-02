import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export type AccountTypeFilter = "all" | "User" | "Merchant"

type LevelFilterSheetProps = {
  open: boolean
  accountType: AccountTypeFilter
  onApply: (accountType: AccountTypeFilter) => void
  onClose: () => void
}

export function LevelFilterSheet({ open, accountType, onApply, onClose }: LevelFilterSheetProps) {
  const [draftAccountType, setDraftAccountType] = useState<AccountTypeFilter>(accountType)

  useEffect(() => {
    if (open) setDraftAccountType(accountType)
  }, [accountType, open])

  function applyFilters() {
    onApply(draftAccountType)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <SheetContent className="ui-filter-sheet-panel w-full gap-0 overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
        <div className="flex w-full items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
          <div>
            <SheetHeader className="p-0">
              <SheetTitle className="text-lg font-semibold text-[#143163]">Filtrar Dados</SheetTitle>
            </SheetHeader>
            <p className="mt-1 text-sm text-[#667085]">Defina os critérios que pretende aplicar para refinar a lista.</p>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Fechar filtros"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition-colors hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </SheetClose>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="pt-6">
            <FormField label="Tipo de Conta">
              <Select value={draftAccountType} onValueChange={(value) => setDraftAccountType(value as AccountTypeFilter)}>
                <SelectTrigger aria-label="Tipo de Conta">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  <SelectItem value="User">Particulares</SelectItem>
                  <SelectItem value="Merchant">Empresas</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="mt-auto border-t border-[#E5EBF4] pt-4">
            <Button
              type="button"
              variant="brand"
              className="h-11 w-full rounded-lg bg-[#143163] text-white ring-0 hover:bg-[#1D467F] hover:ring-0"
              onClick={applyFilters}
            >
              Filtrar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
