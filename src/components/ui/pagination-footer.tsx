import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationItem = number | string

type PaginationFooterProps = {
    currentPage: number
    totalPages: number
    paginationRange: PaginationItem[]
    onPageChange: (page: number) => void
    onPreviousPage: () => void
    onNextPage: () => void
}

export function PaginationFooter({
    currentPage,
    totalPages,
    paginationRange,
    onPageChange,
    onPreviousPage,
    onNextPage,
}: PaginationFooterProps) {
    const pageCount = Math.max(totalPages, 1)
    const visiblePage = Math.min(Math.max(currentPage, 1), pageCount)
    const pages = paginationRange.length > 0 ? paginationRange : [1]

    return (
        <nav className="ui-pagination flex w-full flex-wrap items-center justify-between gap-3 pt-1" aria-label="Paginação">
            <p className="text-sm text-[#637590]">
                Página <span className="font-semibold text-[#143163]">{visiblePage}</span> de{" "}
                <span className="font-semibold text-[#143163]">{pageCount}</span>
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onPreviousPage}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                    className="grid size-9 place-items-center rounded-lg border border-[#D7E2F2] text-[#143163] transition-colors hover:bg-[#F1F5FA] disabled:cursor-not-allowed disabled:text-[#B4BFCE]"
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                </button>

                {pages.map((item, index) => (
                    typeof item === "number" ? (
                        <button
                            key={`${item}-${index}`}
                            type="button"
                            onClick={() => onPageChange(item)}
                            disabled={currentPage === item}
                            aria-label={`Ir para a página ${item}`}
                            aria-current={currentPage === item ? "page" : undefined}
                            className={`grid size-9 place-items-center rounded-lg text-sm transition-colors ${currentPage === item
                                ? "bg-[#143163] font-semibold text-white"
                                : "text-[#143163] hover:bg-[#F1F5FA]"
                                }`}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={`${item}-${index}`} className="px-1 text-sm text-[#9AAAC0]" aria-hidden="true">
                            ...
                        </span>
                    )
                ))}

                <button
                    type="button"
                    onClick={onNextPage}
                    disabled={currentPage >= totalPages || totalPages === 0}
                    aria-label="Próxima página"
                    className="grid size-9 place-items-center rounded-lg border border-[#D7E2F2] text-[#143163] transition-colors hover:bg-[#F1F5FA] disabled:cursor-not-allowed disabled:text-[#B4BFCE]"
                >
                    <ChevronRight className="size-4" aria-hidden="true" />
                </button>
            </div>
        </nav>
    )
}
