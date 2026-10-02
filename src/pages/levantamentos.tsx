import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import type { DataLevanvamtosType, LevantamentosType } from "@/types/levantamentos"
import { statusLevantamentoColor } from "@/components/utils/statusLevantamentoColor"
import { statusLevantamento } from "@/components/utils/getStatusLevantamentos"

// import ExpandirDepositos from "@/components/expandirLevantamento"
import ExpandirDepositosProcessados from "@/components/expandirLevantamento/expandirProcessados"
import FilterLEvantamentos from "@/components/levantamentos/filter"
import DetalhesLevantamento from "@/components/levantamentos/details"
import ExportarLevantamentos from "@/components/levantamentos/export"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ModalRecusar from "@/components/levantamentos/modalRecusar"
import ModalConfirmar from "@/components/levantamentos/modalConfirmar"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"

export default function Levantamentos() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [filteredDataUsers, setFilteredUsersData] = useState<DataLevanvamtosType[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pendente, setPendente] = useState(true)
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<LevantamentosType | undefined>()
    const [status, setStatus] = useState<"PENDING" | "REJECTED" | "ACCEPTED">("PENDING")
    const [tipoDeConta, setTipoDeConta] = useState<"User" | "Merchant">("User")
    const [separador, setSeperador] = useState<"Pendentes" | "Processadas">("Pendentes")
    const [responsavel, setResponsavel] = useState("")
    const [queryParams, setQueryParams] = useState({
        name: "",
        iban: "",
        valor_de: "",
        valor_ate: "",
        dataFinal: "",
        dataInicial: ""
    })
    const [selectedIds, setSelectedIds] = useState<string[]>([]);


    async function getLevantamento(page: number) {
        try {
            const UsersParams = new URLSearchParams({
                user_name_phone: queryParams.name,
                iban: queryParams.iban,
                account_type: tipoDeConta,
                montante_de: queryParams.valor_de,
                montante_ate: queryParams.valor_ate,
                data_inicio: queryParams.dataInicial,
                data_fim: queryParams.dataFinal,
                status: status,
                responsavel: responsavel


            })?.toString()

            const urlLevantamentos = `/front/withdrawal?per_page=${perPage}&page=${page}&${UsersParams}`
            const { data } = await api.get(urlLevantamentos)

            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const [filterVersion, setFilterVersion] = useState(0)

    const { data, refetch, isLoading, isFetching } = useQuery<LevantamentosType>({
        queryKey: ['ListaDelevantamentos', currentPage, perPage, pendente, filterVersion],
        queryFn: () => getLevantamento(currentPage),
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
        if (!data || data.dados?.length === 0) {
            setFilteredUsersData([]);
            return;
        }

        if (!searchInput) {
            setFilteredUsersData(data?.dados || []);
            return;
        }

        const searchTerm = searchInput?.toLowerCase();

        const filtered = data?.dados?.filter((item: DataLevanvamtosType) => {
            // Normaliza o termo de busca
            const term = (searchTerm || '').toLowerCase().trim();

            // 1. Nome: Pessoa (first_name + last_name) ou Empresa (business_name)
            const fullNameOrBusiness = item.account_type === 'User'
                ? `${item.account?.first_name || ''} ${item.account?.last_name || ''}`.trim().toLowerCase()
                : `${item.account?.business_name || ''}`.trim().toLowerCase();

            // 2. Tipo de conta: "Particular" ou "Empresa"
            const accountType = item.account_type === 'User' ? 'particular' : 'empresa';

            // 3. Valor: formata como moeda kz (Kwanza)
            const amount = item.amount
                ? parseFloat(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '';
            const amountStr = amount.toString().toLowerCase();

            // 4. IBAN
            const iban = (item.iban || '').toLowerCase();

            // 5. Data e hora no formato pt-BR: DD/MM/YYYY HH:mm:ss
            const createdAt = item.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).toLowerCase()
                : '';

            // 6. Status (usando a função statusLevantamento e convertendo para string minúscula)
            const status = (statusLevantamento(item.status) || '').toLowerCase();

            // Verifica se algum campo corresponde ao termo de busca
            return (
                fullNameOrBusiness.includes(term) ||
                accountType.includes(term) ||
                amountStr.includes(term) ||
                iban.includes(term) ||
                createdAt.includes(term) ||
                status.includes(term)
            );
        });

        setFilteredUsersData(filtered);

    }, [data, searchInput]); // Atualiza ao mudar salesData ou searchTerm

    const itensDaPagina = filteredDataUsers ?? [];
    const todosSelecionados =
        itensDaPagina.length > 0 && selectedIds.length === itensDaPagina.length;
    const algunsSelecionados =
        selectedIds.length > 0 && selectedIds.length < itensDaPagina.length;

    function toggleSelecionarTodos() {
        if (todosSelecionados) {
            setSelectedIds([]);
        } else {
            setSelectedIds(itensDaPagina.map((item: any) => item.id));
        }
    }

    function toggleSelecionarItem(id: string) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    }

    console.log("selectedIds", selectedIds);




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

    // const limparFiltro = () => {
    //     setShowClearFilter(false)
    //     setQueryParams({
    //         ...queryParams,
    //         name: "",
    //         iban: "",
    //         valor_de: "",
    //         valor_ate: "",
    //         dataFinal: "",
    //         dataInicial: ""
    //     })
    //     //setStatus("PENDING")
    //     setTipoDeConta("User")
    //     setResponsavel("")
    //     //setTimeout(() => refetch(), 0);
    // }

    const limparFiltro = (statusOverride?: "PENDING" | "REJECTED" | "ACCEPTED") => {
        setShowClearFilter(false)
        setQueryParams({
            ...queryParams,
            name: "",
            iban: "",
            valor_de: "",
            valor_ate: "",
            dataFinal: "",
            dataInicial: ""
        })
        if (statusOverride) setStatus(statusOverride)
        setTipoDeConta("User")
        setResponsavel("")
        setFilterVersion(v => v + 1) // único ponto que causa refetch
    }

    function AbaPendente() {
        if (!pendente) setSelectedIds([])
        setPendente(true)
        setStatus("PENDING")
        setCurrentPage(1)
        setTipoDeConta("User")
        setSeperador("Pendentes")
        limparFiltro("PENDING")
    }

    function AbaProcessado() {
        if (pendente) setSelectedIds([])
        setPendente(false)
        setCurrentPage(1)
        setStatus("ACCEPTED")
        setTipoDeConta("User")
        setSeperador("Processadas")
        limparFiltro("ACCEPTED")
    }

    const applyFilters = () => {
        console.log("Aplicando filtros com os seguintes parâmetros:", queryParams, status, tipoDeConta, responsavel);
        setCurrentPage(1)
        setFilterVersion(v => v + 1)
        setShowClearFilter(true)
        setFilterModalIsOpen(false)
    }


    return (
        <>
            {/* modal para adicionar */}
            <ExportarLevantamentos onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />

            {/* modal para filtrar */}
            <FilterLEvantamentos
                onApply={applyFilters}
                setShowFilter={setShowClearFilter}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                status={status}
                setStatus={setStatus}
                tipoDeConta={tipoDeConta}
                setTipoDeConta={setTipoDeConta}
                separador={separador}
                setResponsavel={setResponsavel}
                responsavel={responsavel}
            />

            {/*modal para ver detalhes */}
            <DetalhesLevantamento itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            <div className="ui-tabs flex w-[350px] mr-l z-40" role="tablist" aria-label="Estado dos levantamentos">
                <button
                    onClick={AbaPendente}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer
                         ${pendente ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Pendentes</button>
                <button
                    onClick={AbaProcessado}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer
                        ${!pendente ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Processadas</button>
            </div>
            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-b-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-x-2 border-b-2 border-b-[#C8D7EF] border-x-[#C8D7EF]">

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
                            <button onClick={() => limparFiltro(pendente ? "PENDING" : "ACCEPTED")} type="button" className="ui-clear-filter-button">
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
                        <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total || "Nenhum valor encontrado"}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total geral de pagamentos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_amount ? Number(data?.total_amount)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex items-center justify-between bg-[#EFF4FF] border border-[#D9E1E7] rounded-lg px-4 py-3 mb-3">
                            <p className="text-[#143163] text-sm font-medium">
                                {selectedIds.length} {selectedIds.length === 1 ? "item selecionado" : "itens selecionados"}
                            </p>
                            <div className="flex items-center gap-2">
                                <Dialog >
                                    <DialogTrigger asChild className="cursor-pointer p-1">
                                        <button

                                            className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-red-300 text-red-600 hover:bg-red-50 duration-300 cursor-pointer"
                                        >
                                            Recusar
                                        </button>
                                    </DialogTrigger>
                                    {<DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                        <ModalRecusar id={selectedIds} setSelectedIds={setSelectedIds} />

                                    </DialogContent>}
                                </Dialog>

                                <Dialog >
                                    <DialogTrigger asChild className="cursor-pointer p-1">
                                        <button

                                            className="px-4 py-2 rounded-md text-sm font-medium bg-[#2678F2] text-white hover:bg-[#1e63cf] duration-300 cursor-pointer"
                                        >
                                            Processar
                                        </button>
                                    </DialogTrigger>
                                    {<DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                        <ModalConfirmar id={selectedIds} setSelectedIds={setSelectedIds} />

                                    </DialogContent>}
                                </Dialog>
                            </div>
                        </div>
                    )}

                    <div className=" border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">
                                    {separador=== "Pendentes" && <th className="ui-selection-column text-start w-[5%] px-3">
                                        <label className="inline-flex size-6 cursor-pointer items-center justify-center">
                                            <Checkbox
                                                checked={todosSelecionados}
                                                indeterminate={algunsSelecionados}
                                                onCheckedChange={toggleSelecionarTodos}
                                                ariaLabel="Selecionar todos os levantamentos"
                                            />
                                        </label>
                                    </th>}
                                    {!pendente && <th className="ui-expand-toggle-column text-start" ></th>}
                                    <th className={`ui-expand-leading-column text-start py-2 `}>Utilizador</th>
                                    <th className="text-start py-2 ">Tipo de Conta</th>
                                    <th className="text-start py-2 ">Valor</th>
                                    <th className="text-start py-2 ">IBAN</th>
                                    <th className="ui-date-column text-center py-2">Data do Pedido</th>
                                    <th className="text-start py-2 ">Estado do Pedido</th>
                                    <th className="text-start py-2 w-[5%] pl-2">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={8} state="loading" message="A carregar levantamentos..." /> : filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                        <><tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            {separador === "Pendentes" && <td className="ui-selection-column py-2 text-center">
                                                <label className="inline-flex size-6 cursor-pointer items-center justify-center">
                                                    <Checkbox
                                                        checked={selectedIds.includes(item?.id)}
                                                        onCheckedChange={() => toggleSelecionarItem(item?.id)}
                                                        ariaLabel="Selecionar levantamento"
                                                    />
                                                </label>
                                            </td>}
                                            {!pendente && <td className="ui-expand-toggle-column py-2 text-center">
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
                                            </td>}
                                            <td className="ui-expand-leading-column text-start py-2 bg">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="min-w-0 truncate font-semibold">
                                                        {item?.account_type === "User" ? `${item?.account?.first_name} ${item?.account?.last_name}` : `${item?.account?.business_name}`}
                                                    </span>
                                                    <CopyTextButton
                                                        value={item?.account_type === "User"
                                                            ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}`
                                                            : item?.account?.business_name || "N/A"}
                                                        label="utilizador"
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-start py-2 ">{item?.account_type === "User" ? `Particular` : `Empresa`}</td>
                                             <td className="text-start py-2 font-semibold">{formatCurrency(item?.amount)}</td>
                                            <td  className="text-start py-2 pr-4">
                                                <div className="flex items-center w-full">
                                                     <p title={item?.iban} className="truncate font-semibold">{item?.iban}</p>
                                                    <CopyTextButton value={item?.iban} label="IBAN" />
                                                </div>
                                            </td>
                                            <td className="ui-date-column text-center py-2">{formatDateTime(item?.created_at)}</td>
                                            <td className={`text-start py-2`}>
                                                <span className={`w-6 h-6 rounded-full pr-4 pl-4 py-1 
                                                     ${statusLevantamentoColor(item?.status)}`}>{statusLevantamento(item?.status)}
                                                </span>
                                            </td>
                                            <td className="text-start py-2">
                                            <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                            </td>
                                        </tr >
                                           
                                            {expandedRow === item?.id && <tr className="ui-expandable-row border-t-1 border-[#EBECEF] ">
                                                <td className="ui-expandable-cell" colSpan={8}>
                                                    {<ExpandirDepositosProcessados data={item?.created_at} responsavel={item?.responsavel?.name} />}
                                                </td>
                                            </tr>}
                                        </>

                                    ) :
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum levantamento encontrado." />
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

            </section >

        </>
    )
}
