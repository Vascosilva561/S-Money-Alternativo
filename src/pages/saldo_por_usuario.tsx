import { api } from "@/api"
import { PaginationFooter } from "@/components/ui/pagination-footer"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import type { Users } from "@/types/users"
import EditUsuario from "@/components/gestaoDeContas/edit"
import Exportar from "@/components/gestaoDeContas/export"
import DetailsGestaoUsuario from "@/components/gestaoDeContas/details"
import { Spinner } from "@/components/utils/spinner"
import type { saldo_por_usuario_response, saldo_por_usuario_type } from "@/types/saldo-por-usuarios"
import FilterBalancetUser from "@/components/saldo_por_usuarios.tsx/filter"
import { statusUserColor } from "@/components/utils/getSituacaoColor"
import { Search, Wallet, X } from "lucide-react"
import { formatCurrency } from "@/components/utils/formmat"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { TableStateRow } from "@/components/ui/table-state-row"
import { RefreshButton } from "@/components/ui/refresh-button"
import { useSearchParams } from "react-router"

export default function SaldoPorUsuario() {

    const perPage = "100"
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [particularAccount, setParticularAccount] = useState(true)
    const [addModalIsOpen, setAddModalIsOpen] = useState(false)
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false)
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [itemSelected, _setItemSelected] = useState<Users | undefined>()
    const [queryParams, setQueryParams] = useState({
        name: "",
        phone_number: "",
        nif: "",
        status: "",
        balance: ""
    })
    const [statusParam, setStatusParam] = useState("") // parametro para o status da conta ao fazer filtro
    const [situacaoParam, setSituacaoParam] = useState("") // parametro para a situacao do user ao fazer filtro
    const [nivelParam, setNivelParam] = useState("") // filtro para o nivel da conta
    const [nacionalidadeParam, setNacionalidadeParam] = useState("")
    const [isFiltered, setIsFiltered] = useState(false) // estado para verificar se há filtro
    const [searchParams] = useSearchParams();
    const nameUserSearch = searchParams.get("name")


    async function getUsers(page: number) {
        try {
            const urlUsers = isFiltered ? `/front/${particularAccount ? "balance_users" : "balance_merchants"
                }?per_page=${perPage}&page=${page}&name=${queryParams?.name}&status=${queryParams?.status === "Todos" ? "" : queryParams?.status}&phone_number=${queryParams?.phone_number || queryParams?.nif}&balance=${queryParams?.balance}` :
                `/front/${particularAccount ? "balance_users" : "balance_merchants"
                }?per_page=${perPage}&page=${page}${nameUserSearch && `&name=${nameUserSearch}`}`;

            const totalSaldoURL = `/front/sum_balance_${particularAccount ? "users" : "merchants"}`; //sum_balance_merchants

            const [usersResult, balanceResult] = await Promise.allSettled([
                api.get(urlUsers),
                api.get(totalSaldoURL),
            ]);

            // tratar users (principal)
            let usersData = null;
            if (usersResult.status === "fulfilled") {
                usersData = usersResult.value.data;
            } else {
                console.log("Erro ao buscar saldo dos users:", usersResult.reason);
            }

            // tratar saldo (secundário)
            let totalBalance = null;
            if (balanceResult.status === "fulfilled") {
                totalBalance = balanceResult.value.data;
            } else {
                console.log("Erro ao buscar total dos saldos dos users:", balanceResult.reason);
            }

            //setIsFiltered(false);

            type totalType = {
                total: string | number
            }


            return {
                users: usersData as saldo_por_usuario_response,
                totalBalance: totalBalance as totalType,
            };

        } catch (error) {
            console.log("erro geral ao buscar dados", error);
        }
    }

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['ListadeSaldoPorUsuario', currentPage, perPage, particularAccount, isFiltered],
        queryFn: () => getUsers(currentPage),
        //placeholderData: keepPreviousData,
    })



    const handleSearch = (params: string | undefined) => {
        // Permite espaços no meio, mas evita strings só com espaços
        if (params && params.trim().length > 0) {
            setSearchInput(params);
        } else {
            setSearchInput(params || "");
        }
    };

    const filteredUsers = useMemo(() => {
        if (!data?.users?.dados || data?.users?.dados.length === 0) {
            return []
        }

        if (!searchInput) {
            const sorted = data?.users?.dados?.sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
            return sorted || [];
        }

        const searchTerm = searchInput.toLowerCase();

        const filtered = data?.users?.dados.filter((item: saldo_por_usuario_type) => {
            const fullName = `${item.first_name} ${item.last_name}`.toLowerCase() || "";
            const phoneNumber = item.phone_number.toLowerCase() || "";
            const email = item.email?.toLowerCase() || "";
            const status = item.status.toLowerCase() || "";
            const balance = item.balance.toLowerCase() || "";

            return (
                fullName.includes(searchTerm) ||
                phoneNumber.includes(searchTerm) ||
                email.includes(searchTerm) ||
                status.includes(searchTerm) ||
                balance.includes(searchTerm)
            );
        });

        const sorted = filtered.sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));

        return sorted || [];


    }, [data?.users?.dados, searchInput, isFiltered]); // Atualiza ao mudar salesData ou searchTerm

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



    const totalItems = data?.users?.total || 0; // Total de registros da API
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
            status: "",
            balance: ""
        })

        setTimeout(() => refetch(), 0)
    }


    return (
        <>
            {/* modal para exportar */}
            <Exportar onClose={() => setAddModalIsOpen(false)} isOpen={addModalIsOpen} typeAccount={particularAccount} />

            <EditUsuario onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} typeAccount={particularAccount} selectedItem={itemSelected} />

            {/* modal para filtrar */}
            <FilterBalancetUser
                setShowFilter={setShowClearFilter}
                filter={refetch}
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

            {/*modal para ver detalhes */}
            <DetailsGestaoUsuario itemSelected={itemSelected} onClose={() => setDetailsModalIsOpen(false)} isOpen={detailsModalIsOpen} />

            <div className="ui-tabs flex w-full max-w-[360px] items-end gap-1" role="tablist" aria-label="Tipo de conta">
                <button
                    type="button"
                    role="tab"
                    aria-selected={particularAccount}
                    onClick={() => {
                        setParticularAccount(true)
                        setCurrentPage(1)
                    }}
                    className={`grid flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${
                        particularAccount ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC]"
                    }`}
                >
                    Particulares
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={!particularAccount}
                    onClick={() => {
                        setParticularAccount(false)
                        setCurrentPage(1)
                    }}
                    className={`grid flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${
                        !particularAccount ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC]"
                    }`}
                >
                    Empresas
                </button>
            </div>
            <section className="ui-data-page overflow-hidden rounded-b-xl rounded-tr-xl border border-[#D7E2F2] bg-white text-sm shadow-[0_8px_24px_rgba(20,49,99,0.06)]">
                <div className="p-4 sm:p-5 lg:p-6">
                    <div className="ui-toolbar flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setFilterModalIsOpen(true)}
                                type="button"
                                aria-label="Filtrar"
                                title="Filtrar"
                                className="ui-filter-trigger"
                            >
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16l-6.5 7v5l-3 2v-7L4 5z" /></svg>
                                </button>
                            <RefreshButton onRefresh={() => { void refetch() }} isLoading={isFetching} />
                            {showClearFilter && (
                                <button
                                    onClick={() => limparFiltro()}
                                    type="button"
                                    className="ui-clear-filter-button order-4"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="currentColor" />
                                    </svg>
                                    <span>Limpar filtros</span>
                                </button>
                            )}
                        </div>

                        <div className="flex w-full items-center gap-3 text-[#143163] lg:w-auto">
                            <div className="flex min-h-6 items-center gap-2 text-sm">
                                {!isLoading && isFetching && (
                                    <>
                                        <Spinner color="#143163" width="5" height="5" />
                                        <p className="text-[#667895]">A carregar...</p>
                                    </>
                                )}
                            </div>
                            <div className="relative w-full lg:w-[300px] lg:shrink-0">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8293AE]" aria-hidden="true" />
                                <input
                                    type="search"
                                    aria-label="Pesquisar saldo por utilizador"
                                    placeholder="Pesquise..."
                                    onKeyDown={handleKeyDown}
                                    value={searchInput}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-[#C9D8E9] bg-white pl-10 pr-10 text-sm text-[#143163] outline-none placeholder:text-[#9AAAC0] focus:border-[#48B9FF] focus:ring-4 focus:ring-[#48B9FF]/15"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        aria-label="Limpar pesquisa"
                                        onClick={() => setSearchInput("")}
                                        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[#8293AE] hover:bg-[#F1F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"
                                    >
                                        <X className="size-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 px-4 pb-6 sm:px-5 lg:px-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <article className="flex min-h-[96px] max-w-[380px] items-center justify-between gap-4 rounded-lg border border-[#D7E2F2] bg-white p-4 shadow-sm">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF6FF] text-[#2678F2]" aria-hidden="true">
                                    <Wallet className="size-5" strokeWidth={2.1} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#71809A]">Saldo total das wallets</p>
                                    <p className="mt-1 text-xl font-bold leading-none tracking-tight text-[#143163]">
                                        {isLoading ? "A carregar..." : `${Number(data?.totalBalance?.total ?? 0).toLocaleString()} Kz`}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="ui-record-count flex items-center gap-2 pt-1 text-sm text-[#143163]">
                        <span className="font-semibold">Total geral de registos:</span>
                        <span className="rounded-full bg-[#F1F5FA] px-2.5 py-1 font-semibold">{isLoading ? "..." : data?.users?.total ?? 0}</span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E5EBF4]">
                        <div className="overflow-x-auto">
                            <table className="ui-balance-table w-full min-w-[760px] table-fixed border-collapse text-sm">
                                <caption className="sr-only">Saldos por utilizador</caption>
                                <thead className="h-12 bg-[#F5F7FB] text-xs font-semibold text-[#143163]">
                                    <tr>
                                        <th className="w-[34%] px-4 text-left">{particularAccount ? "Utilizador" : "Empresa"}</th>
                                        <th className="w-[22%] px-4 text-left">{particularAccount ? "Telefone" : "NIF"}</th>
                                        <th className="w-[24%] px-4 text-left">Situação</th>
                                        <th className="w-[20%] px-4 text-right">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableStateRow colSpan={4} state="loading" message="A carregar saldos..." />
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.map((item: saldo_por_usuario_type) => (
                                            <tr key={item.id} className="text-[#143163]">
                                                <td className="ui-name-column px-4 py-3 text-left font-bold">
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <span className="min-w-0 truncate">
                                                            {particularAccount ? `${item.first_name} ${item.last_name}` : item.business_name || "..."}
                                                        </span>
                                                        <CopyTextButton
                                                            value={particularAccount ? `${item.first_name} ${item.last_name}` : item.business_name || ""}
                                                            label={particularAccount ? "utilizador" : "empresa"}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="ui-preserve-cell px-4 py-3 text-left font-semibold">
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <span className="ui-full-value min-w-0 flex-1">{item.phone_number || item.email || "N/A"}</span>
                                                        <CopyTextButton
                                                            value={item.phone_number || item.email || ""}
                                                            label={particularAccount ? "telefone" : "NIF"}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-left">
                                                    <span className={`inline-flex min-h-6 items-center rounded-full px-3 py-1 text-xs font-semibold ${statusUserColor(item.status)}`}>
                                                        {item.status === "Active" ? "Activo" :
                                                            ((item.status === "Inactivo" || item.status === "Inative") ? "Inactivo" : "Desactivado")}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-semibold ${Number(item.balance) >= 200 ? "border-b-[0.5px] border-b-[#A5F3B9] bg-[#EBFCE4] text-[#3B772F]" : "bg-[#FCDBDB] text-[#AC1414]"}`}>
                                                    {formatCurrency(item.balance, "Kz", 2, "0,00 Kz")}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableStateRow colSpan={4} state="empty" message="Nenhum saldo encontrado." />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

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
