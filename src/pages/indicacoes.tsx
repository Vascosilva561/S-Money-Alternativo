import { Plus } from "lucide-react"
import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { TableStateRow } from "@/components/ui/table-state-row"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import ListaProdutos from "@/components/servicos/listProducts"
import type { ReferralItem, ReferralResponse } from "@/types/Indicacoes"
import type { ConfigTypeResponse, ProgramaIndicacao } from "@/types/configurations"
import DetailsIndicacoes from "@/components/indicacoes&Config/details"
import Configurar from "@/components/indicacoes&Config/configurar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ModalEliminarConfig from "@/components/indicacoes&Config/eliminar"
import EditarConfig from "@/components/indicacoes&Config/edit"
import { formatCurrency, formatDate, formatDateTime } from "@/components/utils/formmat"

export default function Indicacoes() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [addConfigModalIsOpen, setAddConfigModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [showClearFilter, _setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<ReferralItem>()
    const [itemSelectedConfig, setItemSelectedConfig] = useState<ProgramaIndicacao>()
    const [modalEliminar, setModalEliminar] = useState(false)

    const [queryParams, _setQueryParams] = useState({
        title: "",
        active: true,
        start_date: "",
        end_date: "",
        status: ""
    })
    const [current, setCurrent] = useState(0)
    const [separador, setSeperador] = useState<"ListaDeIndicacoes" | "Configuracoes">("ListaDeIndicacoes")
    const [listaIndicacoes, setListaIndicacoes] = useState(true)


    const [isFiltered, _setIsFiltered] = useState(false) // estado para verificar se há filtro

    async function getIndicacoes(page: number) {
        try {
            const url = listaIndicacoes ? "/front/referrals" : "/front/invite_promotions"
            const urlUserBackoffice = isFiltered ? `${url}?per_page=${perPage}&page=${page}&${new URLSearchParams({
                title: queryParams?.title,
                active: String(queryParams?.active),
                start_date: queryParams?.start_date,
                end_date: queryParams?.end_date
            })?.toString()}` : `${url}?per_page=${perPage}&page=${page}`

            const { data } = await api.get(urlUserBackoffice)

            return data
        } catch (error) {
            console.log("erro ao fazer busca ", error)
        }
    }

    const {
        data: referralData,
        //isFetching: isFetchingReferral,
        isLoading: isLoadingReferral
    } = useQuery<ReferralResponse>({
        queryKey: ['ListaDeIndicacoes', currentPage, perPage, isFiltered],
        queryFn: () => getIndicacoes(currentPage),
        placeholderData: keepPreviousData,
        enabled: separador === "ListaDeIndicacoes",
    })

    const {
        data: configData,
        //isFetching: isFetchingConfig,
        isLoading: isLoadingConfig
    } = useQuery<ConfigTypeResponse>({
        queryKey: ['ConfigIndicacoes', currentPage, perPage, isFiltered],
        queryFn: () => getIndicacoes(currentPage), // ajuste o nome real da função
        placeholderData: keepPreviousData,
        enabled: separador === "Configuracoes",
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

    const filteredIndications = useMemo<ReferralItem[]>(() => {
        const lista = referralData?.dados ?? [];
        if (lista.length === 0) return [];

        const normalizedSearch = searchInput?.toLowerCase().trim() ?? "";
        if (!normalizedSearch) return lista;

        return lista.filter((item: ReferralItem) => {
            const userName = item?.user_name?.toLowerCase() ?? "";
            const userPhone = item?.user_phone?.toLowerCase() ?? "";
            const userEmail = item?.user_email?.toLowerCase() ?? "";
            const userNroReference = item?.user_nro_reference?.toLowerCase() ?? "";
            const code = item?.code?.toLowerCase() ?? "";
            const invitedUserName = item?.invited_user_name?.toLowerCase() ?? "";
            const invitedUserPhone = item?.invited_user_phone?.toLowerCase() ?? "";
            const invitedUserEmail = item?.invited_user_email?.toLowerCase() ?? "";
            const invitedUserNroReference = item?.invited_user_nro_reference?.toLowerCase() ?? "";
            const validatedReferral = String(item?.validated_referral ?? "").toLowerCase();
            const createdAt = String(item?.created_at ?? "").toLowerCase();

            return (
                userName.includes(normalizedSearch) ||
                userPhone.includes(normalizedSearch) ||
                userEmail.includes(normalizedSearch) ||
                userNroReference.includes(normalizedSearch) ||
                code.includes(normalizedSearch) ||
                invitedUserName.includes(normalizedSearch) ||
                invitedUserPhone.includes(normalizedSearch) ||
                invitedUserEmail.includes(normalizedSearch) ||
                invitedUserNroReference.includes(normalizedSearch) ||
                validatedReferral.includes(normalizedSearch) ||
                createdAt.includes(normalizedSearch)
            );
        });
    }, [referralData?.dados, searchInput]);

    const filteredConfig = useMemo<ProgramaIndicacao[]>(() => {
        const lista = configData?.dados ?? []
        const search = searchInput?.trim().toLowerCase() ?? ""

        if (!search) return lista

        return lista.filter((item) => {
            const searchableFields = [
                item.name,
                item.description,
                item.start_date,
                item.end_date,
                item.reward_amount,
                item.budget,
                item.active ? "ativo" : "inativo",
            ]

            return searchableFields.some((field) =>
                String(field ?? "").toLowerCase().includes(search)
            )
        })
    }, [configData?.dados, searchInput])

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

    const totalItems = (listaIndicacoes ? referralData?.total : configData?.total) || 0; // Total de registros da API
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




    function AbaListaDeIndicacoes() {
        setListaIndicacoes(true)
        //setStatus("PENDING")
        setCurrentPage(1)
        //setTipoDeConta("User")
        setSeperador("ListaDeIndicacoes")
        //limparFiltro("PENDING")
    }

    function AbaConfiguracoes() {
        setListaIndicacoes(false)
        setCurrentPage(1)
        //setStatus("ACCEPTED")
        //setTipoDeConta("User")
        setSeperador("Configuracoes")
        //limparFiltro("ACCEPTED")
    }

    return (
        <>

            {/* modais */}
            <Configurar
                onClose={() => setAddConfigModalIsOpen(false)}
                isOpen={addConfigModalIsOpen}
            />
            <EditarConfig itemSelected={itemSelectedConfig} onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} />

            <DetailsIndicacoes itemSelected={listaIndicacoes ? itemSelected : itemSelectedConfig} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />
            <div className="ui-tabs flex w-[350px] mr-l z-40" role="tablist" aria-label="Área de indicações">
                <button
                    onClick={AbaListaDeIndicacoes}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer
                         ${listaIndicacoes ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Lista de Indicações</button>
                <button
                    onClick={AbaConfiguracoes}
                    className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer
                        ${!listaIndicacoes ? "border-t-4 border-[#48B9FF] h-[40px] bg-white" : "bg-[#FAFAFA] border-t-1 border-t-[#A9B8CF] h-[35px] mt-1.5"}
                          text-[14px] p-2 border-x-2 border-x-[#C8D7EF]`}>Configurações</button>
            </div>
            <section className="ui-data-page bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">
                <div className="overflow-hidden relative w-full h-auto">
                    <div className={`flex transition ease-out duration-500 w-[200%] h-auto `}
                        style={{
                            transform: `translateX(-${current * 50}%)`,
                        }}
                    >

                        <div className="w-full flex flex-col p-5">
                            <div className="flex space-x-4">
                                {!listaIndicacoes && <button
                                    onClick={() => setAddConfigModalIsOpen(true)}
                                    type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8] ring-1 ring-[#ADCBD0] pr-4 px-4
                         hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold flex space-x-2 items-center">
                                    <Plus className="size-4" aria-hidden="true" />

                                    <span>Configurar</span>

                                </button>}
                                {/* <button
                                    // onClick={() =>
                                    // setFilterModalIsOpen(true)
                                    // }
                                    type="button" className="cursor-pointer p-2 text-[#143163] bg-[#EAF6F8]  ring-1 ring-[#ADCBD0]
                        hover:bg-[#17CFDA] hover:ring-[#17CFDA] rounded-[5px] duration-300 font-semibold pr-4 px-4 flex space-x-2 items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.625 21.75H6.375C3.715 21.75 2.25 20.285 2.25 17.625V6.375C2.25 3.715 3.715 2.25 6.375 2.25H17.625C20.285 2.25 21.75 3.715 21.75 6.375V17.625C21.75 20.285 20.285 21.75 17.625 21.75ZM6.375 3.75C4.535 3.75 3.75 4.535 3.75 6.375V17.625C3.75 19.465 4.535 20.25 6.375 20.25H17.625C19.465 20.25 20.25 19.465 20.25 17.625V6.375C20.25 4.535 19.465 3.75 17.625 3.75H6.375ZM16.75 8C16.75 7.586 16.414 7.25 16 7.25H8C7.586 7.25 7.25 7.586 7.25 8C7.25 8.414 7.586 8.75 8 8.75H16C16.414 8.75 16.75 8.414 16.75 8ZM15.25 12C15.25 11.586 14.914 11.25 14.5 11.25H9.5C9.086 11.25 8.75 11.586 8.75 12C8.75 12.414 9.086 12.75 9.5 12.75H14.5C14.914 12.75 15.25 12.414 15.25 12ZM13.75 16C13.75 15.586 13.414 15.25 13 15.25H11C10.586 15.25 10.25 15.586 10.25 16C10.25 16.414 10.586 16.75 11 16.75H13C13.414 16.75 13.75 16.414 13.75 16Z" fill="#143163" />
                                    </svg>
                                    <span>Filtrar</span>
                                </button> */}
                                {showClearFilter &&
                                    <button
                                        //onClick={() => limparFiltro()} 
                                        type="button" className="ui-clear-filter-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                                        </svg>
                                        <span>Limpar Filtro</span>
                                    </button>
                                }
                            </div>

                            <div className="flex justify-between space-x-4 items-center text-[#143163] mt-5">
                                <div className="flex space-x-2 ">

                                    {/* {!isLoading && (isFetching && <>
                                        <div className=" grid place-items-center">
                                            <Spinner color="#143163" width="6" height="6" />
                                        </div>
                                        <p>A carregar...</p>
                                    </>)} */}
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
                            <div className="mt-10 flex items-center space-x-2 text-[16px] text-[#143163]"><p className="font-bold">Total geral de registos: </p><p className="">
                                {(isLoadingReferral || isLoadingConfig) ? "..." : listaIndicacoes ? referralData?.total : configData?.total}</p>
                            </div>

                            {separador === "ListaDeIndicacoes" && (
                                <div className="border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto">
                                    <table className="w-full md:table-fixed border-collapse">
                                        <thead className="bg-[#F5F6FA] h-14">
                                            <tr className="place-items-center text-[#143163]">
                                                <th className="text-start px-5">Utilizador</th>
                                                <th className="text-center">Contacto</th>
                                                <th className="text-start">Código</th>
                                                <th className="text-start">Utilizador convidado</th>
                                                <th className="text-center">Contacto do convidado</th>
                                                <th className="text-center">Prémio validado</th>
                                                <th className="ui-date-column text-center">Data de registo</th>
                                                <th className="text-start">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoadingReferral ? (
                                                <TableStateRow colSpan={8} state="loading" message="A carregar indicações..." />
                                            ) : filteredIndications.length > 0 ? (
                                                filteredIndications.map((item: ReferralItem) => (
                                                    <tr key={item.id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163]">
                                                        <td className="text-start py-2 px-5"><p className="font-semibold">{item?.user_name}</p></td>
                                                        <td className="text-center py-2"><p>{item?.user_phone}</p></td>
                                                        <td className="text-start py-2 font-semibold">{item?.code}</td>
                                                        <td className="text-start py-2 font-semibold">{item?.invited_user_name}</td>
                                                        <td className="text-center py-2"><p>{item?.invited_user_phone}</p></td>
                                                        <td className="text-center py-2">{item?.validated_referral}</td>
                                                        <td className="ui-date-column text-center py-2">
                                                            {formatDateTime(item?.created_at, "N/A")}
                                                        </td>
                                                        <td className="text-center py-2">
                                                            <div className="flex space-x-2 items-center">
                                                            <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true); setItemSelected(item) }} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <TableStateRow colSpan={8} state="empty" message="Nenhuma indicação encontrada." />
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {separador === "Configuracoes" && (
                                <div className="border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto">
                                    <table className="w-full md:table-fixed border-collapse">
                                        <thead className="bg-[#F5F6FA] h-14">
                                            <tr className="place-items-center text-[#143163]">
                                                <th className="text-start px-5">Nome</th>
                                                <th className="text-start">Descrição</th>
                                                <th className="ui-date-column text-center">Data de início</th>
                                                <th className="ui-date-column text-center">Data de término</th>
                                                <th className="text-center">Valor do prémio</th>
                                                <th className="text-center">Orçamento</th>
                                                <th className="text-center">Estado</th>
                                                <th className="text-start">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoadingConfig ? (
                                                <TableStateRow colSpan={8} state="loading" message="A carregar configurações..." />
                                            ) : filteredConfig.length > 0 ? (
                                                filteredConfig.map((item: ProgramaIndicacao) => (
                                                    <tr key={item.id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163]">
                                                        <td className="text-start py-2 px-5"><p className="font-semibold">{item?.name}</p></td>
                                                        <td className="text-start py-2">{item?.description}</td>
                                                        <td className="ui-date-column text-center py-2">{formatDate(item?.start_date, "N/A")}</td>
                                                        <td className="ui-date-column text-center py-2">{formatDate(item?.end_date, "N/A")}</td>
                                                        <td className="text-center py-2 font-semibold">{formatCurrency(item?.reward_amount)}</td>
                                                        <td className="text-center py-2 font-semibold">{formatCurrency(item?.budget)}</td>
                                                        <td className="text-center py-2">
                                                            <span className={`ui-promotion-status-tag px-2 py-1 rounded-[6px] text-xs font-semibold ${item?.active ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#FDE8E8] text-[#9B1C1C]"}`}>
                                                                {item?.active ? "Activo" : "Inativo"}
                                                            </span>
                                                        </td>
                                                        <td className="text-center py-2">
                                                            <div className="flex space-x-2 items-center">
                                                                {/* detalhes */}
                                                                <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true); setItemSelectedConfig(item) }} />
                                                                {/*editar */}
                                                                <TableActionButton action="edit" onClick={() => { setEditModalIsOpen(true), setItemSelectedConfig(item) }} />
                                                                {/* eliminar */}
                                                                <Dialog >
                                                                    <DialogTrigger asChild className="cursor-pointer p-1">
                                                                    <TableActionButton action="delete" onClick={() => { setModalEliminar(true), setItemSelectedConfig(item) }} />
                                                                    </DialogTrigger>
                                                                    {modalEliminar &&
                                                                        <DialogContent className="sm:max-w-md md:w-[400px] p-3" >

                                                                            <ModalEliminarConfig id={itemSelectedConfig?.id} />

                                                                        </DialogContent>}
                                                                </Dialog>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <TableStateRow colSpan={8} state="empty" message="Nenhuma configuração encontrada." />
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

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
                            <ListaProdutos setCurrent={setCurrent} selectedItem={itemSelected} />
                        </div>

                    </div>
                </div>


            </section>

        </>
    )
}
