import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoaderCircle, Trash2 } from "lucide-react"

type ConfirmDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Eliminar",
  isLoading = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ui-confirm-delete-dialog sm:max-w-[440px]">
        <div className="flex items-start gap-3 pr-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#FDECEC] text-[#B42318]">
            <Trash2 className="size-5" aria-hidden="true" />
          </span>
          <DialogHeader className="gap-1 p-0 text-left">
            <DialogTitle className="text-[#143163]">{title}</DialogTitle>
            <DialogDescription className="text-[#667085]">{description}</DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="ui-confirm-delete-footer">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="h-11 w-full rounded-lg" disabled={isLoading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="ui-confirm-delete-action h-11 w-full rounded-lg"
            onClick={() => void onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
            {isLoading ? "A eliminar…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
