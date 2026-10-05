import { Button } from "@/components/ui/button"
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
    SheetHeader,
} from "@/components/ui/sheet"
import { X } from "lucide-react"

export type PaymentFilters = {
    payment_reference: string
    payment_status: string
    mft_status: string
    prt_status: string
    payment_id: string
    start_date: string
    end_date: string
    limit: number
}

type Props = {
    isOpen: boolean
    onClose: () => void
    queryParams: PaymentFilters
    setQueryParams: React.Dispatch<React.SetStateAction<PaymentFilters>>
    filter: (cursor?: string) => void
    setIsFiltered: (value: boolean) => void
    setShowFilter: (value: boolean) => void
    setCursor: React.Dispatch<React.SetStateAction<string>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setCursorHistory: React.Dispatch<React.SetStateAction<string[]>>
}

export default function FilterPaymentsReference({
    onClose,
    isOpen,
    queryParams,
    setQueryParams,
    filter,
    setIsFiltered,
    setShowFilter,
    setCursor,
    setCurrentPage,
    setCursorHistory,
}: Props) {
    const hasFilter = () =>
        queryParams.payment_reference !== "" ||
        queryParams.payment_status !== "" ||
        queryParams.mft_status !== "" ||
        queryParams.prt_status !== "" ||
        queryParams.payment_id !== "" ||
        queryParams.start_date !== "" ||
        queryParams.end_date !== ""

    const handleFilter = () => {
        setIsFiltered(true)
        setCursor("")
        setCurrentPage(1)
        setCursorHistory([""])
        setShowFilter(hasFilter())
        filter("")
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="ui-filter-sheet-panel w-full overflow-y-auto p-5 sm:max-w-[440px] sm:p-6">
                <div className="flex w-full items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                    <SheetHeader
                        className="p-0 text-lg font-semibold text-[#143163]"
                        description="Defina os critérios que pretende aplicar para refinar a lista."
                    >
                        Filtrar Dados
                    </SheetHeader>
                    <SheetClose
                        aria-label="Fechar filtros"
                        className="rounded p-2 text-[#143163] transition-colors hover:bg-[#EAF6F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="space-y-5 overflow-y-auto py-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="payment-id" className="text-sm font-semibold text-[#143163]">ID do Pagamento</label>
                        <input
                            id="payment-id"
                            type="text"
                            value={queryParams.payment_id}
                            onChange={(event) => setQueryParams((prev) => ({ ...prev, payment_id: event.target.value }))}
                            className="ui-control h-10 rounded-lg border border-[#C9D8E9] px-3 text-sm text-[#143163] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#48B9FF]/15"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="payment-reference" className="text-sm font-semibold text-[#143163]">Referência do Pagamento</label>
                        <input
                            id="payment-reference"
                            type="text"
                            value={queryParams.payment_reference}
                            onChange={(event) => setQueryParams((prev) => ({ ...prev, payment_reference: event.target.value }))}
                            className="ui-control h-10 rounded-lg border border-[#C9D8E9] px-3 text-sm text-[#143163] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#48B9FF]/15"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#143163]">Estado do Pagamento</label>
                        <Select value={queryParams.payment_status} onValueChange={(value) => setQueryParams((prev) => ({ ...prev, payment_status: value }))}>
                            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                                <SelectItem value="ERROR">Falhou</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#143163]">Estado MFT</label>
                        <Select value={queryParams.mft_status} onValueChange={(value) => setQueryParams((prev) => ({ ...prev, mft_status: value }))}>
                            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                                <SelectItem value="ERROR">Falhou</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#143163]">Estado PRT</label>
                        <Select value={queryParams.prt_status} onValueChange={(value) => setQueryParams((prev) => ({ ...prev, prt_status: value }))}>
                            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                                <SelectItem value="ERROR">Falhou</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="payment-start-date" className="text-sm font-semibold text-[#143163]">Data Inicial</label>
                            <input
                                id="payment-start-date"
                                type="date"
                                value={queryParams.start_date}
                                onChange={(event) => setQueryParams((prev) => ({ ...prev, start_date: event.target.value }))}
                                className="ui-control h-10 rounded-lg border border-[#C9D8E9] px-3 text-sm text-[#143163] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#48B9FF]/15"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="payment-end-date" className="text-sm font-semibold text-[#143163]">Data Final</label>
                            <input
                                id="payment-end-date"
                                type="date"
                                value={queryParams.end_date}
                                onChange={(event) => setQueryParams((prev) => ({ ...prev, end_date: event.target.value }))}
                                className="ui-control h-10 rounded-lg border border-[#C9D8E9] px-3 text-sm text-[#143163] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#48B9FF]/15"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#143163]">Limite de resultados</label>
                        <Select
                            value={String(queryParams.limit)}
                            onValueChange={(value) => setQueryParams((prev) => ({ ...prev, limit: Number(value) }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-auto border-t border-[#E5EBF4] pt-4">
                    <SheetClose asChild>
                        <Button onClick={handleFilter} className="h-11 w-full rounded-lg" type="button" variant="brand">
                            Filtrar
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}
