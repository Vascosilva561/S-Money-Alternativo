import { ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type TableRowExpandButtonProps = {
  expanded: boolean
  expandLabel: string
  collapseLabel: string
  onClick: () => void
  className?: string
  controls?: string
}

export function TableRowExpandButton({
  expanded,
  expandLabel,
  collapseLabel,
  onClick,
  className,
  controls,
}: TableRowExpandButtonProps) {
  const label = expanded ? collapseLabel : expandLabel
  const Icon = expanded ? ChevronUp : ChevronDown

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={onClick}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md bg-[#EAF1FF] text-[#2678F2] transition-colors hover:bg-[#D3D9E6] hover:text-[#226CDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2",
            className,
          )}
        >
          <Icon className="size-[18px]" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        <p className="text-[#143163]">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}