
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type PaymentFilters = {
    payment_reference: string
    payment_status: string
    mft_status: string
    prt_status: string
    payment_id: string
    start_date: string
    end_date: string
    cursor: string
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
}

export default function FilterPaymentsReference({
    onClose,
    isOpen,
    queryParams,
    setQueryParams,
    filter,
    setIsFiltered,
    setShowFilter,
}: Props) {

    const mostraLimparFiltro = () => {
        const hasFilter =
            queryParams.payment_reference !== "" ||
            queryParams.payment_status !== "" ||
            queryParams.mft_status !== "" ||
            queryParams.prt_status !== "" ||
            queryParams.payment_id !== "" ||
            queryParams.start_date !== "" ||
            queryParams.end_date !== ""

        setShowFilter(hasFilter)
    }

    const handleFilter = () => {
        setIsFiltered(true)
        setQueryParams(prev => ({
            ...prev,
            cursor: ""
        }))
        mostraLimparFiltro()
        filter("")
    }

    return (
        <Sheet onOpenChange={onClose} open={isOpen}>
            <SheetContent
                style={{ minWidth: "35%" }}
                className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none"
            >
                <div className="flex justify-between items-center w-full">
                    <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                        Filtrar Dados
                    </SheetHeader>

                    <SheetClose className="cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="25" height="25" rx="8" />
                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>
                </div>

                <div>
                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            ID do Pagamento
                        </label>
                        <input
                            type="text"
                            value={queryParams.payment_id}
                            onChange={e =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    payment_id: e.target.value
                                }))
                            }
                            className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            Referência do Pagamento
                        </label>
                        <input
                            type="text"
                            value={queryParams.payment_reference}
                            onChange={e =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    payment_reference: e.target.value
                                }))
                            }
                            className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            Estado do Pagamento
                        </label>

                        <Select
                            value={queryParams.payment_status}
                            onValueChange={value =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    payment_status: value
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="SUCCESS">
                                    Sucesso
                                </SelectItem>

                                <SelectItem value="ERROR">
                                    Falhou
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            Estado MFT
                        </label>

                        <Select
                            value={queryParams.mft_status}
                            onValueChange={value =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    mft_status: value
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="SUCCESS">
                                    Sucesso
                                </SelectItem>

                                <SelectItem value="ERROR">
                                    Falhou
                                </SelectItem>

                                <SelectItem value="PENDING">
                                    Pendente
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            Estado PRT
                        </label>

                        <Select
                            value={queryParams.prt_status}
                            onValueChange={value =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    prt_status: value
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="SUCCESS">
                                    Sucesso
                                </SelectItem>

                                <SelectItem value="ERROR">
                                    Falhou
                                </SelectItem>

                                <SelectItem value="PENDING">
                                    Pendente
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between space-x-2">
                        <div className="flex flex-col space-y-2 mt-5 w-full">
                            <label className="text-[#143163] font-semibold text-sm">
                                Data Inicial
                            </label>

                            <input
                                type="date"
                                value={queryParams.start_date}
                                onChange={e =>
                                    setQueryParams(prev => ({
                                        ...prev,
                                        start_date: e.target.value
                                    }))
                                }
                                className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                            />
                        </div>

                        <div className="flex flex-col space-y-2 mt-5 w-full">
                            <label className="text-[#143163] font-semibold text-sm">
                                Data Final
                            </label>

                            <input
                                type="date"
                                value={queryParams.end_date}
                                onChange={e =>
                                    setQueryParams(prev => ({
                                        ...prev,
                                        end_date: e.target.value
                                    }))
                                }
                                className="p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">
                            Limite de resultados
                        </label>

                        <Select
                            value={String(queryParams.limit)}
                            onValueChange={value =>
                                setQueryParams(prev => ({
                                    ...prev,
                                    limit: Number(value)
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <SheetClose
                        onClick={handleFilter}
                        className="w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        type="button"
                    >
                        Filtrar
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}
