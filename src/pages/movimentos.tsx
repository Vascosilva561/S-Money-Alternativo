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
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { FilterButton } from "@/components/ui/filter-button"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/form-field"
import { ArrowDownLeft, ArrowUpRight, Search, Download } from "lucide-react"
import { useSearchParams } from "react-router"
import { formatDateTime } from "@/components/utils/formmat"
import { useSelectedAccount } from "@/context/selectedAccountCntext"

export default function Movimentos() {

    const [searchParams, setSearchParams] = useSearchParams();
    const userNameSearch = searchParams.get("user_name")

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
    const { account: selectedAccount } = useSelectedAccount();

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

                    user_name: !userNameSearch ? queryParams.name : "",
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

            const { data } = await api.get(`/front/activities?${params}${userNameSearch ? `&user_name=${userNameSearch}`:""}`);

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
        if (!selectedAccount) {
            setSearchParams({});
        }
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
            <section className="ui-data-page max-h-max overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">

                <div className="flex flex-col gap-3 px-4 pb-6 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="brand"
                                className="h-10 px-4"
                                onClick={() => setAddModalIsOpen(true)}
                            >
                                <Download aria-hidden="true" />
                                <span>Exportar</span>
                            </Button>
                            <FilterButton onClick={() => setFilterModalIsOpen(true)} label="Filtrar movimentos" />
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {showClearFilter && <ClearFiltersButton onClick={limparFiltro} />}
                        </div>
                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            {!isLoading && isFetching && (
                                <span className="flex min-h-10 shrink-0 items-center gap-2 text-sm text-[#667895]" role="status" aria-live="polite">
                                    <Spinner color="#143163" width="5" height="5" />
                                    <span>A carregar...</span>
                                </span>
                            )}
                            <TextField
                                type="search"
                                aria-label="Pesquisar movimentos"
                                placeholder="Pesquisar movimentos..."
                                value={searchInput}
                                onKeyDown={handleKeyDown}
                                onChange={(event) => handleSearch(event.target.value)}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>

                    <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                        <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total de movimentos de entrada:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_entrada ? Number(data?.total_entrada)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total de movimentos de saída:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_saida ? Number(data?.total_saida)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E5EBF4]">
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] table-fixed border-collapse text-sm ">
                            <caption className="sr-only">Lista de movimentos</caption>
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
                                        <tr key={item?.id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">

                                            <td className="text-start py-2 px-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`grid size-8 shrink-0 place-items-center rounded-full ${item?.signal === "CREDIT" ? "bg-[#E5F5EA] text-[#0A7A31]" : "bg-[#FDECEC] text-[#B42318]"}`}
                                                        aria-hidden="true"
                                                    >
                                                        {item?.signal === "CREDIT" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                                                    </span>
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
                                                <span className={"ui-status-tag " + (statusMovimentoColor(statusMovimento(item)) ?? "")}>{statusMovimento(item) ?? "—"}</span></td>
                                            <td className="text-start py-2">
                                            <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={8} state="empty" message="Nenhum movimento encontrado." />
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
