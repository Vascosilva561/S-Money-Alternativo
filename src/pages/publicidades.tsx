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
import type { Pagamentos } from "@/types/pagamentos"
import type { Otp } from "@/types/otps"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import AdicionaPublicidades from "@/components/ad-management/adicionar"
import ModalEliminarPublicidade from "@/components/ad-management/eliminar"
import EditPublicity from "@/components/ad-management/edit"
import DetalhesPublicidade from "@/components/ad-management/detalhes"
import FilterPublicity from "@/components/ad-management/filter"
import ModalUpdateStatus from "@/components/ad-management/updateStatus"
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { formatDateTime } from "@/components/utils/formmat"

export default function Publicidades() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [servicosData, setPublicidadesData] = useState<Otp[]>([])
    const [filteredDataPublicities, setFilteredDataPublicities] = useState<Otp[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState() as any
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [adicionaModalIsOpen, setAdicionaModalIsOpen] = useState(false)
    const [modalEliminar, setModalEliminar] = useState(false)
    const [modalUpdateStatus, setModalUpdateStatus] = useState(false)


    const [queryParams, setQueryParams] = useState({
        title: "",
        start_date: "",
        end_date: "",
        status: ""
    })

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    //const [responsavelOperacao, setResponsavelOperacao] = useState("")

    const formatToBackend = (date?: string) => {
        if (!date) return "";

        const [d, t] = date.split("T");
        return `${d} ${t}:00`;
    };

    async function getPublicity(page: number) {
        try {
            const params = new URLSearchParams({
                title: queryParams?.title,
                status: queryParams?.status,
                start_date: formatToBackend(queryParams?.start_date),
                end_date: formatToBackend(queryParams?.end_date),
            })?.toString()
            const urlOtp = isFiltered ? `/front/publicity?per_page=${perPage}&page=${page}&${params}` : `/front/publicity?per_page=${perPage}&page=${page}`
            const { data } = await api.get(urlOtp)

            //setIsFiltered(false)
            setFilteredDataPublicities(data?.dados)
            setPublicidadesData(data?.dados)

            return data
        } catch (error) {
            console.log("erro ao busscar publicidades ", error)
        }
    }

    const { data, refetch, isFetching, isLoading } = useQuery<Pagamentos>({
        queryKey: ['publicidadesLista', currentPage, perPage, isFiltered],
        queryFn: () => getPublicity(currentPage),
        placeholderData: keepPreviousData,
    })

    useEffect(() => {
        if (Array.isArray(data?.dados) && data?.dados?.length) {
            setPublicidadesData(data?.dados?.slice(0, Number(perPage)));
            setFilteredDataPublicities(data?.dados?.slice(0, Number(perPage))); // Adiciona os dados iniciais
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
            setFilteredDataPublicities([]);
            return;
        }

        if (!searchInput) {
            setFilteredDataPublicities(servicosData);
            return;
        }

        const searchTerm = searchInput?.toLowerCase();

        const filtered = servicosData?.filter((item: any) => {
            if (!searchTerm) return true;

            const normalizedSearch = searchTerm.toLowerCase().trim();

            // Campos visíveis na tabela
            const title = String(item?.title).toLowerCase();
            const estado = String(item?.status || "").toLowerCase();

            return (
                title.includes(normalizedSearch) ||
                estado.includes(normalizedSearch)
            );
        });



        setFilteredDataPublicities(filtered);

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
            title: "",
            status: "",
            start_date: "",
            end_date: ""
        })
        setIsFiltered(false)
        setTimeout(() => refetch(), 0)
    }

    const [current, _setCurrent] = useState(0)

    return (
        <>

            {/* modal para filtrar */}
            <FilterPublicity
                setShowFilter={setShowClearFilter}
                filter={getPublicity}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
            />
            <AdicionaPublicidades isOpen={adicionaModalIsOpen} onClose={() => setAdicionaModalIsOpen(false)} />
            <DetalhesPublicidade isOpen={detailsModalIsOpen} onClose={() => setDetailsModalIsOpen(false)} itemSelected={itemSelected} />
            <EditPublicity isOpen={editModalIsOpen} onClose={() => setEditModalIsOpen(false)} itemSelected={itemSelected} />

            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">
                <div className="overflow-hidden relative w-full h-auto">
                    <div className={`flex transition ease-out duration-500 w-[200%] h-auto `}
                        style={{
                            transform: `translateX(-${current * 50}%)`,
                        }}
                    >

                        <div className="w-full flex flex-col p-5">
                            <div className="flex space-x-4">
                                <button onClick={() => setAdicionaModalIsOpen(true)} type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8]  ring-1 ring-[#ADCBD0]
                        hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold pr-4 px-4 flex space-x-2 items-center">
                                    <Plus className="size-4" aria-hidden="true" />
                                    <span>Adicionar</span>
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

                            <div className="border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                                <table className="w-full md:table-fixed border-collapse ">
                                    <thead className="bg-[#F5F6FA] h-14  ">
                                        <tr className=" place-items-center text-[#143163] ">

                                            {/* <th className={`text-start px-8 py-2 w-[20%]`}>ID do Pagamento</th> */}

                                            <th className={`text-start px-5 `}>Título</th>
                                            <th className="text-start ">Estado</th>
                                            <th className="text-start ">Responsável</th>
                                            <th className="ui-date-column text-center w-[20%]">Data de criação</th>
                                            <th className="text-center w-[10%]">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {isLoading ?
                                            <TableStateRow colSpan={5} state="loading" message="A carregar publicidades..." /> :
                                            filteredDataPublicities.length > 0 ? filteredDataPublicities.map((item: any) =>
                                                <tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">


                                                    <td className="text-start py-2 px-5">
                                                        <p className="font-semibold">{item?.title || "N/A"}</p>
                                                    </td>
                                                    {/* <td className="text-start py-2">
                                                        <div className="w-full h-[30px] flex justify-start items-center">
                                                            <span className={`rounded-lg w-[100px] text-center py-1 ${item?.status === "Active" ? "bg-[#45B36938] text-[#0D9339]" : "bg-[#8E8E8E30] text-[#575757]"}`}>
                                                                {item?.status === "Active" ? "Activa" : "Inativa"}</span></div>
                                                    </td> */}
                                                    <td className="text-start py-2">
                                                        {/*activar ou inactivar */}
                                                        <Tooltip>
                                                            <TooltipTrigger>

                                                                <Dialog >
                                                                    <DialogTrigger asChild className="cursor-pointer p-1">
                                                                        <button onClick={() => { setModalUpdateStatus(true), setItemSelected(item) }}>

                                                                            {item?.status === "Active" ? <svg className="duration-300 hover:opacity-55" width="50" height="25" viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <rect width="50" height="25" rx="14" fill="#22C55E" />
                                                                                <circle cx="36" cy="12.5" r="10" fill="white" className={`transition-all duration-300 ${item?.status === "Inactive" ? "translate-x-[23px]" : "translate-x-0"
                                                                                    }`} />
                                                                            </svg> :
                                                                                <svg className="duration-300 hover:opacity-55" width="50" height="25" viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <rect width="50" height="25" rx="14" fill="#D1D5DB" />
                                                                                    <circle cx="14" cy="12.5" r="10" fill="white" className={`transition-all duration-300 ${item?.status === "Active" ? "translate-x-[23px]" : "translate-x-0"
                                                                                        }`} />
                                                                                </svg>}
                                                                        </button>
                                                                    </DialogTrigger>
                                                                    {modalUpdateStatus &&
                                                                        <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                                                            <ModalUpdateStatus id={itemSelected?.id} action={item?.status && (item?.status === "Active" ? "inactive" : "active")} />

                                                                        </DialogContent>}
                                                                </Dialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-zinc-700">{item?.status === "Active" ? "Inactivar" : "Activar"}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="text-start py-2 px-5">
                                                         <p className="font-semibold">{item?.responsavel || "N/A"}</p>
                                                    </td>
                                                    <td className="ui-date-column text-center py-2 ">{formatDateTime(item?.created_at, "N/A")}</td>

                                                    <td className="text-center py-2  ">
                                                        <div className="flex space-x-2 items-center">

                                                            {/*detalhes */}
                                                            <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />

                                                            {/*editar */}
                                                            <TableActionButton action="edit" onClick={() => { setEditModalIsOpen(true), setItemSelected(item) }} />
                                                            {/* eliminar */}
                                                            <Dialog >
                                                                <DialogTrigger asChild className="cursor-pointer p-1">
                                                                <TableActionButton action="delete" onClick={() => { setModalEliminar(true), setItemSelected(item) }} />
                                                                </DialogTrigger>
                                                                {modalEliminar &&
                                                                    <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                                                        <ModalEliminarPublicidade id={itemSelected?.id} />

                                                                    </DialogContent>}
                                                            </Dialog>


                                                        </div>
                                                    </td>
                                                </tr>
                                            ) :
                                                <TableStateRow colSpan={5} state="empty" message="Nenhuma publicidade encontrada." />
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
                        <div className="w-full p-5 h-fit">

                        </div>

                    </div>
                </div>


            </section>

        </>
    )
}
