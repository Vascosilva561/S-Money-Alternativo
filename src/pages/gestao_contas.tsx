import { api } from "@/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import provinvia from "../components/json/provincias.json"
import type { Users } from "@/types/users"
import { getInitials } from "@/components/utils/getInitials"
import { statusUserColor } from "@/components/utils/getSituacaoColor"
import { statusAccount } from "@/components/utils/getColorStatusAccount"
import { getLevelBadgeName, LevelBadge } from "@/components/gestaoDeContas/level-badge"
import EditUsuario from "@/components/gestaoDeContas/edit"
import FilterCounts from "@/components/gestaoDeContas/filter"
import Exportar, { type UserExportFilters } from "@/components/gestaoDeContas/export"
import AdicionaUsuario from "@/components/criacaoValidacaoCOntas/adiciona"
import { TableActionButton } from "@/components/ui/table-action-button"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { Spinner } from "@/components/utils/spinner"
import { Download, Plus, Search, X } from "lucide-react"
import { useNavigate } from "react-router"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"

export default function GestaoDeContas() {

    const navigate = useNavigate()
    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [usersData, setUsersData] = useState<Users[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<Users[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [particularAccount, setParticularAccount] = useState(true)

    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [exportModalIsOpen, setExportModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
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
        municipio: "",
        provincia_id: "",
        dataAdesaoInicial: "",
        dataAdesaoFinal: "",

    })
    const [statusParam, setStatusParam] = useState("") // parametro para o status da conta ao fazer filtro
    const [situacaoParam, setSituacaoParam] = useState("") // parametro para a situacao do user ao fazer filtro
    const [nivelParam, setNivelParam] = useState("") // filtro para o nivel da conta
    const [nacionalidadeParam, setNacionalidadeParam] = useState("")
    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(queryParams?.provincia_id);
    }); // retorna o objecto da provincia selecionada
    const nomeProvinciaAtual = nomeProvincia[0]?.nome || ""
    const exportFilters = useMemo<UserExportFilters>(() => ({
        name: queryParams.name,
        phone_number: queryParams.phone_number,
        nif: queryParams.nif,
        email: queryParams.email,
        business_name: queryParams.name,
        bi_number: queryParams.bi || queryParams.passaporte,
        status: situacaoParam,
        level: nivelParam,
        province: nomeProvinciaAtual,
        city: queryParams.municipio,
        nacionalidade: nacionalidadeParam,
        data_inicio: queryParams.dataAdesaoInicial,
        data_final: queryParams.dataAdesaoFinal,
        status_validate: statusParam
    }), [
        nomeProvinciaAtual,
        queryParams.name,
        queryParams.phone_number,
        queryParams.nif,
        queryParams.email,
        queryParams.business_name,
        queryParams.bi,
        queryParams.passaporte,
        queryParams.municipio,
        queryParams.dataAdesaoInicial,
        queryParams.dataAdesaoFinal,
        situacaoParam,
        nivelParam,
        nacionalidadeParam,
        statusParam
    ])

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
                data_inicio: queryParams.dataAdesaoInicial,
                data_fim: queryParams.dataAdesaoFinal,
                level: nivelParam,
                status: situacaoParam,
                city: queryParams?.municipio,
                province: nomeProvincia[0]?.nome || "",
                nacionalidade: nacionalidadeParam

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
        queryKey: ['listaDeContas', currentPage, perPage, particularAccount, isFiltered],
        queryFn: () => getUsers(currentPage),
        placeholderData: keepPreviousData,
    })

    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setUsersData(data?.dados?.slice(0, Number(perPage)));

            setFilteredUsersData(data?.dados?.slice(0, Number(perPage))); // Adiciona os dados iniciais
        }
    }, [data, perPage]);

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

            const biOrNif = (item.bi_number || item.nif || '').toString().toLowerCase();
            const status = (item.status || '').toLowerCase();
            const province = (item?.user_document?.province || '').toLowerCase();
            const level = [item?.level, getLevelBadgeName(item?.level)].filter(Boolean).join(' ').toLowerCase();

            return (
                fullNameOrBusiness.includes(searchTerm) ||
                phoneOrEmail.includes(searchTerm) ||
                biOrNif.includes(searchTerm) ||
                status.includes(searchTerm) ||
                province.includes(searchTerm) ||
                level.includes(searchTerm)
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
            municipio: "",
            provincia_id: "",
            dataAdesaoInicial: "",
            dataAdesaoFinal: "",

        })
        setNacionalidadeParam("")
        setNivelParam("")
        setSituacaoParam("")
        setStatusParam("")
        setTimeout(() => refetch(), 0);
    }

    return (
        <>
            {/* criação, validação e gestão pertencem ao mesmo contexto */}
            <AdicionaUsuario onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} typeAccount={particularAccount} />

            {/* modal para exportar */}
            <Exportar onClose={() => setExportModalIsOpen(false)} isOpen={exportModalIsOpen} typeAccount={particularAccount} initialFilters={exportFilters} />

            <EditUsuario onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} typeAccount={particularAccount} selectedItem={itemSelected} />

            {/* modal para filtrar */}
            <FilterCounts
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
                nacionalidadeParam={nacionalidadeParam}
                setNacionalidade={setNacionalidadeParam}
                nivelParam={nivelParam}
                setNivelParam={setNivelParam}
                situacaoParam={situacaoParam}
                setSituacaoParam={setSituacaoParam}

            />

            <div className="ui-tabs flex w-full max-w-[360px] items-end gap-1" role="tablist" aria-label="Tipo de conta">
                <button
                    type="button"
                    role="tab"
                    aria-selected={particularAccount}
                    onClick={() => {
                        setParticularAccount(true)
                        setCurrentPage(1)
                    }}
                    className={`grid h-11 flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${
                        particularAccount ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"
                    }`}>Particulares</button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={!particularAccount}
                    onClick={() => {
                        setParticularAccount(false)
                        setCurrentPage(1)
                    }}
                    className={`grid h-11 flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${
                        !particularAccount ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"
                    }`}>Empresas</button>

            </div>
            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page overflow-hidden rounded-b-xl rounded-tr-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">

                <div className="p-4 sm:p-5 lg:p-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">

                        <button onClick={() => setAddModalIsOpen(true)} type="button" className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#143163] px-4 font-semibold text-white shadow-sm transition-colors hover:bg-[#1D467F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2">
                            <Plus className="size-4" aria-hidden="true" />
                            <span>Adicionar</span>
                        </button>

                        {/* <button onClick={() => setAddModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold  flex space-x-2 items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM13.53 14.47C13.823 14.763 13.823 15.238 13.53 15.531L11.53 17.531C11.461 17.6 11.3779 17.655 11.2859 17.693C11.1939 17.731 11.097 17.751 10.999 17.751C10.901 17.751 10.8039 17.731 10.7119 17.693C10.6199 17.655 10.537 17.6 10.468 17.531L8.46802 15.531C8.17502 15.238 8.17502 14.763 8.46802 14.47C8.76102 14.177 9.23605 14.177 9.52905 14.47L10.249 15.19V12C10.249 11.586 10.585 11.25 10.999 11.25C11.413 11.25 11.749 11.586 11.749 12V15.189L12.469 14.469C12.763 14.177 13.237 14.177 13.53 14.47Z" fill="#143163" />
                            </svg>

                            <span>Exportar</span>

                        </button> */}
                        <button onClick={() => setExportModalIsOpen(true)} type="button" className="order-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#ADCBD0] bg-[#EAF6F8] px-4 font-semibold text-[#143163] transition-colors hover:border-[#17CFDA] hover:bg-[#D8F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2">
                            <Download className="size-4" aria-hidden="true" />
                           <span>Exportar</span>
                       </button>
                        <button onClick={() => setFilterModalIsOpen(true)} type="button" aria-label="Filtrar" title="Filtrar" className="ui-filter-trigger order-2">
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16l-6.5 7v5l-3 2v-7L4 5z" /></svg>
                                </button>
                        <RefreshButton className="order-3" onRefresh={() => { void refetch() }} isLoading={isFetching} />
                        {showClearFilter &&
                            <button onClick={() => limparFiltro()} type="button" className="ui-clear-filter-button order-5">
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                               </svg>
                                <span>Limpar filtros</span>
                           </button>
                       }
                    </div>

                    <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                        <div className="flex min-h-6 items-center gap-2 text-sm">

                            {!isLoading && (isFetching && <>
                                <Spinner color="#143163" width="5" height="5" />
                                <p className="text-[#667895]">A carregar...</p>
                            </>)}
                        </div>
                        <div className="relative w-full lg:w-[300px] lg:shrink-0">
                            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" />
                            <input type="text" aria-label="Pesquisar utilizadores" placeholder="Pesquisar utilizadores..." onKeyDown={handleKeyDown} value={searchInput} onChange={(e) => handleSearch(e.target.value)} className="h-10 w-full rounded-lg border border-[#C9D8E9] bg-white pl-10 pr-10 text-sm text-[#143163] outline-none transition placeholder:text-[#9AAAC0] focus:border-[#48B9FF] focus:ring-4 focus:ring-[#48B9FF]/15" />
                            {searchInput && (
                                <button type="button" aria-label="Limpar pesquisa" onClick={() => setSearchInput("")} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#8293AE] transition-colors hover:bg-[#F1F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            )}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col gap-3 px-4 pb-6 sm:px-5 lg:px-6">

                    {/* Tabela */}
                    <div className="ui-record-count flex items-center gap-2 pt-1 text-sm text-[#143163]">
                        <span className="font-semibold">Total geral de registos:</span>
                        <span className="rounded-full bg-[#F1F5FA] px-2.5 py-1 font-semibold">{isLoading ? "..." : data?.total ?? 0}</span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E5EBF4]">
                        <div className="overflow-x-auto">
                        <table className={`ui-user-management-table w-full table-fixed border-collapse text-sm ${particularAccount ? "ui-particular-account" : "ui-business-account"}`}>
                            <caption className="sr-only">Lista de utilizadores</caption>
                            <thead className="h-12 bg-[#F5F7FB] text-xs font-semibold text-[#143163]">
                                <tr className="text-[#143163]">

                                    <th className={`px-4 text-left ${particularAccount ? "w-[10%]" : "w-[10%]"}`}>{particularAccount ? "Telefone" : "Email/Telefone"}</th>
                                    <th className={`ui-account-name-column ${particularAccount ? "w-[13%]" : "w-[14%]"} px-4 text-left`}>{particularAccount ? "Utilizador" : "Empresa"}</th>
                                    <th className={`px-4 text-left ${particularAccount ? "w-[14%]" : "w-[12%]"}`}>{particularAccount ? "Bilhete de Identidade" : "NIF"}</th>
                                    <th className="ui-location-column w-[10%] px-4 text-left">Nacionalidade</th>
                                    <th className="ui-location-column w-[8%] px-4 text-left">Província</th>
                                    <th className="ui-location-column w-[8%] px-4 text-left">Município</th>
                                    <th className="w-[7%] px-4 text-left" title="Nível da conta">Nível</th>
                                    <th className={`${particularAccount ? "w-[10%]" : "w-[10%]"} px-4 text-left`} title="Estado de validação da conta">Estado da Conta</th>
                                    <th className="w-[8%] px-4 text-left" title="Situação do utilizador">Situação</th>
                                    <th className={`${particularAccount ? "w-[12%]" : "w-[13%]"} px-4 pr-5 text-left`}>
                                        <div className="flex justify-end">
                                            <span className="text-left">Ações</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-[#143163]">

                                {isLoading ? (
                                    <TableStateRow colSpan={10} state="loading" message="A carregar utilizadores..." />
                                ) : filteredDataUsers?.length > 0 ? filteredDataUsers.map((item: any) =>
                                        <tr key={item?.id} className="h-14 border-b border-[#EEF2F7] odd:bg-white even:bg-[#FBFCFE] transition-colors hover:bg-[#F5F9FF]">
                                            <td className={`whitespace-nowrap px-4 py-3 text-left ${particularAccount ? "ui-preserve-cell" : ""}`}>
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className={particularAccount ? "ui-full-value min-w-0 flex-1" : "min-w-0 truncate"} title={item?.phone_number || item?.email || "N/A"}>{item?.phone_number || item?.email || "N/A"}</span>
                                                    <CopyTextButton
                                                        value={item?.phone_number || item?.email}
                                                        label={item?.phone_number ? "telefone" : "email"}
                                                    />
                                                </div>
                                            </td>
                                            <td className="ui-account-name-column px-4 py-3 text-left">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F1F5FA] text-xs font-semibold text-[#143163]">
                                                        {getInitials(item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`)}
                                                    </div>
                                                    <p className="min-w-0 flex-1 truncate font-semibold" title={item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`}>{item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : `${item?.business_name}`}</p>
                                                    <CopyTextButton
                                                        value={item?.account_type === "User" ? `${item?.first_name} ${item?.last_name}` : item?.business_name}
                                                        label={particularAccount ? "utilizador" : "empresa"}
                                                    />
                                                </div>
                                            </td>
                                            <td className="ui-preserve-cell px-4 py-3 text-left">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="ui-full-value min-w-0 flex-1" title={item?.bi_number || item?.nif || "N/A"}>{item?.bi_number || item?.nif || "N/A"}</span>
                                                    <CopyTextButton
                                                        value={item?.bi_number || item?.nif}
                                                        label={particularAccount ? "bilhete de identidade" : "NIF"}
                                                    />
                                                </div>
                                            </td>
                                            <td className="ui-location-column px-4 py-3 text-left" title={item?.user_document?.nacionalidade || item?.user_document?.country || "N/A"}>{item?.user_document?.nacionalidade || item?.user_document?.country || "N/A"}</td>
                                            <td className="ui-location-column px-4 py-3 text-left" title={item?.user_document?.province || "N/A"}>{item?.user_document?.province || "N/A"}</td>
                                            <td className="ui-location-column px-4 py-3 text-left" title={item?.user_document?.city || "N/A"}>{item?.user_document?.city || "N/A"}</td>
                                            <td className="px-4 py-3 text-left">
                                                <LevelBadge level={item?.level} />
                                            </td>
                                            <td className="px-4 py-3 text-left">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusAccount(item?.status_validate)}`}>
                                                   {item?.status_validate === "PENDING" ? "Pendente" : item?.status_validate || "N/A"}
                                               </span>
                                           </td>
                                            <td className="px-4 py-3 text-left">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusUserColor(item?.status)}`}>
                                                   {item?.status === "Active" ? "Activo":
                                                    ((item?.status === "Inactivo" || item?.status === "Inative") ? "Inactivo": "Desactivado")}</span></td>
                                            <td className="px-4 py-3 pr-5 text-left">
                                                <div className="flex items-center justify-end gap-2">
                                                     {/*detalhes */}
                                                    <TableActionButton
                                                        onClick={() => {
                                                            setItemSelected(item)
                                                            navigate(`/gestao-de-utilizadores/${item?.id}/visao-geral`, {
                                                                state: {
                                                                    user: item,
                                                                    returnTo: "/gestao-de-utilizadores"
                                                                }
                                                            })
                                                        }}
                                                        aria-label="Abrir contexto do utilizador"
                                                        tooltip="Ver detalhes"
                                                        action="view"
                                                    />

                                                    {/*editar */}
                                                    <TableActionButton
                                                        onClick={() => { setEditModalIsOpen(true); setItemSelected(item) }}
                                                        aria-label="Editar utilizador"
                                                        tooltip="Editar utilizador"
                                                        action="edit"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={10} state="empty" message="Nenhuma conta encontrada." />
                                }

                            </tbody>
                        </table>
                        </div>
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
