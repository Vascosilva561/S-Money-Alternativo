import { api } from "@/api"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import type { Logs } from "@/types/logs"
import { StatusLogsColor } from "@/components/utils/getLogsStatusCOlor"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { formatDateTime } from "@/components/utils/formmat"
import { CopyTextButton } from "@/components/ui/copy-text-button"


export default function Logs() {

    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [_filterModalIsOpen, _setFilterModalIsOpen] = useState(false)
    const [tipoDeConta, _setTipoDeConta] = useState("User")
    const [estadoDoPagamento, _setEstadoDoPagamento] = useState("")
    const [servico, _setServico] = useState("")
    const [recursoAfetado, _setRecursoAfetado] = useState("")
    const [usuario, _setUsuario] = useState("")
    const [queryParams, _setQueryParams] = useState({
        id: "",
        users_name: "",
        account_type: "",
        dataInicial: "",
        dataFinal: "",
        beneficiario: ""

    })

    const [isFiltered, _setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")

    async function getPayments(page: number) {
        try {
            const Params = new URLSearchParams({
                status: estadoDoPagamento,
                user_name: usuario,
                account_type: tipoDeConta,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                servico: servico,
                recurso_afetado: recursoAfetado
            })?.toString()
            const urlLogs = isFiltered ? `/front/loggers?per_page=100&page=${page}&${Params}` : `/front/loggers?per_page=100&page=${page}`

            const { data } = await api.get(urlLogs)

            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, isFetching, isLoading } = useQuery<Logs>({
        queryKey: ['ListaDeLogs', currentPage, 100, isFiltered],
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
        const logs = data?.dados ?? [];

        if (!searchInput.trim()) {
            return logs;
        }

        const normalizedSearch = searchInput.toLowerCase().trim();

        return logs.filter((item) => {
            const date = item?.created_at
                ? new Date(item.created_at)
                    .toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "medium",
                    })
                    .toLowerCase()
                : "";

            const userName = String(item?.user_name ?? "").toLowerCase();
            const cargo = String(item?.cargo ?? "").toLowerCase();
            const accao = String(item?.accao ?? "").toLowerCase();
            const recurso = String(item?.recurso_afetado ?? "").toLowerCase();
            const status = String(item?.status ?? "").toLowerCase();

            return (
                date.includes(normalizedSearch) ||
                userName.includes(normalizedSearch) ||
                cargo.includes(normalizedSearch) ||
                accao.includes(normalizedSearch) ||
                recurso.includes(normalizedSearch) ||
                status.includes(normalizedSearch)
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

    return (
        <>
            {/* modal para adicionar
            <ExportarLogs onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />*/}

            {/* modal para filtrar */}
            {/* <FilterLogs
                setShowFilter={setShowClearFilter
                filter={getPayments}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                estadoDoPagamento={estadoDoPagamento}
                setEstadoDoPagamento={setEstadoDoPagamento}
                tipoDeConta={tipoDeConta}
                setTipoDeConta={setTipoDeConta}
                usuario={usuario}
                setUsuario={setUsuario}
                recursoAfetado={recursoAfetado}
                setRecursoAfetado={setRecursoAfetado}
            />*/ }

            {/*modal para ver detalhes */}
            {/* <DetalhesLogs itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} /> */}

            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">

                <div className="flex flex-col p-5 ">
                    {/* <div className="flex space-x-4">
                        <button onClick={() => setAddModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold  flex space-x-2 items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM13.53 14.47C13.823 14.763 13.823 15.238 13.53 15.531L11.53 17.531C11.461 17.6 11.3779 17.655 11.2859 17.693C11.1939 17.731 11.097 17.751 10.999 17.751C10.901 17.751 10.8039 17.731 10.7119 17.693C10.6199 17.655 10.537 17.6 10.468 17.531L8.46802 15.531C8.17502 15.238 8.17502 14.763 8.46802 14.47C8.76102 14.177 9.23605 14.177 9.52905 14.47L10.249 15.19V12C10.249 11.586 10.585 11.25 10.999 11.25C11.413 11.25 11.749 11.586 11.749 12V15.189L12.469 14.469C12.763 14.177 13.237 14.177 13.53 14.47Z" fill="#143163" />
                            </svg>
                            <span>Exportar</span>
                        </button>
                        <button onClick={() => setFilterModalIsOpen(true)} type="button" aria-label="Filtrar" className="ui-filter-trigger" title="Filtrar">
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16l-6.5 7v5l-3 2v-7L4 5z" /></svg>
                                </button>
                        {showClearFilter &&
                            <button onClick={() => limparFiltro()} type="button" className="ui-clear-filter-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                                </svg>
                                <span>Limpar Filtro</span>
                            </button>
                        }
                    </div> */}

                    {/* filtros */}
                    <div>

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
                    <div className="logs-table-wrapper mt-10 border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">

                                    {/* <th className={`text-start px-8 py-2 w-[20%]`}>ID do Pagamento</th> */}
                                    <th className="ui-date-column text-center px-4 py-2 w-[18%]">Data/Hora</th>
                                    <th className={`text-start px-4 py-2 w-[18%]`}>Utilizador backoffice</th>
                                    <th className="text-start px-4 py-2 w-[14%]">Tipo de Perfil</th>
                                    <th className="text-start px-4 py-2 w-[10%]">Ação</th>
                                    <th className="text-start px-4 py-2 w-[14%]">Recurso Afetado</th>
                                    <th className="text-start px-4 py-2 w-[14%]">Estado</th>
                                    <th className="text-start px-4 py-2 w-[12%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={8} state="loading" message="A carregar logs..." />
                                    :
                                    filteredUsersData.length > 0 ? filteredUsersData.map((item: any) =>
                                        <tr key={item?.id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            {/* <td className="text-start py-2 px-3">{item?.id}</td> */}
                                            <td className="ui-date-column text-center py-2 px-3">
                                                <div className="flex w-full items-center justify-center space-x-1">
                                                    <p>{formatDateTime(item?.created_at)}</p>
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="min-w-0 truncate" title={item?.user_name}>{item?.user_name}</span>
                                                    <CopyTextButton value={item?.user_name} label="utilizador backoffice" />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 ">
                                                {item?.cargo}
                                            </td>
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="min-w-0 truncate" title={item?.accao}>{item?.accao}</span>
                                                    <CopyTextButton value={item?.accao} label="ação" />
                                                </div>
                                            </td>
                                            <td className="text-center py-2 font-semibold">
                                                <div className="flex min-w-0 items-center justify-center gap-1.5">
                                                    <span className="min-w-0 truncate" title={item?.recurso_afetado}>{item?.recurso_afetado}</span>
                                                    <CopyTextButton value={item?.recurso_afetado} label="recurso afetado" />
                                                </div>
                                            </td>
                                            <td className={`text-start py-2`}>
                                                <span className={`w-6 h-6 rounded-full pr-4 pl-4 py-1  ${StatusLogsColor(item?.status)}`}>{item?.status}</span></td>
                                            <td className="text-start py-2 p-1">
                                                <div className="flex items-center space-x-2">
                                                    {/*detalhes */}
                                                    <CopyTextButton value={item?.id} label="ID do registo" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum log encontrado." />
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
