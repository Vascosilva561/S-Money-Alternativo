import { Copy } from "lucide-react"

import { Copiar } from "@/hooks/copy"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type CopyTextButtonProps = {
    value?: string | number | null
    label: string
}

function CopyTextButton({ value, label }: CopyTextButtonProps) {
    const copyValue = value === null || value === undefined ? "" : String(value)

    if (!copyValue || copyValue === "N/A") return null

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={`Copiar ${label}`}
                    onClick={(event) => {
                        event.stopPropagation()
                        Copiar(copyValue)
                    }}
                    className="inline-flex h-5 w-5 min-w-5 shrink-0 items-center justify-center rounded-md text-[#637590] transition-colors hover:bg-[#EDF3FF] hover:text-[#2678F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2678F2] focus-visible:ring-offset-1"
                >
                    <Copy className="size-4" strokeWidth={2} aria-hidden="true" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
                <p className="text-[#143163]">Copiar {label}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export { CopyTextButton }
