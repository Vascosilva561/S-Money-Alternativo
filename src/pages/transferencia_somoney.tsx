import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { Transactions } from "@/types/transaction"
import { statusTransactions } from "@/components/utils/statusTransactions"
import { statusTransactionsColor } from "@/components/utils/statusTransactionsColor"
import FilterTransactions from "@/components/tranferenciaSOmoney/filter"
import Transferir from "@/components/tranferenciaSOmoney/transferir"
import Detalhes from "@/components/tranferenciaSOmoney/detalhes"
import ExpandirTransferencias from "@/components/tranferenciaSOmoney/expandirTransferencias"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { useSearchParams } from "react-router"
import { useSelectedAccount } from "@/context/selectedAccountCntext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function TranferenciaSomoney() {

    const [searchInput, setSearchInput] = useState("")
    const [usersData, setUsersData] = useState<Transactions[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<Transactions[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [particularAccount, _setParticularAccount] = useState(true)
    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<Transactions | undefined>()
    const [tipoDeContaEnviado, setTipoDeContaEnviado] = useState("User")
    const [tipoDeContaRecebido, setTipoDeContaRecebido] = useState("User")
    const [estadoDaTransacao, setEstadoDaTransacao] = useState("PAID")
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [queryParams, setQueryParams] = useState({
        id: "",
        remetente: "",
        destinatario: "",
        valorDe: "",
        valorAte: "",
        dataInicial: "",
        dataFinal: "",

    })
    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    const [searchParams] = useSearchParams();
    const userNameSearch = searchParams.get("sender_name");
    const { account } = useSelectedAccount()

    async function getUsers(page: number) {
        try {
            //const url = `/front/wallets?per_page=${perPage}&page=${page}`
            const Params = new URLSearchParams({
                status: estadoDaTransacao,
                sender_type: tipoDeContaEnviado,
                receiver_type: tipoDeContaRecebido,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                receiver_name: queryParams?.destinatario,
                sender_name: (userNameSearch || queryParams?.remetente) || "",
                valor_de: queryParams?.valorDe,
                valor_ate: queryParams?.valorAte

            })?.toString()
            const urlTransactions = `/front/transaction?per_page=100&page=${page}&${Params}`
            const { data } = await api.get(urlTransactions)

            setIsFiltered(false)
            setFilteredUsersData(data?.dados)
            setUsersData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isLoading, isFetching } = useQuery<Transactions>({
        queryKey: ['listaDeTransacoes', currentPage, 100, isFiltered],
        queryFn: () => getUsers(currentPage),
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
            const id = item?.id
            const remetente = item?.sender_name?.toLowerCase();
            const destinatario = item?.receiver_name?.toLowerCase();
            const montante = item?.amount?.toLowerCase();
            const data = item?.created_at?.toLowerCase();
            const estadoDaTransacao = item?.status?.toString().toLowerCase();

            return (
                id.includes(searchTerm) ||
                remetente.includes(searchTerm) ||
                destinatario.includes(searchTerm) ||
                montante.includes(searchTerm) ||
                data.includes(searchTerm) ||
                estadoDaTransacao.includes(searchInput)
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
    const totalPages = Math.ceil(totalItems / 100);
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
            remetente: "",
            destinatario: "",
            valorDe: "",
            valorAte: "",
            dataInicial: "",
            dataFinal: ""
        })

        setEstadoDaTransacao("PAID")
        setTipoDeContaRecebido("User")
        setTipoDeContaEnviado("User")
        setTimeout(() => refetch(), 0);
    }

    return (
        <>
            {/* modal para adicionar */}
            <Transferir onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} typeAccount={particularAccount} />

            {/* modal para filtrar */}
            <FilterTransactions
                setShowFilter={setShowClearFilter}
                filter={getUsers}
                setCurrentPage={() => setCurrentPage(1)}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                statusOfTransaction={estadoDaTransacao}
                setStatusOfTransaction={setEstadoDaTransacao}
                typeAccountReceiver={tipoDeContaRecebido}
                setTypeAccountReceiver={setTipoDeContaRecebido}
                setTypeAccountSender={setTipoDeContaEnviado}
                typeAccountSender={tipoDeContaEnviado}
            />

            {/*modal para ver detalhes */}
            <Detalhes itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">

                <div className="flex flex-col p-5">
                    <div className="flex space-x-4 justify-between mt-4">
                        <div className="flex space-x-2">
                            {!account &&
                                <Tooltip>
                                    <TooltipTrigger asChild>

                                        <button onClick={() => setAddModalIsOpen(true)} type="button" className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#143163] px-4 font-semibold text-white shadow-sm transition-colors hover:bg-[#1D467F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.9231 6.15077V5.84615C18.9231 3.36615 17.5569 2 15.0769 2H4.82051C3.26462 2 2 3.26462 2 4.82051V18.1538C2 20.6338 3.36615 22 5.84615 22H18.1538C20.6338 22 22 20.6338 22 18.1538V9.94872C22 7.73846 20.9149 6.41333 18.9231 6.15077ZM20.4615 15.8462H16.6154C15.6256 15.8462 14.8205 15.041 14.8205 14.0513C14.8205 13.0615 15.6256 12.2564 16.6154 12.2564H20.4615V15.8462ZM4.82051 3.53846H15.0769C16.6944 3.53846 17.3846 4.22872 17.3846 5.84615V6.10256H4.82051C4.11385 6.10256 3.53846 5.52718 3.53846 4.82051C3.53846 4.11385 4.11385 3.53846 4.82051 3.53846ZM18.1538 20.4615H5.84615C4.22872 20.4615 3.53846 19.7713 3.53846 18.1538V7.33228C3.92308 7.5292 4.35897 7.64103 4.82051 7.64103H18.1538C19.7713 7.64103 20.4615 8.33128 20.4615 9.94872V10.7179H16.6154C14.7774 10.7179 13.2821 12.2133 13.2821 14.0513C13.2821 15.8892 14.7774 17.3846 16.6154 17.3846H20.4615V18.1538C20.4615 19.7713 19.7713 20.4615 18.1538 20.4615ZM17.1385 13.0256H17.1487C17.7159 13.0256 18.1744 13.4851 18.1744 14.0513C18.1744 14.6174 17.7159 15.0769 17.1487 15.0769C16.5826 15.0769 16.118 14.6174 16.118 14.0513C16.118 13.4851 16.5723 13.0256 17.1385 13.0256Z" fill="currentColor" />
                            </svg>
                            <span>Transferir</span>
                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Transferir</TooltipContent>
                                </Tooltip>}
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
                        <span><strong>Total de valor da transações:</strong> <span className="font-semibold">{data?.total_amount ? Number(data?.total_amount)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    <div className="  border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">

                                    <th className="ui-expand-toggle-column text-start" ></th>
                                    <th className="ui-expand-leading-column text-start py-2 ">Remetente</th>
                                    <th className={`text-start py-2 `}>Destinatário</th>
                                    <th className="text-start py-2 ">Valor</th>
                                    <th className="ui-date-column text-center py-2">Data</th>
                                    <th className="text-start py-2 ">Estado</th>
                                    <th className="ui-actions-column text-start py-2 w-[5%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={7} state="loading" message="A carregar transferências..." /> :
                                    filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                        <>
                                            <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                                <td className="ui-expand-toggle-column">
                                                    <button
                                                        onClick={() =>
                                                            setExpandedRow(expandedRow === item?.id ? null : item?.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {expandedRow === item?.id ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 26 26" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C4.6879 2.00391 2.00385 4.68799 2 8V18C2.00378 21.312 4.68777 23.9961 7.99988 24H18C21.3121 23.9961 23.9962 21.312 24 18V8C23.9962 4.68799 21.3122 2.00391 18.0001 2H8ZM8 0H18C22.4183 0 26 3.58154 26 8V18C26 22.4185 22.4183 26 18 26H8C3.58173 26 0 22.4185 0 18V8C0 3.58154 3.58173 0 8 0Z" fill="#D9E1E7" />
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13V8C0 5.79086 0.781049 3.90524 2.34315 2.34315C3.90524 0.781049 5.79086 0 8 0H18C20.2091 0 22.0948 0.781049 23.6569 2.34315C25.2189 3.90524 26 5.79086 26 8V18C26 20.2091 25.2189 22.0948 23.6569 23.6569C22.0948 25.2189 20.2091 26 18 26H8C5.79086 26 3.90524 25.2189 2.34315 23.6569C0.781049 22.0948 0 20.2091 0 18V13Z" fill="#217EFD" />
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9185 11.3696L7.68951 16.561C7.30243 16.9458 6.67657 16.9458 6.28949 16.561C6.10425 16.3774 6 16.1284 6 15.8677C6 15.6069 6.10425 15.3579 6.28949 15.1743L12.2175 9.28857C12.6047 8.90381 13.2302 8.90381 13.6175 9.28857L19.5455 15.1743C19.7307 15.3579 19.835 15.6069 19.835 15.8677C19.835 16.1284 19.7307 16.3774 19.5455 16.561C19.1584 16.9458 18.5325 16.9458 18.1454 16.561L12.9185 11.3696Z" fill="white" />
                                                            </svg>
                                                            :
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 26 26" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9164 14.48L18.1454 9.28858C18.5325 8.90381 19.1584 8.90381 19.5455 9.28858C19.7307 9.47217 19.835 9.72119 19.835 9.98194C19.835 10.2427 19.7307 10.4917 19.5455 10.6753L13.6175 16.561C13.2302 16.9458 12.6047 16.9458 12.2175 16.561L6.28949 10.6753C6.10425 10.4917 6 10.2427 6 9.98193C6 9.72119 6.10425 9.47217 6.28949 9.28857C6.67657 8.90381 7.30243 8.90381 7.68951 9.28857L12.9164 14.48Z" fill="#ABB8C2" />
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C4.6879 2.00391 2.00385 4.68799 2 8V18C2.00378 21.312 4.68777 23.9961 7.99988 24H18C21.3121 23.9961 23.9962 21.312 24 18V8C23.9962 4.68799 21.3122 2.00391 18.0001 2H8ZM8 0H18C22.4183 0 26 3.58154 26 8V18C26 22.4185 22.4183 26 18 26H8C3.58173 26 0 22.4185 0 18V8C0 3.58154 3.58173 0 8 0Z" fill="#ABB8C2" />
                                                            </svg>
                                                        }
                                                    </button>
                                                </td>

                                                <td className="ui-expand-leading-column text-start py-2 truncate">
                                                    <div className="flex min-w-0 items-center gap-1.5 truncate">
                                                        <p className="min-w-0 truncate font-semibold">{item?.sender_name}</p>
                                                        <CopyTextButton value={item?.sender_name} label="remetente" />
                                                    </div>
                                                </td>
                                                <td className="text-start py-2 truncate">
                                                    <div className="flex min-w-0 items-center gap-1.5 truncate">
                                                        <p className="min-w-0 truncate font-semibold">{item?.receiver_name}</p>
                                                        <CopyTextButton value={item?.receiver_name} label="destinatário" />
                                                    </div>
                                                </td>
                                                <td className="text-start py-2 truncate">{formatCurrency(item?.amount)}</td>
                                                <td className="ui-date-column text-center py-2 truncate">{formatDateTime(item?.created_at)}</td>
                                                <td className={`text-start py-2 truncate`}>
                                                    <span className={`w-6 h-6 rounded-full pr-4 pl-4 py-1 
                                                         ${statusTransactionsColor(item?.status)}`}>{statusTransactions(item?.status)}</span></td>
                                                <td className="ui-actions-column text-start py-2 truncate p-1">
                                                    <div className="flex items-center space-x-2">
                                                        {/*detalhes */}
                                                        <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />

                                                    {/* baixar 
                                                <button
                                                    className="w-[30px] h-[30px]  bg-[#EADEF7] text-[#7D07AC] hover:bg-[#7D07AC] hover:text-[#fff] duration-300 rounded-[6px] grid place-items-center cursor-pointer">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.686 16.2229C16.9365 15.9724 16.9365 15.5662 16.686 15.3157C16.4354 15.0652 16.0301 15.0652 15.7787 15.3149L15.1631 15.9305V13.2038C15.1631 12.8498 14.8759 12.5625 14.5219 12.5625C14.1679 12.5625 13.8806 12.8498 13.8806 13.2038V15.9313L13.265 15.3157C13.0145 15.0652 12.6083 15.0652 12.3578 15.3157C12.1072 15.5662 12.1072 15.9724 12.3578 16.2229L14.0678 17.933C14.1268 17.992 14.1977 18.039 14.2764 18.0715C14.355 18.104 14.4381 18.1211 14.5219 18.1211C14.6057 18.1211 14.6885 18.104 14.7671 18.0715C14.8458 18.039 14.9169 17.992 14.9759 17.933L16.686 16.2229Z" fill="currentColor" />
                                                        <path d="M10.4596 17.0547H6.18441C4.83602 17.0547 4.26058 16.4792 4.26058 15.1309V4.87044C4.26058 3.52205 4.83602 2.94661 6.18441 2.94661H10.6733V4.87044C10.6733 6.93792 11.8122 8.07682 13.8797 8.07682H15.8035V10.0007C15.8035 10.3546 16.0908 10.6419 16.4448 10.6419C16.7988 10.6419 17.0861 10.3546 17.0861 10.0007V7.43555C17.0861 7.26539 17.0186 7.10208 16.898 6.98238L11.7678 1.85217C11.6472 1.73161 11.4848 1.66406 11.3146 1.66406H6.18441C4.11693 1.66406 2.97803 2.80297 2.97803 4.87044V15.1309C2.97803 17.1983 4.11693 18.3372 6.18441 18.3372H10.4596C10.8136 18.3372 11.1009 18.0499 11.1009 17.696C11.1009 17.342 10.8136 17.0547 10.4596 17.0547ZM11.9559 4.87044V3.85381L14.8963 6.79427H13.8797C12.5313 6.79427 11.9559 6.21883 11.9559 4.87044ZM7.68072 10.0007C7.68072 10.3546 7.39343 10.6419 7.03944 10.6419C6.68546 10.6419 6.39817 10.3546 6.39817 10.0007C6.39817 9.64667 6.68546 9.35937 7.03944 9.35937C7.39343 9.35937 7.68072 9.64667 7.68072 10.0007ZM7.68072 13.4208C7.68072 13.7748 7.39343 14.0621 7.03944 14.0621C6.68546 14.0621 6.39817 13.7748 6.39817 13.4208C6.39817 13.0668 6.68546 12.7795 7.03944 12.7795C7.39343 12.7795 7.68072 13.0668 7.68072 13.4208ZM13.0247 9.35937C13.3787 9.35937 13.666 9.64667 13.666 10.0007C13.666 10.3546 13.3787 10.6419 13.0247 10.6419H9.17703C8.82304 10.6419 8.53575 10.3546 8.53575 10.0007C8.53575 9.64667 8.82304 9.35937 9.17703 9.35937H13.0247ZM11.1009 13.4208C11.1009 13.7748 10.8136 14.0621 10.4596 14.0621H9.17703C8.82304 14.0621 8.53575 13.7748 8.53575 13.4208C8.53575 13.0668 8.82304 12.7795 9.17703 12.7795H10.4596C10.8136 12.7795 11.1009 13.0668 11.1009 13.4208Z" fill="currentColor" />
                                                    </svg>

                                                </button>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRow === item?.id && <tr className="ui-expandable-row border-t-1 border-[#EBECEF] ">
                                                <td className="ui-expandable-cell" colSpan={7}>
                                                    {<ExpandirTransferencias id={item?.id} estorno={item?.estorno} />}
                                                </td>
                                            </tr>}
                                        </>
                                    ) :
                                        <TableStateRow colSpan={7} state="empty" message="Nenhuma transferência encontrada." />
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
