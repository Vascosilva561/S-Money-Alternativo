import * as React from "react"
import { Eye, Pencil, Trash2, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export type TableAction = "view" | "edit" | "delete"

const actionConfig: Record<TableAction, {
  label: string
  icon: LucideIcon
  className: string
  focusClassName: string
}> = {
  view: {
    label: "Ver detalhes",
    icon: Eye,
    className: "bg-[#E8F0FF] text-[#2678F2] hover:bg-[#2678F2] hover:text-white",
    focusClassName: "focus-visible:ring-[#2678F2]",
  },
  edit: {
    label: "Editar",
    icon: Pencil,
    className: "bg-[#E8F5EB] text-[#14B94A] hover:bg-[#14B94A] hover:text-white",
    focusClassName: "focus-visible:ring-[#14B94A]",
  },
  delete: {
    label: "Eliminar",
    icon: Trash2,
    className: "bg-[#FDECEC] text-[#B42318] hover:bg-[#B42318] hover:text-white",
    focusClassName: "focus-visible:ring-[#B42318]",
  },
}

export interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: TableAction
  tooltip?: string
}

const TableActionButton = React.forwardRef<HTMLButtonElement, TableActionButtonProps>(
  ({ action, className, "aria-label": ariaLabel, title, tooltip, type = "button", ...props }, ref) => {
    const config = actionConfig[action]
    const Icon = config.icon
    const accessibleLabel = ariaLabel || config.label
    const tooltipLabel = tooltip || title || config.label

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            type={type}
            aria-label={accessibleLabel}
            className={cn(
              "grid h-9 w-9 min-w-9 shrink-0 cursor-pointer place-items-center rounded-lg p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              config.className,
              config.focusClassName,
              className,
            )}
            {...props}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <p className="text-[#143163]">{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    )
  },
)

TableActionButton.displayName = "TableActionButton"

export { TableActionButton }
