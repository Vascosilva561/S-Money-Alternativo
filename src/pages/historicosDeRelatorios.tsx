import { api } from "@/api"
import { ReportHistoryPanel, type ReportHistoryItem, reportCategories } from "@/components/reports/report-history-panel"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"

type ListaRelatorio = {
    dados: ReportHistoryItem[]
    total: number
}

export default function HistoricoDeRelatorioPage() {
    const perPage = "100"
    const [currentPage, setCurrentPage] = useState(1)
    const [abaAtiva, setAbaAtiva] = useState<string>(reportCategories[0].id)

    async function getHistoryFiles(): Promise<ListaRelatorio> {
        const { data } = await api.get<ListaRelatorio>(`front/history_files?page=${currentPage}&account_type=${abaAtiva}`)
        return data ?? { dados: [], total: 0 }
    }

    const { data, isLoading } = useQuery<ListaRelatorio>({
        queryKey: ["relatorioList", currentPage, abaAtiva],
        queryFn: getHistoryFiles,
        placeholderData: keepPreviousData,
    })

    const generatePaginationRange = (totalPages: number, page: number): (number | string)[] => {
        const delta = 2
        const range: (number | string)[] = []

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                range.push(i)
            } else if (i === page - delta - 1 || i === page + delta + 1) {
                range.push("...")
            }
        }

        return range
    }

    const totalItems = data?.total || 0
    const totalPages = Math.ceil(totalItems / Number(perPage))
    const paginationRange = generatePaginationRange(totalPages, currentPage)
    const reports = data?.dados ?? []

    const handlePageChange = (page: number) => {
        if (page !== currentPage) setCurrentPage(page)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
    }

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1)
    }

    return (
        <>
            <ReportHistoryPanel
                activeCategory={abaAtiva}
                onCategoryChange={(category) => { setAbaAtiva(category); setCurrentPage(1) }}
                reports={reports}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                paginationRange={paginationRange}
                onPageChange={handlePageChange}
                onPreviousPage={handlePrevPage}
                onNextPage={handleNextPage}
            />
        </>
    )
}
