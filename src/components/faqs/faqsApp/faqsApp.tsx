import { Plus } from "lucide-react"

import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { FAQsApp } from "@/types/faqs"
import { ChangeStatus } from "./statusSelect"
import ModalEliminarFaqsApp from "./modalEliminar"
import DetailsFaqsApp from "./details"
import EditFaqsApp from "./edit"
import AddFaqsApp from "./adiciona"
import FilterFaqsApp from "./filter"
import { formatDate } from "@/components/utils/formmat"


export default function FAQsApp() {
    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [servicosData, setServicosData] = useState<FAQsApp[]>([])
    const [filteredDataUsers, setFilteredUsersData] = useState<FAQsApp[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState() as any
    const [addFaqModalIsOpen, setAddFaqModalIsOpen] = useState(false)
    const [detailsFaqsAppModalIsOpen, setDetailsFaqsAppModalIsOpen] = useState(false)
    const [queryParams, setQueryParams] = useState({
        pergunta: "",
        categoria: "",
        estado: "",
        dataInicial: "",
    })

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")

    async function getFaqsApp(page: number) {
        try {
            const device = "Mobile"
            const urlFaqsApp = isFiltered ? `/front/faqs?device=${device}&per_page=${perPage}&page=${page}&${new URLSearchParams({
                categoria: queryParams?.categoria,
                question: queryParams?.pergunta,
                data_inicio: queryParams?.dataInicial,
                status: queryParams?.estado
            })?.toString()}` : `/front/faqs?device=${device}&per_page=${perPage}&page=${page}`
            //console.log(urlOtp)
            const { data } = await api.get(urlFaqsApp)

            //setIsFiltered(false)
            setFilteredUsersData(data?.dados)
            setServicosData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isFetching, isLoading } = useQuery<FAQsApp>({
        queryKey: ['ListaDeFaqsApp', currentPage, perPage, isFiltered],
        queryFn: () => getFaqsApp(currentPage),
        placeholderData: keepPreviousData,
    })

    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setServicosData(data?.dados?.slice(0, Number(perPage)));
            setFilteredUsersData(data?.dados?.slice(0, Number(perPage))); // Adiciona os dados iniciais
        }
    }, [data, perPage]);

    // Função de pesquisa que apenas atualiza o termo de pesquisa
    const handleSearch = (params: string | undefined) => {
        setSearchInput(params?.trim() || "");
    };

    useEffect(() => {
        if (!servicosData || servicosData?.length === 0) {
            setFilteredUsersData([]);
            return;
        }

        if (!searchInput) {
            setFilteredUsersData(servicosData);
            return;
        }

        const searchTerm = searchInput?.toLowerCase();

        const filtered = servicosData?.filter((item: any) => {
            if (!searchTerm) return true;

            const normalizedSearch = searchTerm.toLowerCase().trim();

            // Campos visíveis na tabela
            const pergunta = String(item?.question || "").toLowerCase();
            const categoria = String(item?.categoria || "").toLowerCase();
            const estado = String(item?.status || "").toLowerCase();
            const createdAt = item?.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR').toLowerCase()
                : '';

            return (
                createdAt.includes(normalizedSearch) ||
                pergunta.includes(normalizedSearch) ||
                categoria.includes(normalizedSearch) ||
                estado.includes(normalizedSearch)
            );
        });



        setFilteredUsersData(filtered);

    }, [servicosData, searchInput]); // Atualiza ao mudar salesData ou searchTerm

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
            pergunta: "",
            categoria: "",
            estado: "",
            dataInicial: "",

        })
        setIsFiltered(false)
        setTimeout(() => refetch(), 0)
    }

    return <>
        <DetailsFaqsApp itemSelected={itemSelected} onClose={() => setDetailsFaqsAppModalIsOpen(false)}
            isOpen={detailsFaqsAppModalIsOpen} />

        {addFaqModalIsOpen && (
            <AddFaqsApp isOpen={addFaqModalIsOpen} onClose={() => setAddFaqModalIsOpen(false)} />
        )}

        <FilterFaqsApp
            setShowFilter={setShowClearFilter}
            filter={getFaqsApp}
            setIsFiltered={setIsFiltered}
            onClose={() => setFilterModalIsOpen(false)}
            isOpen={filterModalIsOpen}
            queryParams={queryParams}
            setQueryParams={setQueryParams} />


        <div className="faq-tab-content w-full flex flex-col">
            <div className="faq-toolbar flex space-x-4">
                <button
                    onClick={() => setAddFaqModalIsOpen(true)}
                    type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                 hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold flex items-center gap-2">
                    <Plus className="size-4" aria-hidden="true" />
                    <span>Adicionar</span>
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

            {/* filtros */}
            <div>

            </div>
            <div className="flex justify-between space-x-4 items-center text-[#143163] mt-5">
                <div className="flex space-x-2 ">

                    {!isLoading && (isFetching && <>
                        <div className=" grid place-items-center">
                            <span className="w-4 h-4 rounded-full border-1 border-t-transparent border-[#143163] animate-spin ">
                            </span>
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

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#143163]" aria-live="polite">
                <p className="flex items-center gap-2 font-semibold">
                    Total geral de registos:
                    <span className="min-w-8 rounded-full bg-[#EFF4FA] px-2.5 py-0.5 text-center">{isLoading ? "..." : totalItems}</span>
                </p>
                <span className="ui-inline-summary-divider" aria-hidden="true" />
                <p className="flex items-center gap-2 font-semibold">
                    Total de FAQs:
                    <span className="min-w-8 rounded-full bg-[#EFF4FA] px-2.5 py-0.5 text-center">{isLoading ? "..." : totalItems}</span>
                </p>
            </div>

            {/* Tabela */}
            <div className="faq-table-wrapper border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                <table className="faq-table w-full md:table-fixed border-collapse ">
                    <thead className="bg-[#F5F6FA] h-14  ">
                        <tr className=" place-items-center text-[#143163] ">

                            {/* <th className={`text-start px-8 py-2 w-[20%]`}>ID do Pagamento</th> */}

                            <th className={`text-start px-5 `}>Pergunta</th>
                            <th className="text-start ">Categoria</th>
                            <th className="text-start ">Estado</th>
                            <th className="ui-date-column text-center w-[20%]">Data de Criação</th>
                            <th className="text-center w-[10%]">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="h-20">

                        {isLoading ?
                            <TableStateRow colSpan={5} state="loading" message="A carregar FAQs da aplicação..." /> :
                            filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">


                                    <td className="text-start py-2 px-5">
                                         <p className="font-semibold">{item?.question}</p>
                                    </td>
                                     <td className="text-start py-2 font-semibold">{item?.categoria}</td>
                                    <td className="text-start py-2">
                                        <ChangeStatus item={item} />
                                    </td>
                                    <td className="ui-date-column text-center py-2 ">
                                        {formatDate(item?.created_at)}
                                    </td>

                                    <td className="text-center py-2  ">
                                        <div className="flex space-x-2 items-center">
                                            {/*detalhes */}
                                            <TableActionButton action="view" onClick={() => { setDetailsFaqsAppModalIsOpen(true), setItemSelected(item) }} />
                                            {/*editar */}

                                            <Dialog >
                                                <DialogTrigger asChild className="cursor-pointer p-1">
                                                <TableActionButton action="edit" onClick={() => { setItemSelected(item) }} />
                                                </DialogTrigger>
                                                <DialogContent className="ui-edit-modal w-[100%] max-w-[90vw] p-4" >
                                                    <EditFaqsApp itemSelected={itemSelected} />

                                                </DialogContent>
                                            </Dialog>
                                            {/* eliminar */}
                                            <Dialog >
                                                <DialogTrigger asChild className="cursor-pointer p-1">
                                                <TableActionButton action="delete" onClick={() => { setItemSelected(item) }} />
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                                    <ModalEliminarFaqsApp id={itemSelected?.id} />

                                                </DialogContent>
                                            </Dialog>

                                        </div>
                                    </td>
                                </tr>
                            ) :
                                <TableStateRow colSpan={5} state="empty" message="Nenhuma FAQ da aplicação encontrada." />
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
    </>
}
