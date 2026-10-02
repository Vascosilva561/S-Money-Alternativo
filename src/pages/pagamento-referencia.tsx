import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { statusPayment } from "@/components/utils/statusPayment"
import { statusPaymentColor } from "@/components/utils/statusPaymentColor"
import ExportarPagamentos from "@/components/pagamentos/exportar"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import type { ReferencePaymentResponse, ReferencePaymentType } from "@/types/reference_payment"
import DetalhesPagamentoReference from "@/components/pagamento-referenecia/details"
import FilterPaymentsReference from "@/components/pagamento-referenecia/filter"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"

export default function PagamentosReferencia() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<ReferencePaymentType | undefined>()
    const [estadoDoPagamento, setEstadoDoPagamento] = useState("")
    const [channel, setChannel] = useState("")

    const [queryParams, setQueryParams] = useState({
        id: "",
        users_name: "",
        account_type: "",
        dataInicial: "",
        dataFinal: "",
        reference: ""

    })

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro

    async function getPayments(page: number) {
        try {
            const Params = new URLSearchParams({
                status: estadoDoPagamento,
                users_name: queryParams?.users_name,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                channel: channel,
                reference: queryParams?.reference
            })?.toString()
            const urlPayments = `/front/payment_reference?per_page=${perPage}&page=${page}&${Params}`
            const { data } = await api.get(urlPayments)

            setIsFiltered(false)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isLoading, isFetching } = useQuery<ReferencePaymentResponse>({
        queryKey: ['listaPagamentosReferencia', currentPage, perPage, isFiltered],
        queryFn: () => getPayments(currentPage),
        placeholderData: keepPreviousData,
    })



    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };

    const filteredUsersData = useMemo(() => {
        if (!data?.dados?.length) {
            return [];
        }

        if (!searchInput) {
            return data.dados;
        }

        const searchTerm = searchInput.toLowerCase();

        return data.dados.filter((item: any) => {
            const id = String(item?.id || '').toLowerCase();

            const fullNameOrBusiness =
                !item?.email
                    ? `${item?.account?.first_name || ''} ${item?.account?.last_name || ''}`.toLowerCase()
                    : `${item?.account?.business_name || ''}`.toLowerCase();

            const phone = String(
                item?.reference || ''
            ).toLowerCase();

            const entity = String(item?.entity || '').toLowerCase();

            const amount = item?.amount
                ? Number(item.amount).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                })
                : '';

            const date = item?.created_at
                ? new Date(item.created_at)
                    .toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                    .toLowerCase()
                : '';

            const status = String(
                statusPayment(item?.status) || ''
            ).toLowerCase();

            return (
                id.includes(searchTerm) ||
                fullNameOrBusiness.includes(searchTerm) ||
                phone.includes(searchTerm) ||
                entity.includes(searchTerm) ||
                amount.toLowerCase().includes(searchTerm) ||
                date.includes(searchTerm) ||
                status.includes(searchTerm)
            );
        });
    }, [data?.dados, searchInput]);


    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" || event.key === 'Backspace') {
            handleSearch(searchInput);
        }
        if (event.target.value) {
            handleSearch(event.target.value);
        }
    };

    const generatePaginationRange = (totalPages: number, currentPage: number): (number | string)[] => {
        const delta = 2; // Mostra 2 páginas antes e depois da atual
        const range: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                range.push('...');
            }
        }

        return range;
    };

    const totalItems = data?.total || 0; // Total de registros da API
    const totalPages = Math.ceil(totalItems / Number(perPage));
    const paginationRange = generatePaginationRange(totalPages, currentPage);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    const handleNextPage = async () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = async () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const limparFiltro = () => {
        setShowClearFilter(false)
        setQueryParams({
            ...queryParams,
            id: "",
            users_name: "",
            account_type: "",
            dataInicial: "",
            dataFinal: "",
            reference: ""

        })
        setEstadoDoPagamento("SUCCESS")
        //setTipoDeConta("User")
        setChannel("")
        setTimeout(() => refetch(), 0)
    }

    return (
        <>
            {/* modal para adicionar */}
            <ExportarPagamentos onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />

            {/* modal para filtrar */}
            <FilterPaymentsReference
                setShowFilter={setShowClearFilter}
                filter={getPayments}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                estadoDoPagamento={estadoDoPagamento}
                setEstadoDoPagamento={setEstadoDoPagamento}
                channel={channel}
                setChannel={setChannel}
            />

            {/*modal para ver detalhes */}
            <DetalhesPagamentoReference itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">

                <div className="flex flex-col p-5">
                    <div className="flex space-x-4">

                        <button onClick={() => setFilterModalIsOpen(true)} type="button" aria-label="Filtrar" className="ui-filter-trigger" title="Filtrar">
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16l-6.5 7v5l-3 2v-7L4 5z" /></svg>
                                </button>
                        <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                        {showClearFilter &&
                            <button onClick={() => limparFiltro()} type="button" className="ui-clear-filter-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                                </svg>
                                <span>Limpar Filtro</span>
                            </button>
                        }
                    </div>

                    <div className="flex justify-between space-x-4 items-center text-[#143163] mt-5">
                        <div className="flex space-x-2 ">

                            {!isLoading && (isFetching && <>
                                <div className=" grid place-items-center">
                                    <Spinner color="#143163" width="6" height="6" />
                                </div>
                                <p>A carregar...</p>
                            </>)}
                        </div>
                            <div className="flex justify-end space-x-4 items-center text-[#143163]">

                            <div className="bg-white relative block rounded-lg items-center">
                                <svg className="absolute inset-y-2 ml-1 left-0 flex items-center cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.5">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1879 15.9746C15.8264 14.4284 17.5225 10.2257 15.9762 6.5875C14.4298 2.94933 10.2267 1.25343 6.58814 2.79962C2.94961 4.34581 1.25355 8.54857 2.79989 12.1867C4.34623 15.8249 8.54939 17.5208 12.1879 15.9746Z" stroke="#273142" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.4473 14.4486L19.9991 20.0007" stroke="#273142" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                </svg>

                                <input type="search" placeholder="Pesquise..." onKeyDown={handleKeyDown} value={searchInput} onChange={(e) => handleSearch(e.target.value)} className="p-2 rounded-[6px] ring-1 ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] w-full focus:outline-none text-sm text-[#8998B1] pl-8" />
                            </div>
                        </div>
                    </div>

                    {/* Tabela */}

                    <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                        <span>
                            <strong>Entidade Sómoney:</strong>
                            <span className="inline-flex items-center gap-1.5">
                                <span>11269</span>
                                <CopyTextButton value="11269" label="entidade Sómoney" />
                            </span>
                        </span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total || "Nenhum valor encontrado"}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total geral de pagamentos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_amount ? Number(data?.total_amount)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    <div className=" border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">
                                    <th className="text-start px-4 py-2 w-[20%]">Utilizador</th>
                                    <th className={`text-start py-2 w-[20%]`}>Referência</th>
                                    <th className="text-start  py-2 ">Valor</th>
                                    <th className="ui-date-column text-center  py-2 ">Data</th>
                                    <th className="text-start  py-2 ">Estado</th>
                                    <th className="text-start  py-2 w-[10%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={6} state="loading" message="A carregar pagamentos por referência..." /> :
                                    filteredUsersData.length > 0 ? filteredUsersData.map((item: ReferencePaymentType) =>
                                        <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            <td className="text-start py-2 px-3">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <p className="min-w-0 truncate font-semibold">{!item?.account?.email ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}` :
                                                        `${(item?.account?.business_name?.length > 20 ? item?.account?.business_name?.slice(0, 20) + "..." : item?.account?.business_name) || "N/A"}`}</p>
                                                    <CopyTextButton
                                                        value={!item?.account?.email
                                                            ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}`
                                                            : item?.account?.business_name || "N/A"}
                                                        label="utilizador"
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{item?.reference ?? "N/A"}</span>
                                                    <CopyTextButton value={item?.reference} label="referência" />
                                                </div>
                                            </td>

                                            <td className="text-start py-2 font-semibold">{formatCurrency(item?.amount)}</td>
                                            <td className="ui-date-column text-center py-2">{formatDateTime(item?.created_at)}</td>
                                            <td className="text-start py-2 pl-2">
                                                <span className={` h-6 rounded-full pr-3 pl-3 py-1 font-semibold ${statusPaymentColor(item?.status)}`}>
                                                    {statusPayment(item?.status)}
                                                </span>
                                            </td>
                                            <td className="text-start py-2 p-1">
                                                {/*detalhes */}
                                                <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={6} state="empty" message="Nenhum pagamento por referência encontrado." />
                                }

                            </tbody>
                        </table>

                    </div>
                    {/* paginacao */}

                    <PaginationFooter
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginationRange={paginationRange}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />

                </div>


            </section>

        </>
    )
}
