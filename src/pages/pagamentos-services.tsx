import { api } from "@/api"
import { TableActionButton } from "@/components/ui/table-action-button"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import type { Pagamentos } from "@/types/pagamentos"
import GetServicesIcon from "@/components/utils/getServicesIcon"
import FilterPayments from "@/components/pagamentos/filter"
import DetalhesPagamento from "@/components/pagamentos/detalhes"
import { statusPayment } from "@/components/utils/statusPayment"
import { statusPaymentColor } from "@/components/utils/statusPaymentColor"
import ExportarPagamentos from "@/components/pagamentos/exportar"
import { Spinner } from "@/components/utils/spinner"
import { TableStateRow } from "@/components/ui/table-state-row"
import { formatCurrency, formatDateTime } from "@/components/utils/formmat"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { RefreshButton } from "@/components/ui/refresh-button"
import { ClearFiltersButton } from "@/components/ui/clear-filters-button"
import { FilterButton } from "@/components/ui/filter-button"
import { Button } from "@/components/ui/button"
import { Search, ReceiptText, TrendingUp, Wallet, Download } from "lucide-react"
import { TextField } from "@/components/ui/form-field"
import { Card } from "@/components/ui/card"
import { useSelectedAccount } from "@/context/selectedAccountCntext"

export default function PagamentosDeServices() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, setItemSelected] = useState<Pagamentos | undefined>()
    const [estadoDoPagamento, setEstadoDoPagamento] = useState("SUCCESS")
    const [servico, setServico] = useState("")

    const [queryParams, setQueryParams] = useState({
        id: "",
        users_name: "",
        account_type: "",
        dataInicial: "",
        dataFinal: "",
        beneficiario: ""

    })
    // const [searchParams] = useSearchParams();
    // const nameUserSearch = searchParams.get("users_name")

    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    const { account } = useSelectedAccount()
    const [tipoDeConta, setTipoDeConta] = useState("User")


    useEffect(() => {
        if (account) {
            setTipoDeConta(account.accountType)
        } else {
            setTipoDeConta("User")
        }
    }, [account])


    async function getPayments(page: number) {
        try {
            //const url = `/front/wallets?per_page=${perPage}&page=${page}`
            const Params = new URLSearchParams({
                status: estadoDoPagamento,
                users_name:
                    account?.accountType === "Merchant"
                        ? account.business_name || ""
                        : account
                            ? `${account.first_name || ""} ${account.last_name || ""}`.trim()
                            : queryParams?.users_name || "",                //beneficiario: queryParams?.beneficiario
                
                            account_type: tipoDeConta,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                servico: servico,
            })?.toString()
            const urlPayments = `/front/pgs_payment?per_page=${perPage}&page=${page}&${Params}`
            const { data } = await api.get(urlPayments)


            return data
        } catch (error) {
            console.log("erro ao busscar users ", error)
        }
    }

    const { data, refetch, isLoading, isFetching } = useQuery<Pagamentos>({
        queryKey: ['listaPagamentos', currentPage, perPage, isFiltered],
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
        if (!data?.dados?.length) {
            return [];
        }

        const normalizedSearch = searchInput.trim().toLowerCase();

        if (!normalizedSearch) {
            return data?.dados;
        }

        return data?.dados?.filter((item: any) => {
            const id = String(item?.id || "").toLowerCase();

            const fullNameOrBusiness =
                item?.account_type === "User"
                    ? `${item?.account?.first_name || ""} ${item?.account?.last_name || ""}`.toLowerCase()
                    : `${item?.account?.business_name || ""}`.toLowerCase();

            const phone = String(
                item?.body_request?.unitel_telefone || ""
            ).toLowerCase();

            const entity = String(
                item?.entity || ""
            ).toLowerCase();

            const amount = item?.amount
                ? Number(item.amount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                }).toLowerCase()
                : "";

            const date = item?.created_at
                ? new Date(item.created_at)
                    .toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    .toLowerCase()
                : "";

            const status = String(
                statusPayment(item?.status) || ""
            ).toLowerCase();

            return (
                id.includes(normalizedSearch) ||
                fullNameOrBusiness.includes(normalizedSearch) ||
                phone.includes(normalizedSearch) ||
                entity.includes(normalizedSearch) ||
                amount.includes(normalizedSearch) ||
                date.includes(normalizedSearch) ||
                status.includes(normalizedSearch)
            );
        });
    }, [data, searchInput]);// Atualiza ao mudar salesData ou searchTerm

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
            id: "",
            users_name: "",
            account_type: "",
            dataInicial: "",
            dataFinal: "",
            beneficiario: ""

        })
        setEstadoDoPagamento("SUCCESS")
        setTipoDeConta("User")
        setServico("")
        setTimeout(() => refetch(), 0)
    }

    interface PaymentsSummary {
        total_saldo: number;
        total_custo: number;
        total_lucro: number;
    }

    async function getSummaryPayments(): Promise<PaymentsSummary> {
        const params = new URLSearchParams({
            status: estadoDoPagamento,
            users_name: queryParams?.users_name,
            account_type: tipoDeConta,
            data_inicio: queryParams?.dataInicial,
            data_fim: queryParams?.dataFinal,
            servico: servico,
        }).toString();

        const urlSummary = `/front/summary_payments?${params}`;

        try {
            const { data } = await api.get(urlSummary);
            return {
                total_saldo: data?.total_saldo ?? 0,
                total_custo: data?.total_custo ?? 0,
                total_lucro: data?.total_lucro ?? 0,
            };
        } catch (error) {
            console.log("erro ao buscar summary", error);
            return { total_saldo: 0, total_custo: 0, total_lucro: 0 };
        }
    }

    const {
        data: summaryData,
        // refetch: refetchSummary,
        isLoading: isLoadingSummary,
    } = useQuery<PaymentsSummary>({
        queryKey: ['summaryPayments', estadoDoPagamento, queryParams, tipoDeConta, servico],
        queryFn: getSummaryPayments,
        placeholderData: keepPreviousData,
    });

    const summaryCards = [
        {
            label: "Saldo dos clientes",
            helper: "Saldo total disponível",
            value: isLoadingSummary ? "A carregar..." : `${Number(summaryData?.total_saldo ?? 0).toLocaleString()} Kz`,
            icon: Wallet,
            iconBackground: "bg-[#EEF6FF]",
            iconColor: "text-[#2678F2]",
            accent: "bg-[#48B9FF]",
        },
        {
            label: "Total consumido",
            helper: "Valor movimentado",
            value: isLoadingSummary ? "A carregar..." : `${Number(summaryData?.total_custo ?? 0).toLocaleString()} Kz`,
            icon: ReceiptText,
            iconBackground: "bg-[#F4F1FF]",
            iconColor: "text-[#7956D8]",
            accent: "bg-[#9B7BFF]",
        },
        {
            label: "Lucro Sómoney",
            helper: "Resultado acumulado",
            value: isLoadingSummary ? "A carregar..." : `${Number(summaryData?.total_lucro ?? 0).toLocaleString()} Kz`,
            icon: TrendingUp,
            iconBackground: "bg-[#ECFBF3]",
            iconColor: "text-[#159B5B]",
            accent: "bg-[#25B76F]",
        },
    ]

    return (
        <>
            {/* modal para adicionar */}
            <ExportarPagamentos onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} />

            {/* modal para filtrar */}
            <FilterPayments
                setShowFilter={setShowClearFilter}
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
                servico={servico}
                setServico={setServico}
            />

            {/*modal para ver detalhes */}
            <DetalhesPagamento itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            {/* <div className="border-2 border-zinc-700 w-[350px]"></div> */}
            <section className="ui-data-page h-fit overflow-hidden rounded-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">

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
                            <FilterButton onClick={() => setFilterModalIsOpen(true)} label="Filtrar pagamentos" />
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
                                aria-label="Pesquisar pagamentos"
                                placeholder="Pesquisar pagamentos..."
                                value={searchInput}
                                onKeyDown={handleKeyDown}
                                onChange={(event) => handleSearch(event.target.value)}
                                startAdornment={<Search className="size-4" aria-hidden="true" />}
                                containerClassName="w-full lg:w-[300px] lg:shrink-0"
                            />
                        </div>
                    </div>
                    {/* Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {summaryCards.map((card) => {
                            const Icon = card.icon

                            return (
                                <Card
                                    key={card.label}
                                    className="relative min-h-[128px] overflow-hidden rounded-lg border border-[#D7E2F2] bg-white p-4 shadow-sm"
                                    role="group"
                                    aria-label={card.label}
                                >
                                    <span className={`absolute inset-y-0 left-0 w-1 ${card.accent}`} aria-hidden="true" />

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#71809A]">
                                                {card.label}
                                            </p>
                                            <p className="mt-2 text-xl font-bold leading-none tracking-tight text-[#143163]">
                                                {card.value}
                                            </p>
                                        </div>

                                        <span
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBackground} ${card.iconColor}`}
                                            aria-hidden="true"
                                        >
                                            <Icon size={19} strokeWidth={2.1} />
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#71809A]">
                                        <span className={`h-1.5 w-1.5 rounded-full ${card.accent}`} aria-hidden="true" />
                                        <span>{card.helper}</span>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Tabela */}
                    <div className="ui-inline-summary flex items-center text-[14px] text-[#143163]">
                        <span><strong>Total geral de registos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total}</span></span>
                        <span className="ui-inline-summary-divider" aria-hidden="true" />
                        <span><strong>Total geral de pagamentos:</strong> <span className="font-semibold">{isLoading ? "..." : data?.total_payment ? Number(data?.total_payment)?.toLocaleString() + " Kz" : "Nenhum valor encontrado"}</span></span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E5EBF4]">
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[880px] table-fixed border-collapse text-sm">
                            <caption className="sr-only">Lista de pagamentos</caption>
                            <thead className="bg-[#F5F6FA] h-14  ">
                                <tr className=" place-items-center text-[#143163] ">

                                    {/* <th className={`text-start px-8 py-2 w-[20%]`}>ID do Pagamento</th> */}
                                    <th className="text-start px-4 py-2 w-[18%]">Utilizador</th>
                                    <th className={`text-start px-4 py-2 w-[18%]`}>Beneficiário</th>
                                    <th className="text-start px-4 py-2 w-[14%]">Serviço</th>
                                    <th className="text-start px-4 py-2 w-[10%]">Valor</th>
                                    <th className="ui-date-column text-center px-4 py-2 w-[14%]">Data</th>
                                    <th className="text-start px-4 py-2 w-[14%]">Estado</th>
                                    <th className="text-start px-4 py-2 w-[12%]">Ações</th>
                                </tr>
                            </thead>

                            <tbody>

                                {isLoading ?
                                    <TableStateRow colSpan={7} state="loading" message="A carregar pagamentos..." /> :
                                    filteredUsersData.length > 0 ? filteredUsersData.map((item: any) =>
                                        <tr key={item?.id} className="border-t-1 border-[#EBECEF] odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F5F6FA] duration-300 text-[#143163] ">
                                            {/* <td className="text-start py-2 px-3">{item?.id}</td> */}
                                            <td className="text-start py-2 px-3">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <p title={item?.account_type === "User" ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}` : item?.account?.business_name || "N/A"} className="min-w-0 truncate font-semibold">{item?.account_type === "User" ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}` :
                                                        `${(item?.account?.business_name?.length > 20 ? item?.account?.business_name?.slice(0, 20) + "..." : item?.account?.business_name) || "N/A"}`}</p>
                                                    <CopyTextButton
                                                        value={item?.account_type === "User"
                                                            ? `${item?.account?.first_name || "N/A"} ${item?.account?.last_name || ""}`
                                                            : item?.account?.business_name || "N/A"}
                                                        label="utilizador"
                                                    />
                                                </div>
                                            </td>
                                            {/* <td className="text-start py-2">{getDestinatarioPagamento(item)}</td> */}
                                            <td className="text-start py-2 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <span title={item?.beneficiario ?? "N/A"}>{item?.beneficiario ?? "N/A"}</span>
                                                    <CopyTextButton value={item?.beneficiario} label="beneficiário" />
                                                </div>
                                            </td>
                                            <td className="text-start py-2">
                                                <div className="flex items-center space-x-1">
                                                    <span>{GetServicesIcon(item?.entity)}</span>
                                                    <span>{item?.entity}</span>
                                                </div>
                                            </td>
                                            <td className="text-start py-2 font-semibold">{formatCurrency(item?.amount)}</td>
                                            <td className="ui-date-column text-center py-2">{formatDateTime(item?.created_at)}</td>
                                            <td className="text-start py-2 pl-2">
                                                <span className={`ui-status-tag ${statusPaymentColor(item?.status) ?? ""}`}>
                                                    {statusPayment(item?.status) ?? item?.status ?? "—"}
                                                </span>
                                            </td>
                                            <td className="text-start py-2 p-1">
                                                <div className="flex items-center space-x-2">
                                                    {/*detalhes */}
                                                    <TableActionButton action="view" onClick={() => { setDetailsModalIsOpen(true), setItemSelected(item) }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        <TableStateRow colSpan={7} state="empty" message="Nenhum pagamento encontrado." />
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
