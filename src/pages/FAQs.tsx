import { Plus } from "lucide-react"

import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import FAQsApp from "@/components/faqs/faqsApp/faqsApp"
import type { FAQs } from "@/types/faqs"
import type { CategoriaFaqs } from "@/types/categoria_faqs"
import FilterCategory from "@/components/faqs/categorias/filter"
import AddCategory from "@/components/faqs/categorias/adiciona"
import ModalEliminarOCategory from "@/components/faqs/categorias/modalEliminar"
import EditCategory from "@/components/faqs/categorias/edit"
import DetailsCategory from "@/components/faqs/categorias/details"
import FAQsWeb from "@/components/faqs/faqsWeb/fqasWeb"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"

const abas = [
    { id: 'Categorias', label: 'Categorias' },
    { id: 'FAQsAplicativo', label: 'FAQs Aplicativo' },
    { id: 'FAQsWebsite', label: 'FAQs Website' }
];

export default function FAQs() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [servicosData, setCategoryData] = useState<CategoriaFaqs[]>([])
    const [filteredDataUsers, setFilteredCategoryData] = useState<CategoriaFaqs[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState() as any
    const [abaAtiva, setAbaAtiva] = useState('Categorias');
    const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false)
    const [detailsCategoryModalIsOpen, setDetailsCategoryModalIsOpen] = useState(false)
    const [editCategoryModalIsOpen, setEditCategoryModalIsOpen] = useState(false)

    const [queryParams, setQueryParams] = useState({
        name: "",
        rota: "",
        dataInicial: "",
    })

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")

    async function getCategory(page: number) {
        try {
            const urlCategory = isFiltered ? `/front/categoria_faqs?per_page=${perPage}&page=${page}&${new URLSearchParams({
                categoria: queryParams?.name,
                rota: queryParams?.rota,
                data_inicio: queryParams?.dataInicial
            })?.toString()}` : `/front/categoria_faqs?per_page=${perPage}&page=${page}`
            //console.log(urlOtp)
            const { data } = await api.get(urlCategory)

            //setIsFiltered(false)
            setFilteredCategoryData(data?.dados)
            setCategoryData(data?.dados)
            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isFetching, isLoading } = useQuery<CategoriaFaqs>({
        queryKey: ['ListaDeCategorias', currentPage, perPage, isFiltered],
        queryFn: () => getCategory(currentPage),
        placeholderData: keepPreviousData,
    })


    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setCategoryData(data?.dados?.slice(0, Number(perPage)));
            setFilteredCategoryData(data?.dados?.slice(0, Number(perPage))); // Adiciona os dados iniciais
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
        if (!servicosData || servicosData?.length === 0) {
            setFilteredCategoryData([]);
            return;
        }

        if (!searchInput) {
            setFilteredCategoryData(servicosData);
            return;
        }

        const searchTerm = searchInput?.toLowerCase();

        const filtered = servicosData?.filter((item: any) => {
            if (!searchTerm) return true;

            const normalizedSearch = searchTerm.toLowerCase().trim();

            // Campos visíveis na tabela
            const categoria = item?.categoria?.toLowerCase();
            const rota = item?.rota?.toLowerCase();
            const faqs = String(item?.faqs || "").toLowerCase();

            return (
                categoria.includes(normalizedSearch) ||
                rota.includes(normalizedSearch) ||
                faqs.includes(normalizedSearch)
            );
        });



        setFilteredCategoryData(filtered);

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
            name: "",
            rota: "",
            dataInicial: "",
        })
        setIsFiltered(false)
        setTimeout(() => refetch(), 0)
    }

    return (
        <>

            {/* modal para filtrar */}
            <FilterCategory
                setShowFilter={setShowClearFilter}
                filter={getCategory}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}

            />
            <DetailsCategory itemSelected={itemSelected} onClose={() => setDetailsCategoryModalIsOpen(false)}
                isOpen={detailsCategoryModalIsOpen} />
            <EditCategory itemSelected={itemSelected} onClose={() => setEditCategoryModalIsOpen(false)}
                isOpen={editCategoryModalIsOpen} />
            <AddCategory
                onClose={() => setAddCategoryModalIsOpen(false)}
                isOpen={addCategoryModalIsOpen}
            />

            <div className="ui-tabs faq-tabs flex mr-l z-40" role="tablist" aria-label="Área de FAQ">
                {abas.map((aba) => (
                    <button
                        key={aba.id}
                        type="button"
                        role="tab"
                        aria-selected={abaAtiva === aba.id}
                        onClick={() => setAbaAtiva(aba.id)}
                        className={`grid place-items-center text-[#143163] font-semibold rounded-t w-[200px] cursor-pointer
            ${abaAtiva === aba.id
                                ? "border-t-4 border-[#48B9FF] h-[40px] bg-white"
                                : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"
                            }
            text-[14px] p-2 border-x-2 border-x-[#C8D7EF] whitespace-nowrap
          `}
                    >
                        {aba.label}
                    </button>
                ))}
            </div>

            <section className="ui-data-page bg-white rounded-b-lg h-fit text-sm shadow-[0px_6px_16px_-4px_rgba(207,_215,_229,_0.5)]
            border-x-2 border-b-2 border-b-[#C8D7EF] border-x-[#C8D7EF] relative">
                <div className="w-full h-auto">
                    {abaAtiva === 'Categorias' && <div className="faq-tab-panel w-full flex flex-col p-5">

                            <div className="faq-toolbar flex space-x-4">
                                <button
                                    onClick={() => setAddCategoryModalIsOpen(true)}
                                    type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold  flex space-x-2 items-center">
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
                            <div className="mt-10 flex items-center space-x-2 text-[16px] text-[#143163]"><p className="font-bold">Total geral de registos: </p><p className="">{isLoading ? "..." : data?.total}</p></div>

                            <div className="faq-table-wrapper border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                                <table className="faq-table w-full md:table-fixed border-collapse ">
                                    <thead className="bg-[#F5F6FA] h-14  ">
                                        <tr className=" place-items-center text-[#143163] ">
                                            <th className={`text-start px-5 `}>Categoria</th>
                                            <th className="text-start ">Rota</th>
                                            <th className="text-start w-[20%]">FAQs Associados</th>
                                            <th className="text-center w-[10%]">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {isLoading ?
                                            <TableStateRow colSpan={4} state="loading" message="A carregar categorias de FAQ..." /> :
                                            filteredDataUsers.length > 0 ? filteredDataUsers.map((item: any) =>
                                                <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">

                                                    <td className="text-start py-2 px-5">
                                                         <p className="font-semibold">{item?.categoria}</p>
                                                    </td>
                                                    <td className="text-start py-2">{item?.rota === "Mobile" ? "Aplicativo Mobile" : "WebSite"}</td>
                                                     <td className="text-start py-2 font-semibold">{item?.faqs}</td>

                                                    <td className="text-center py-2  ">
                                                        <div className="flex space-x-2 items-center">
                                                            {/*detalhes */}
                                                            <TableActionButton action="view" onClick={() => { setDetailsCategoryModalIsOpen(true), setItemSelected(item) }} />
                                                            {/*editar */}
                                                            <TableActionButton action="edit" onClick={() => { setEditCategoryModalIsOpen(true), setItemSelected(item) }} />
                                                            {/* eliminar */}
                                                            <Dialog >
                                                                <DialogTrigger asChild className="cursor-pointer p-1">
                                                                <TableActionButton action="delete" onClick={() => { setItemSelected(item) }} />
                                                                </DialogTrigger>

                                                                <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                                                    <ModalEliminarOCategory id={itemSelected?.id} />

                                                                </DialogContent>
                                                            </Dialog>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ) :
                                                <TableStateRow colSpan={4} state="empty" message="Nenhuma categoria de FAQ encontrada." />
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

                        </div>}
                    {abaAtiva === 'FAQsAplicativo' && <div className="faq-tab-panel w-full flex flex-col p-5">
                        <FAQsApp />
                    </div>}
                    {abaAtiva === 'FAQsWebsite' && <div className="faq-tab-panel w-full flex flex-col p-5">
                        <FAQsWeb />
                    </div>}
                </div>


            </section>

        </>
    )
}
