import { PaginationFooter } from "@/components/ui/pagination-footer"
import { Spinner } from "@/components/utils/spinner"
import { Download, FileText } from "lucide-react"
import type { ReactNode } from "react"

export type ReportHistoryItem = {
  link: string
  titulo: string
}

export const reportCategories = [
  { id: "User", label: "Gestão de Utilizadores" },
  { id: "Transferencias", label: "Transferência" },
  { id: "Pagamentos", label: "Pagamentos" },
  { id: "Depositos", label: "Depósitos" },
  { id: "Levantamentos", label: "Levantamentos" },
  { id: "Movimentos", label: "Movimentos" },
] as const

export const userContextReportCategories = [
  { id: "transferencias", label: "Transferências" },
  { id: "pagamentos", label: "Pagamentos" },
  { id: "depositos", label: "Depósitos" },
  { id: "levantamentos", label: "Levantamentos" },
  { id: "conta-corrente", label: "Movimentos" },
] as const

type ReportCategory = { id: string; label: string }

type ReportHistoryPanelProps = {
  activeCategory: string
  onCategoryChange: (category: string) => void
  reports: ReportHistoryItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  paginationRange: (number | string)[]
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  showCategoryTabs?: boolean
  categories?: readonly ReportCategory[]
  emptyTitle?: string
  emptyDescription?: ReactNode
}

export function ReportHistoryPanel({
  activeCategory,
  onCategoryChange,
  reports,
  isLoading,
  currentPage,
  totalPages,
  paginationRange,
  onPageChange,
  onPreviousPage,
  onNextPage,
  showCategoryTabs = true,
  categories = reportCategories,
  emptyTitle = "Nenhum relatório encontrado",
  emptyDescription = "Ainda não existem relatórios disponíveis nesta categoria.",
}: ReportHistoryPanelProps) {
  return (
    <>
      {showCategoryTabs && (
        <div className="ui-tabs z-40 flex w-full" role="tablist" aria-label="Tipo de relatório">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`grid w-full cursor-pointer place-items-center rounded-t p-2 text-[14px] font-semibold text-[#143163] ${activeCategory === category.id
                ? "h-[40px] border-t-4 border-[#48B9FF] bg-white"
                : "mt-1.5 h-[35px] border-t border-t-[#A9B8CF] bg-[#FAFAFA]"
                } border-x-2 border-x-[#C8D7EF]`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <section className={`ui-data-page relative h-fit border-x-2 border-b-2 border-x-[#C8D7EF] border-b-[#C8D7EF] bg-white text-sm shadow-lg ${showCategoryTabs ? "rounded-b-lg" : "rounded-lg border-t-2 border-t-[#C8D7EF]"}`}>
        <div className="flex flex-col gap-5 px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8 lg:px-10 lg:pb-10 lg:pt-10">
          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center gap-3 rounded-xl border border-[#E5EBF4] bg-[#FBFCFE] text-[#637590]">
              <Spinner color="#143163" width="8" height="8" />
              <span>A carregar relatórios...</span>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-3" aria-label="Lista de relatórios">
              {reports.map((report) => (
                <div
                  key={`${report.titulo}-${report.link}`}
                  className="group flex min-h-[58px] w-full items-center justify-between gap-4 rounded-xl border border-[#D7E2F2] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(20,49,99,0.04)] transition-all hover:border-[#9FC8F5] hover:bg-[#F8FBFF] hover:shadow-[0_4px_12px_rgba(20,49,99,0.06)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#EDF5FF] text-[#2678F2]">
                      <FileText className="size-4" aria-hidden="true" />
                    </span>
                    <p title={report.titulo} className="min-w-0 truncate font-semibold text-[#143163]">
                      {report.titulo}
                    </p>
                  </div>

                  <a
                    href={report.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Baixar ${report.titulo}`}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#48B9FF] bg-white px-3.5 text-sm font-semibold text-[#2678F2] transition-colors hover:bg-[#2678F2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2"
                  >
                    <span>Baixar</span>
                    <Download className="size-4" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#C8D7EF] bg-[#FBFCFE] px-6 text-center">
              <span className="grid size-11 place-items-center rounded-full bg-[#EDF5FF] text-[#2678F2]">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 font-semibold text-[#143163]">{emptyTitle}</p>
              <p className="mt-1 max-w-2xl text-sm text-[#637590]">{emptyDescription}</p>
            </div>
          )}

          <div className="border-t border-[#EEF2F7] pt-5">
            <PaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              paginationRange={paginationRange}
              onPageChange={onPageChange}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
            />
          </div>
        </div>
      </section>
    </>
  )
}
