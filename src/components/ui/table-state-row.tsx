import { Inbox, LoaderCircle } from "lucide-react"
import type { ReactNode } from "react"

type TableStateRowProps = {
    colSpan: number
    state: "loading" | "empty"
    message: string
    children?: ReactNode
}

function TableStateRow({ colSpan, state, message, children }: TableStateRowProps) {
    const isLoading = state === "loading"
    const Icon = isLoading ? LoaderCircle : Inbox

    return (
        <tr>
            <td colSpan={colSpan} className="p-0 text-[#637590]">
                <div
                    className="flex min-h-[144px] flex-col items-center justify-center gap-2 px-4 py-8 text-center"
                    role={isLoading ? "status" : undefined}
                    aria-live={isLoading ? "polite" : undefined}
                >
                    <Icon
                        className={`size-7 ${isLoading ? "animate-spin text-[#2678F2]" : "text-[#8293AE]"}`}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-[#637590]">{message}</span>
                    {children}
                </div>
            </td>
        </tr>
    )
}

export { TableStateRow }
