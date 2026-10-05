import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export type WebhookStatusFilter = "all" | "active" | "inactive"

type WebhookFilterProps = {
    isOpen: boolean
    status: WebhookStatusFilter
    onClose: () => void
    onApply: (status: WebhookStatusFilter) => void
}

export default function WebhookFilter({ isOpen, status, onClose, onApply }: WebhookFilterProps) {
    const [draftStatus, setDraftStatus] = useState<WebhookStatusFilter>(status)

    useEffect(() => {
        if (isOpen) setDraftStatus(status)
    }, [isOpen, status])

    const apply = (nextStatus: WebhookStatusFilter) => {
        onApply(nextStatus)
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="ui-filter-sheet-panel w-full overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Filtrar webhooks</SheetTitle>
                        <SheetDescription>Defina os critérios para refinar a lista de webhooks.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar filtros" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#637590] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163]">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="space-y-5">
                    <FormField label="Estado do webhook">
                        <Select value={draftStatus} onValueChange={(value) => setDraftStatus(value as WebhookStatusFilter)}>
                            <SelectTrigger className="w-full" aria-label="Estado do webhook">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                <SheetFooter className="mt-auto p-0 pt-4">
                    <Button type="button" variant="brand" onClick={() => apply(draftStatus)}>
                        Filtrar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
