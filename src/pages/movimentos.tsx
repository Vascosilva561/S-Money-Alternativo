import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { statusLevantamento } from "@/components/utils/getStatusLevantamentos"
import ExportarMovimentos from "@/components/movimentos/export"
import DetalhesMovimentos from "@/components/movimentos/details"
import FilterMovimentos from "@/components/movimentos/filter"
import type { DataMovimentType, MovimentosType } from "@/types/movimentos"
import { TypeTransaction } from "@/components/utils/getTypeMoviment"
import { PegaDestinoMovimento } from "@/components/utils/destinoMovimento"
import { PegaOrigemMovimento } from "@/components/utils/origemMovimento"
import { statusMovimento } from "@/components/utils/statusMoviment"
import { statusMovimentoColor } from "@/components/utils/statusMovimentosColor"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import TipoDeTransacaoIcon from "@/assets/tipoDeMovimentoIcon"
import { GetAmount } from "@/components/utils/getAmount"
import { generatePaginationRange } from "@/hooks/generatePaginationRange"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { RefreshButton } from "@/components/ui/refresh-button"
import { useSearchParams } from "react-router"
import { formatDateTime } from "@/components/utils/formmat"

export default function Movimentos() {

    const [searchParams, setSearchParams] = useSearchParams();

    // Lê o valor da URL uma vez, na montagem
    const statusFromUrl = searchParams.get("status");
    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(!!statusFromUrl)
    const [itemSelected, setItemSelected] = useState<MovimentosType | undefined>()
    const [status, setStatus] = useState(statusFromUrl ?? "")
    const [tipoDeConta, setTipoDeConta] = useState<"User" | "Merchant" | "">("")
    const [tipoDeMovimento, setTipoDeMovimento] = useState("")
    const [tipoDeTransacao, setTipoDeTransacao] = useState<"DepositGpoFrame" | "PgsPayment" | "Withdrawal" | "Transaction" | "PaymentReferences" | "CampaignReward" | "Referral" | "MerchantTransaction" | "">("")
    const [queryParams, setQueryParams] = useState({
        name: "",
        iban: "",
        valor_de: "",
        valor_ate: "",
        dataFinal: "",
        dataInicial: ""
    })
    const [isFiltered, setIsFiltered] = useState(!!statusFromUrl) // estado para verificar se há filtro

    useEffect(() => {
        const urlStatus = searchParams.get("status");
        if (urlStatus && urlStatus !== status) {
            setStatus(urlStatus);
            setIsFiltered(true);
        }
    }, [searchParams]);

    const getMovimentos = async (page: number) => {
        try {
            const params = new URLSearchParams({
                per_page: String(perPage),
                page: String(page),

                ...(isFiltered && {
                    user_name: queryParams.name || "",
                    signal: tipoDeMovimento || "",
                    account_type: tipoDeConta || "",
                    valor_de: queryParams.valor_de || "",
                    valor_ate: queryParams.valor_ate || "",
                    data_inicio: queryParams.dataInicial || "",
                    data_fim: queryParams.dataFinal || "",
                    status: status || "",
                    type: tipoDeTransacao || "",
                }),
            });

            const { data } = await api.get(`/front/activities?${params}`);

            return data;
        } catch (error) {
            console.error("Erro ao buscar movimentos:", error);
            throw error;
        }
    };

    const { data, refetch, isFetching, isLoading } = useQuery<DataMovimentType>({
        queryKey: ['ListaDeMovimentos', currentPage, perPage, isFiltered],
        queryFn: () => getMovimentos(currentPage),
        //placeholderData: keepPreviousData,
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
        const movements = data?.dados ?? [];
        const term = searchInput.trim().toLowerCase();

        if (!term) {
            return movements;
        }

        return movements.filter((item: any) => {
            const tipoMovimento =
                item?.signal?.toLowerCase() ?? "";

            const origem =
                PegaOrigemMovimento(item)?.toLowerCase() ?? "";

            const destino =
                PegaDestinoMovimento(item)?.toLowerCase() ?? "";

            const tipoTransacao =
                TypeTransaction(item?.type)?.toLowerCase() ?? "";

            const amount =
                item?.detalhe?.transaction?.amount
                    ? `${Number(item.detalhe.transaction.amount).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )} kz`
                    : "";

            const paymentAmount =
                item?.detalhe?.payment_references?.amount
                    ?.toString()
                    .toLowerCase() ?? "";

            const createdAt = item?.created_at
                ? new Date(item.created_at)
                    .toLocaleString("pt-BR")
                    .toLowerCase()
                : "";

            const statusMovimento =
                statusLevantamento(item?.status)?.toLowerCase() ?? "";

            return (
                tipoMovimento.includes(term) ||
                origem.includes(term) ||
                destino.includes(term) ||
                tipoTransacao.includes(term) ||
                amount.toLowerCase().includes(term) ||
                paymentAmount.includes(term) ||
                createdAt.includes(term) ||
                statusMovimento.includes(term)
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


    const totalPages = useMemo(() => {
        if (data?.total === undefined) return 0;

        return Math.ceil(data.total / Number(perPage));
    }, [data?.total, perPage]);

    const paginationRange = useMemo(() => {
        if (!totalPages) return [1];

        return generatePaginationRange(totalPages, currentPage);
    }, [totalPages, currentPage]);

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
            valor_de: "",
            valor_ate: "",
            dataFinal: "",
            dataInicial: ""

        })
        setTipoDeMovimento("")
        setTipoDeTransacao("")
        setStatus("")
        setTipoDeConta("")
        setTimeout(() => refetch(), 0);
        setIsFiltered(false)
        setCurrentPage(1)
        setSearchParams({});
    }


    return (
        <>
            {/* modal para adicionar */}
            <ExportarMovimentos onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />

            {/* modal para filtrar */}
            <FilterMovimentos
                setShowFilter={setShowClearFilter}
                filter={getMovimentos}
                setIsFiltered={setIsFiltered}
                onClose={() => setFilterModalIsOpen(false)}
                isOpen={filterModalIsOpen}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                status={status}
                setStatus={setStatus}
                tipoDeConta={tipoDeConta}
                setTipoDeConta={setTipoDeConta}
                tipoDeMovimento={tipoDeMovimento}
                setTipoDeMovimento={setTipoDeMovimento}
                tipoDeTransacao={tipoDeTransacao}
                setTipoDeTransacao={setTipoDeTransacao}

            />

            {/*modal para ver detalhes */}
            <DetalhesMovimentos itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            {/* cabeçalho das páginas */}
            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page bg-white rounded-lg max-h-max text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] border-2  border-[#C8D7EF]">

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
                        <span><strong>Total de movimentos de entrada:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_entrada ? Number(data?.total_entrada)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total de movimentos de saída:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_saida ? Number(data?.total_saida)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    <div className="  border-1 border-[#EBECEF] rounded-lg relative overflow-x-auto ">
                        <table className="w-full md:table-fixed border-collapse ">
                            <thead className="bg-[#F5F6FA] h-14">
                                <tr className=" place-items-center text-[#143163] ">

                                    <th className={`text-start px-3 py-2 `}>Movimento</th>
                                    <th className="text-start py-2 ">Transação</th>
                                    <th className="text-start py-2 ">Valor</th>
                                    <th className="text-start py-2">Origem</th>
                                    <th className="text-start py-2">Destino</th>
                                    <th className="ui-date-column text-center py-2">Data</th>
                                    <th className="text-start py-2">Estado</th>
                                    <th className="text-start py-2 w-[5%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={8} state="loading" message="A carregar movimentos..." /> :
                                    filteredUsersData.length > 0 ? filteredUsersData.map((item: any) =>
                                        <><tr className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">

                                            <td className="text-start py-2 px-3">
                                                <div className="flex items-center gap-1.5">
                                                    {item?.signal === "CREDIT" ? <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.5" width="35" height="35" rx="17.5" fill="#F5F5F5" />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.3029 15.6541C28.3381 15.5689 28.356 15.4776 28.3555 15.3856C28.3547 15.2021 28.2809 15.0262 28.1499 14.8959L23.8967 10.6991C23.7979 10.6009 23.6719 10.5337 23.5345 10.5062C23.3971 10.4786 23.2545 10.4919 23.1248 10.5443C22.995 10.5967 22.884 10.6859 22.8056 10.8006C22.7272 10.9153 22.6851 11.0504 22.6845 11.1887V13.2872H16.3046C16.1166 13.2872 15.9363 13.3608 15.8033 13.492C15.6704 13.6232 15.5957 13.8011 15.5957 13.9866V16.7845C15.5957 16.97 15.6704 17.1479 15.8033 17.2791C15.9363 17.4103 16.1166 17.484 16.3046 17.484H22.6845V19.5824C22.6838 19.7217 22.7252 19.858 22.8035 19.9739C22.8818 20.0898 22.9934 20.18 23.124 20.2329C23.2097 20.2664 23.3012 20.283 23.3934 20.2819C23.4866 20.2824 23.5791 20.2648 23.6655 20.23C23.7519 20.1952 23.8304 20.1439 23.8967 20.079L28.1499 15.8822C28.2156 15.8168 28.2676 15.7393 28.3029 15.6541Z" fill="#0D9339" />
                                                    <path d="M19.1398 18.8826H12.7599V16.7841C12.7592 16.646 12.7171 16.5112 12.6389 16.3967C12.5607 16.2822 12.4498 16.1931 12.3204 16.1406C12.1913 16.0871 12.049 16.0724 11.9115 16.0986C11.774 16.1247 11.6474 16.1905 11.5477 16.2875L7.29445 20.4844C7.22875 20.5497 7.17678 20.6272 7.1415 20.7125C7.10622 20.7977 7.08834 20.8889 7.08888 20.981C7.08834 21.073 7.10622 21.1643 7.1415 21.2495C7.17678 21.3347 7.22875 21.4123 7.29445 21.4776L11.5477 25.6745C11.614 25.7393 11.6925 25.7906 11.7789 25.8254C11.8652 25.8602 11.9577 25.8778 12.051 25.8773C12.144 25.8797 12.2363 25.8605 12.3204 25.8213C12.4498 25.7689 12.5607 25.6798 12.6389 25.5652C12.7171 25.4507 12.7592 25.3159 12.7599 25.1778V23.0794H19.1398C19.3278 23.0794 19.5081 23.0057 19.641 22.8745C19.774 22.7434 19.8487 22.5654 19.8487 22.3799V19.582C19.8487 19.3965 19.774 19.2186 19.641 19.0874C19.5081 18.9563 19.3278 18.8826 19.1398 18.8826Z" fill="#143163" />
                                                </svg> :
                                                    <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect y="0.5" width="35" height="35" rx="17.5" fill="#F5F5F5" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9479 16.1502C27.9827 16.0649 28.0004 15.9735 27.9999 15.8814C27.9991 15.6978 27.9262 15.5218 27.7969 15.3914L23.5969 11.1914C23.4994 11.0931 23.3749 11.026 23.2393 10.9984C23.1036 10.9708 22.9628 10.9841 22.8347 11.0366C22.7066 11.089 22.5969 11.1783 22.5195 11.293C22.4421 11.4078 22.4005 11.543 22.3999 11.6814V13.7814H16.0999C15.9142 13.7814 15.7362 13.8552 15.6049 13.9865C15.4737 14.1177 15.3999 14.2958 15.3999 14.4814V17.2814C15.3999 17.4671 15.4737 17.6451 15.6049 17.7764C15.7362 17.9077 15.9142 17.9814 16.0999 17.9814H22.3999V20.0814C22.3992 20.2208 22.4401 20.3572 22.5174 20.4732C22.5947 20.5892 22.7049 20.6794 22.8339 20.7324C22.9185 20.7659 23.0089 20.7825 23.0999 20.7814C23.192 20.7819 23.2833 20.7643 23.3686 20.7294C23.4539 20.6946 23.5315 20.6433 23.5969 20.5784L27.7969 16.3784C27.8617 16.313 27.9131 16.2354 27.9479 16.1502Z" fill="#143163" />
                                                        <path d="M18.9 19.3847H12.6V17.2847C12.5993 17.1465 12.5577 17.0116 12.4805 16.897C12.4033 16.7824 12.2938 16.6932 12.166 16.6407C12.0385 16.5871 11.898 16.5724 11.7622 16.5986C11.6264 16.6247 11.5014 16.6905 11.403 16.7877L7.20301 20.9876C7.13813 21.0531 7.08681 21.1306 7.05197 21.2159C7.01714 21.3012 6.99948 21.3925 7.00001 21.4846C6.99948 21.5768 7.01714 21.6681 7.05197 21.7534C7.08681 21.8387 7.13813 21.9162 7.20301 21.9816L11.403 26.1816C11.4684 26.2465 11.546 26.2978 11.6313 26.3327C11.7165 26.3675 11.8079 26.3852 11.9 26.3846C11.9918 26.387 12.0829 26.3678 12.166 26.3286C12.2938 26.2761 12.4033 26.1869 12.4805 26.0723C12.5577 25.9577 12.5993 25.8228 12.6 25.6846V23.5846H18.9C19.0856 23.5846 19.2637 23.5109 19.3949 23.3796C19.5262 23.2483 19.6 23.0703 19.6 22.8846V20.0847C19.6 19.899 19.5262 19.721 19.3949 19.5897C19.2637 19.4584 19.0856 19.3847 18.9 19.3847Z" fill="#EF4A00" />
                                                    </svg>
                                                }
                                                    <p>
                                                         <span className="font-semibold">{item?.signal === "CREDIT" ? `Crédito` : "Débito"}</span>
                                                    </p>
                                                    <CopyTextButton
                                                        value={item?.signal === "CREDIT" ? "Crédito" : "Débito"}
                                                        label="movimento"
                                                    />
                                                </div>
                                            </td>

                                            <td>
                                                <div className="flex space-x-1 items-center w-full">
                                                    <p>{TipoDeTransacaoIcon(item?.type)}</p>
                                                     <p className="font-semibold">{TypeTransaction(item?.type)} </p>
                                                </div>
                                            </td>

                                             <td className={`text-start py-2 font-semibold ${item?.signal === "CREDIT" ? "text-[#0D9339]" : "text-[#EF4A00]"}`}>
                                                {item?.signal === "DEBIT" ? "-" : ""}{GetAmount(item) || "0,00"} Kz
                                            </td>
                                            <td className="text-start py-2 ">
                                                <div className="w-full flex min-w-0 items-center gap-1.5 truncate" title={PegaOrigemMovimento(item)}>
                                                    <p className="min-w-0 truncate font-semibold">{PegaOrigemMovimento(item)}</p>
                                                    <CopyTextButton value={PegaOrigemMovimento(item)} label="origem" />
                                                    {/* <svg className="cursor-pointer" onClick={() => Copiar(PegaOrigemMovimento(item))} width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.8293 3.89583H15.5817C15.4928 2.74633 14.7485 2.0625 13.5376 2.0625H8.95426C7.74335 2.0625 6.99903 2.74633 6.91012 3.89583H6.6626C4.4461 3.89583 3.2251 5.11683 3.2251 7.33333V16.5C3.2251 18.7165 4.4461 19.9375 6.6626 19.9375H15.8293C18.0458 19.9375 19.2668 18.7165 19.2668 16.5V7.33333C19.2668 5.11683 18.0458 3.89583 15.8293 3.89583ZM8.26676 4.125C8.26676 3.58508 8.41435 3.4375 8.95426 3.4375H13.5376C14.0775 3.4375 14.2251 3.58508 14.2251 4.125V5.04167C14.2251 5.58158 14.0775 5.72917 13.5376 5.72917H8.95426C8.41435 5.72917 8.26676 5.58158 8.26676 5.04167V4.125ZM17.8918 16.5C17.8918 17.9456 17.2748 18.5625 15.8293 18.5625H6.6626C5.21701 18.5625 4.6001 17.9456 4.6001 16.5V7.33333C4.6001 5.88775 5.21701 5.27083 6.6626 5.27083H6.91012C6.99903 6.42033 7.74335 7.10417 8.95426 7.10417H13.5376C14.7485 7.10417 15.4928 6.42033 15.5817 5.27083H15.8293C17.2748 5.27083 17.8918 5.88775 17.8918 7.33333V16.5ZM14.6834 11C14.6834 11.3795 14.3754 11.6875 13.9959 11.6875H8.49593C8.11643 11.6875 7.80843 11.3795 7.80843 11C7.80843 10.6205 8.11643 10.3125 8.49593 10.3125H13.9959C14.3754 10.3125 14.6834 10.6205 14.6834 11ZM12.8501 14.6667C12.8501 15.0462 12.5421 15.3542 12.1626 15.3542H8.49593C8.11643 15.3542 7.80843 15.0462 7.80843 14.6667C7.80843 14.2872 8.11643 13.9792 8.49593 13.9792H12.1626C12.5421 13.9792 12.8501 14.2872 12.8501 14.6667Z" fill="#143163" />
                                                    </svg> */}
                                                </div>
                                            </td>

                                            <td className="text-start py-2  pr-3 ">
                                                <div className="w-full flex min-w-0 items-center gap-1.5 truncate" >
                                                    <p title={PegaDestinoMovimento(item)} className="min-w-[80px] max-w-[180px] truncate font-semibold">
                                                        {PegaDestinoMovimento(item) || "N/A"}
                                                    </p>
                                                    <CopyTextButton value={PegaDestinoMovimento(item)} label="destino" />
                                                    {/* <span title="Copiar destino">
                                                    <svg  className="cursor-pointer w-5 h-[19px]" onClick={() => Copiar(PegaDestinoMovimento(item))}  viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.8293 3.89583H15.5817C15.4928 2.74633 14.7485 2.0625 13.5376 2.0625H8.95426C7.74335 2.0625 6.99903 2.74633 6.91012 3.89583H6.6626C4.4461 3.89583 3.2251 5.11683 3.2251 7.33333V16.5C3.2251 18.7165 4.4461 19.9375 6.6626 19.9375H15.8293C18.0458 19.9375 19.2668 18.7165 19.2668 16.5V7.33333C19.2668 5.11683 18.0458 3.89583 15.8293 3.89583ZM8.26676 4.125C8.26676 3.58508 8.41435 3.4375 8.95426 3.4375H13.5376C14.0775 3.4375 14.2251 3.58508 14.2251 4.125V5.04167C14.2251 5.58158 14.0775 5.72917 13.5376 5.72917H8.95426C8.41435 5.72917 8.26676 5.58158 8.26676 5.04167V4.125ZM17.8918 16.5C17.8918 17.9456 17.2748 18.5625 15.8293 18.5625H6.6626C5.21701 18.5625 4.6001 17.9456 4.6001 16.5V7.33333C4.6001 5.88775 5.21701 5.27083 6.6626 5.27083H6.91012C6.99903 6.42033 7.74335 7.10417 8.95426 7.10417H13.5376C14.7485 7.10417 15.4928 6.42033 15.5817 5.27083H15.8293C17.2748 5.27083 17.8918 5.88775 17.8918 7.33333V16.5ZM14.6834 11C14.6834 11.3795 14.3754 11.6875 13.9959 11.6875H8.49593C8.11643 11.6875 7.80843 11.3795 7.80843 11C7.80843 10.6205 8.11643 10.3125 8.49593 10.3125H13.9959C14.3754 10.3125 14.6834 10.6205 14.6834 11ZM12.8501 14.6667C12.8501 15.0462 12.5421 15.3542 12.1626 15.3542H8.49593C8.11643 15.3542 7.80843 15.0462 7.80843 14.6667C7.80843 14.2872 8.11643 13.9792 8.49593 13.9792H12.1626C12.5421 13.9792 12.8501 14.2872 12.8501 14.6667Z" fill="#143163" />
                                                    </svg></span> */}
                                                </div>
                                            </td>

                                            <td className="ui-date-column text-center py-2">{formatDateTime(item?.created_at)}</td>
                                            <td className={`text-start py-2`}>
                                                <span className={"w-6 h-6 rounded-full pr-4 pl-4 py-1 " + (statusMovimentoColor(statusMovimento(item)) ?? "bg-[#F2F4F7] text-[#536176]")}>{statusMovimento(item) ?? "—"}</span></td>
                                            <td className="text-start py-2">
                                            <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                            </td>
                                        </tr>

                                        </>

                                    ) :
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum movimento encontrado." />
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
