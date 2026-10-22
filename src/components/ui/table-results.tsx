import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type TableResultsProps = {
  /** Descriptive copy, including agreement: e.g. "Pagamentos encontrados". */
  label: string
  /** Optional domain metrics shown beside the page result count. */
  leadingContent?: ReactNode
  /** Rows actually rendered on this page, after any local search. */
  visibleCount: number
  /** Total returned by the data source. Omit when a cursor API has no total. */
  totalCount?: number | string | null
  currentPage: number
  totalPages: number
  onPreviousPage: () => void
  onNextPage: () => void
  isLoading?: boolean
}

const numberFormatter = new Intl.NumberFormat("pt-AO")

export function TableResultsHeader({
  label,
  leadingContent,
  visibleCount,
  totalCount,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  isLoading = false,
}: TableResultsProps) {
  const hasLeadingContent = leadingContent !== undefined && leadingContent !== null
  const parsedTotal = totalCount === null || totalCount === undefined || String(totalCount).trim() === ""
    ? undefined
    : Number(totalCount)
  const hasTotal = parsedTotal !== undefined && Number.isFinite(parsedTotal) && parsedTotal >= 0
  const count = numberFormatter.format(visibleCount)
  const resultStatus = (
    <>
      <p className="ui-table-results-summary" role="status" aria-live="polite" aria-atomic="true">
        <span>{label}</span>
        <span aria-hidden="true"> — </span>
        <span>{isLoading ? "A carregar…" : hasTotal
          ? `${count} de ${numberFormatter.format(parsedTotal)}`
          : `${count} nesta página`}</span>
      </p>
      <nav className="ui-table-results-navigation" aria-label={`Paginação superior: ${label.toLocaleLowerCase("pt-AO")}`}>
        <button
          type="button"
          aria-label="Página anterior"
          disabled={isLoading || currentPage <= 1}
          onClick={onPreviousPage}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Próxima página"
          disabled={isLoading || totalPages <= 0 || currentPage >= totalPages}
          onClick={onNextPage}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </>
  )

  return (
    <div className={`ui-table-results-header${hasLeadingContent ? " ui-table-results-header-with-leading-content" : ""}`} aria-busy={isLoading}>
      {hasLeadingContent && <div className="ui-table-results-leading-content">{leadingContent}</div>}
      {hasLeadingContent
        ? <div className="ui-table-results-status-group">{resultStatus}</div>
        : resultStatus}
    </div>
  )
}

/** Keeps the summary outside the table's horizontal scrolling surface. */
export function TableResults({ children, containerClassName = "overflow-x-auto", ...props }: TableResultsProps & {
  children: ReactNode
  containerClassName?: string
}) {
  return (
    <div className="ui-table-results">
      <TableResultsHeader {...props} />
      <div className={`ui-table-results-surface ${containerClassName}`}>{children}</div>
    </div>
  )
}
