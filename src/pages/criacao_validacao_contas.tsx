import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import provinvia from "../components/json/provincias.json"
import AdicionaUsuario from "@/components/criacaoValidacaoCOntas/adiciona"
import FilterUsuario from "@/components/criacaoValidacaoCOntas/filter"
import DetailsUsuario from "@/components/criacaoValidacaoCOntas/details"
import Exportar, { type UserExportFilters } from "@/components/gestaoDeContas/export"
import type { Users } from "@/types/users"
import { getInitials } from "@/components/utils/getInitials"
import { statusAccount } from "@/components/utils/getColorStatusAccount"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { LevelBadge } from "@/components/gestaoDeContas/level-badge"
import { Download, Plus } from "lucide-react"
import { formatDate } from "@/components/utils/formmat"
export default function CriacaoValidacaoContas() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [usersData, setUsersData] = useState<Users[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<Users[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [particularAccount, setParticularAccount] = useState(true)

    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [exportModalIsOpen, setExportModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<Users | undefined>()
    const [queryParams, setQueryParams] = useState({
        name: "",
        phone_number: "",
        nif: "",
        email: "",
        business_name: "",
        bi: "",
        passaporte: "",
        provincia_id: "",
        municipio: ""

    })
    const [statusParam, setStatusParam] = useState("") // parametro para o status da conta ao fazer filtro
    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    const nomeProvincia = provinvia?.provincia?.find((item) => item?.id === Number(queryParams?.provincia_id))?.nome || ""
    const exportFilters = useMemo<UserExportFilters>(() => ({
        name: queryParams.name,
        phone_number: queryParams.phone_number,
        nif: queryParams.nif,
        email: queryParams.email,
        business_name: queryParams.name,
        bi_number: queryParams.bi || queryParams.passaporte,
        status_validate: statusParam,
        province: nomeProvincia,
        city: queryParams.municipio
    }), [
        nomeProvincia,
        queryParams.name,
        queryParams.phone_number,
        queryParams.nif,
        queryParams.email,
        queryParams.business_name,
        queryParams.bi,
        queryParams.passaporte,
        queryParams.municipio,
        statusParam
    ])
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")


    async function getUsers(page: number) {
        try {
            //const url = `/front/wallets?per_page=${perPage}&page=${page}`
            const UsersParams = new URLSearchParams({
                name: queryParams.name,
                phone_number: queryParams.phone_number,
                nif: queryParams.nif || queryParams.bi,
                email: queryParams.email,
                business_name: queryParams.name,
                status_validate: statusParam,
                bi_number: queryParams.bi || queryParams.passaporte,
                province: nomeProvincia,
                city: queryParams.municipio
            })?.toString()
            const urlUsers = `/front/${particularAccount ? "users" : "merchants"}?per_page=${perPage}&page=${page}&${UsersParams}`
            const { data } = await api.get(urlUsers)

            setIsFiltered(false)
            setFilteredUsersData(data?.dados)
            setUsersData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isLoading, isFetching } = useQuery<Users>({
        queryKey: ['usersList', currentPage, perPage, particularAccount, isFiltered],
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
            const fullNameOrBusiness = item.account_type === "User"
                ? `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase()
                : `${item.business_name || ''}`.toLowerCase();

            const phoneOrEmail = (item.phone_number || item.email || '').toLowerCase();
            const createdAt = item.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR').toLowerCase()
                : '';
            const biOrNif = (item.bi_number || item.nif || '').toString().toLowerCase();
            const status = (item.status_validate || '').toLowerCase();

            return (
                fullNameOrBusiness.includes(searchTerm) ||
                phoneOrEmail.includes(searchTerm) ||
                createdAt.includes(searchTerm) ||
                biOrNif.includes(searchTerm) ||
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
            name: "",
            phone_number: "",
            nif: "",
            email: "",
            business_name: "",
            bi: "",
            passaporte: "",
            provincia_id: "",
            municipio: ""

        })
        setStatusParam("")
        setTimeout(() => refetch(), 0);
    }


    /*const statusUser = (status_validate: string) => {
      switch (status_validate) {
        case "Activo":
          return "bg-[#CCF4C7] text-[#0A5800]";
        case "Desactivado":
          return "bg-[#E2CFF1] text-[#4A0058]";
        default:
          return null;
      }
    }*/



    return (
        <>
            {/* modal para adicionar */}
            <AdicionaUsuario onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} typeAccount={particularAccount} />

            {/* modal para filtrar */}
            <FilterUsuario
                setShowFilter={setShowClearFilter}
                filter={getUsers}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                setStatusParam={setStatusParam}
                statusParam={statusParam}
                typeAccount={particularAccount}
                setCurrentPage={setCurrentPage}
            />

            {/*modal para ver detalhes */}
            <DetailsUsuario itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            {/* modal para exportar */}
            <Exportar onClose={() => setExportModalIsOpen(false)} isOpen={exportModalIsOpen} typeAccount={particularAccount} initialFilters={exportFilters} />

            <div className="ui-tabs flex w-[350px] mr-l z-40" role="tablist" aria-label="Tipo de conta">
                <button
                    onClick={() => {
                        setParticularAccount(true)
                        setCurrentPage(1)
                    }}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer
                         ${particularAccount ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Particulares</button>
                <button
                    onClick={() => {
                        setParticularAccount(false)
                        setCurrentPage(1)
                    }}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer 
                        ${!particularAccount ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Empresas</button>

            </div>
            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-b-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-x-2 border-b-2 border-b-[#C8D7EF] border-x-[#C8D7EF]">

                <div className="flex flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setAddModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold  flex space-x-2 items-center">
                            <Plus className="size-4" aria-hidden="true" />

                            <span>Adicionar</span>

                        </button>
                        <button onClick={() => setExportModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold flex space-x-2 items-center">
                            <Download className="h-5 w-5" aria-hidden="true" />
                            <span>Exportar</span>
                        </button>
                        <button onClick={() => setFilterModalIsOpen(true)} type="button" aria-label="Filtrar" title="Filtrar" className="ui-filter-trigger">
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
                        <div className="flex justify-between space-x-4 items-center text-[#143163]">
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
                    <div className="mt-10 flex items-center space-x-2 text-[16px] text-[#143163]"><p className="font-bold">Total geral de registos: </p><p className="">{isLoading ? "..." : data?.total}</p></div>

                    <div className="border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="ui-account-validation-table w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">

                                    <th className={` px-3 py-2 ${particularAccount ? "w-[10%] text-start" : "w-[15%] text-start"}`}>{particularAccount ? "Telefone" : "Email"}</th>
                                    <th className="text-start px-4 py-2 w-[12%]">{particularAccount ? "Utilizador" : "Empresa"}</th>
                                    <th className="ui-date-column text-center px-4 py-2 w-[10%]">Data de Criação</th>
                                    <th className={` px- py-2 ${particularAccount ? "w-[15%] text-start" : "w-[10%] text-start"}`}>{particularAccount ? "Documento de identificação" : "NIF"}</th>
                                    <th className="ui-location-column text-start px-3 py-2 w-[10%]">Nacionalidade</th>
                                    <th className="ui-location-column text-start px-3 py-2 w-[10%]">Província</th>
                                    <th className="ui-location-column text-start px-3 py-2 w-[10%]">Município</th>
                                    <th className="text-start px-3 py-2 w-[8%]" title="Nível da conta">Nível</th>
                                    <th className="text-start px-3 py-2 w-[10%]">Estado da Conta</th>
                                    <th className="text-start px-4 py-2 w-[5%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={10} state="loading" message="A carregar contas..." /> :
                                    filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                        <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            <td className={`py-2 px-3 font-semibold ${particularAccount ? "ui-preserve-cell text-start" : "text-start"}`} title={item?.phone_number || item?.email || "N/A"}>{item?.phone_number || item?.email}</td>
                                            <td className="text-start py-2 ">
                                                <div className="flex min-w-0 items-center space-x-1">
                                                    <div className="hidden lg:flex rounded-full w-8 h-8 hover:border-2 items-center justify-center text-[#143163] font-semibold  bg-[#F5F6FA] text-[12px]">
                                                        {getInitials(item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`)}
                                                    </div>
                                                     <p className="min-w-0 flex-1 truncate font-semibold" title={item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`}>{item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`}</p>
                                                </div>
                                            </td>
                                            <td className="ui-date-column text-center px-4 py-2">{formatDate(item?.created_at)}</td>
                                            {/* <td className="text-center py-2">{item?.account_type === "User" ? "Particular" : "Empresa"}</td> */}
                                             <td className="ui-preserve-cell py-2 font-semibold text-start" title={item?.bi_number || item?.nif || "N/A"}>{item?.bi_number || item?.nif}</td>
                                            <td className="ui-location-column text-start py-2 px-3" title={item?.user_document?.nacionalidade || item?.user_document?.country || "N/A"}>{item?.user_document?.nacionalidade || item?.user_document?.country || "N/A"}</td>
                                            <td className="ui-location-column text-start py-2 px-3" title={item?.user_document?.province || "N/A"}>{item?.user_document?.province || "N/A"}</td>
                                            <td className="ui-location-column text-start py-2 px-3" title={item?.user_document?.city || "N/A"}>{item?.user_document?.city || "N/A"}</td>
                                            <td className="text-start py-2 px-3"><LevelBadge level={item?.level} /></td>
                                            <td className={`text-start py-2`}>
                                                <span className={`w-6 h-6 rounded-full pr-4 pl-4 py-1 ml-4 
                                                    ${statusAccount(item?.status_validate)}`}>{item?.status_validate === "PENDING" ? "Pendente" : item?.status_validate}
                                                </span>
                                            </td>
                                            <td className="text-start py-2">

                                                <TableActionButton
                                                    action="view"
                                                    tooltip="Ver mais"
                                                    onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }}
                                                />

                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={10} state="empty" message="Nenhuma conta encontrada." />
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
