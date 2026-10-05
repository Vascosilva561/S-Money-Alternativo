import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { Deposit } from "@/types/depotiType"
import { statusDeposit } from "@/components/utils/statusDeposit"
import { statusDepositColor } from "@/components/utils/statusDepositColor"
import FilterDeposits from "@/components/pagamentosGPO/filter"
import ExportarDepositos from "@/components/pagamentosGPO/export"
import DetalhesDeposito from "@/components/pagamentosGPO/details"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { useSearchParams } from "react-router"

export default function Depositos() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [usersData, setUsersData] = useState<Deposit[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<Deposit[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<Deposit | undefined>()
    const [tipoDeConta, setTipoDeConta] = useState("User")
    const [status, setStatus] = useState("ACCEPTED")
    const [canal, setCanal] = useState("")
    const [searchParams] = useSearchParams();
    const nameUserSearch = searchParams.get("user_name_phone")

    const [queryParams, setQueryParams] = useState({
        user_name_phone: "",
        account_type: "",
        dataInicial: "",
        dataFinal: "",
        montante_de: "",
        montante_ate: ""
    })

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")

    async function getDeposits(page: number) {
        try {
            //const url = `/front/wallets?per_page=${perPage}&page=${page}`
            const Params = new URLSearchParams({
                status: status,
                user_name_phone: (nameUserSearch || queryParams?.user_name_phone) || "",
                account_type: tipoDeConta,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                montante_de: queryParams?.montante_de,
                montante_ate: queryParams?.montante_ate,
                canal: canal
            })?.toString()
            const urlDeposit = `/front/deposit_gpo_frame?per_page=${perPage}&page=${page}&${Params}`
            const { data } = await api.get(urlDeposit)

            setIsFiltered(false)
            setFilteredUsersData(data?.dados)
            setUsersData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isLoading, isFetching } = useQuery<Deposit>({
        queryKey: ['listaDeDepositos', currentPage, perPage, isFiltered],
        queryFn: () => getDeposits(currentPage),
        placeholderData: keepPreviousData,
    })

    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setUsersData(data?.dados?.slice(0, Number(perPage)));

            setFilteredUsersData(data?.dados?.slice(0, Number(perPage))); // Adiciona os dados iniciais
        }
    }, [data, perPage]);

    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };

    useEffect(() => {
        if (!usersData || usersData.length === 0) {
            setFilteredUsersData([]);
            return;
        }

        if (!searchInput) {
            setFilteredUsersData(usersData);
            return;
        }

        const searchTerm = searchInput.toLowerCase();

        const filtered = usersData.filter((item: any) => {
            const id = String(item?.id || '').toLowerCase();
            const userName = String(item?.user_name || '').toLowerCase();
            const paymentReference = String(item?.payment_reference || '').toLowerCase();
            const amount = item?.amount
                ? Number(item?.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '';
            const canal = String(item?.canal || '').toLowerCase();
            const date = item?.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).toLowerCase()
                : '';
            const status = String(statusDeposit(item?.status) || '').toLowerCase();

            return (
                id.includes(searchTerm) ||
                userName.includes(searchTerm) ||
                paymentReference.includes(searchTerm) ||
                amount.toLowerCase().includes(searchTerm) ||
                canal.includes(searchTerm) ||
                date.includes(searchTerm) ||
                status.includes(searchTerm)
            );
        });

        setFilteredUsersData(filtered);

    }, [usersData, searchInput]); // Atualiza ao mudar salesData ou searchTerm

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
            user_name_phone: "",
            account_type: "",
            dataInicial: "",
            dataFinal: "",
            montante_de: "",
            montante_ate: ""
        })
        setStatus("ACCEPTED")
        setTipoDeConta("User")
        setCanal("")
        setTimeout(() => refetch(), 0)
    }

    return (
        <>
            {/* exportar  */}
            <ExportarDepositos onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />

            {/* modal para filtrar */}
            <FilterDeposits
                setShowFilter={setShowClearFilter}
                filter={getDeposits}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                status={status}
                setStatus={setStatus}
                tipoDeConta={tipoDeConta}
                setTipoDeConta={setTipoDeConta}
                canal={canal}
                setCanal={setCanal}
            />

            {/*modal para ver detalhes */}
            <DetalhesDeposito itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">

                <div className="flex flex-col p-5">
                    <div className="flex space-x-4">
                        {/* <button onClick={() => setAddModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold  flex space-x-2 items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM13.53 14.47C13.823 14.763 13.823 15.238 13.53 15.531L11.53 17.531C11.461 17.6 11.3779 17.655 11.2859 17.693C11.1939 17.731 11.097 17.751 10.999 17.751C10.901 17.751 10.8039 17.731 10.7119 17.693C10.6199 17.655 10.537 17.6 10.468 17.531L8.46802 15.531C8.17502 15.238 8.17502 14.763 8.46802 14.47C8.76102 14.177 9.23605 14.177 9.52905 14.47L10.249 15.19V12C10.249 11.586 10.585 11.25 10.999 11.25C11.413 11.25 11.749 11.586 11.749 12V15.189L12.469 14.469C12.763 14.177 13.237 14.177 13.53 14.47Z" fill="#143163" />
                            </svg>
                            <span>Exportar</span>
                        </button> */}
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
                        <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total de valor recebido:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_amount ? Number(data?.total_amount)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>
                    <div className="border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">

                                    <th className="text-start px-4 py-2 w-[18%]">Utilizador</th>
                                    <th className={`text-start px-4 py-2 w-[18%]`}>Referência</th>
                                    <th className="text-start px-4 py-2 w-[15%]">Valor Recebido</th>
                                    <th className="text-start px-4 py-2 w-[10%]">Canal</th>
                                    <th className="ui-date-column text-center px-4 py-2 w-[14%]">Data/Pagamento</th>
                                    <th className="text-start px-4 py-2 w-[13%]">Estado do Depósito</th>
                                    <th className="text-start px-4 py-2 w-[12%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={8} state="loading" message="A carregar depósitos GPO..." /> :
                                    filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                        <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            {/* <td className="text-start py-2 px-3">{item?.id}</td> */}
                                            <td className="text-start py-2 px-3">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <p className="min-w-0 truncate font-semibold" title={item?.user_name}>{item?.user_name}</p>
                                                    <CopyTextButton value={item?.user_name} label="utilizador" />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <span title={item?.payment_reference}>{item?.payment_reference}</span>
                                                    <CopyTextButton value={item?.payment_reference} label="referência" />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">{formatCurrency(item?.amount)}</td>
                                            <td className="text-start py-2">
                                                <div className="flex items-center space-x-1">
                                                    {item?.canal}
                                                </div>
                                            </td>
                                            <td className="ui-date-column text-center py-2">{formatDateTime(item?.created_at)}</td>
                                            <td className="text-start py-2 pl-2">
                                                <span className={` h-6 rounded-full pr-3 pl-3 py-1 font-semibold ${statusDepositColor(item?.status)}`}>
                                                    {statusDeposit(item?.status)}
                                                </span>
                                            </td>
                                            <td className="text-start py-2 p-1">
                                                <div className="flex items-center space-x-2">
                                                    {/*detalhes */}
                                                    <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum depósito GPO encontrado." />
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
