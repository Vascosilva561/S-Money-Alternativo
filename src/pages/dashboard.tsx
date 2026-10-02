// import { ChartBarDefault } from "@/components/dashboard/transacoesChart";
import { api } from "@/api";
import CardAlertas from "@/components/dashboard/cardAlertas";
import CardFinanceiro from "@/components/dashboard/cardFinanceiro";
import CardOne from "@/components/dashboard/cardOne";
import CardOperacional from "@/components/dashboard/cardOperacional";
import CardUtilizadoresServicosIntegracao from "@/components/dashboard/cardUtilizadores";
import { IconsCardsDashboard } from "@/components/dashboard/getIcons";
import { DateRangePicker } from "@/components/ui/datepicker-range";
import { formatChange, formatNumberPtAO } from "@/components/utils/formmat";
import { getDateRange } from "@/components/utils/rangeDate";
import type { DashboardPrincipalResponse } from "@/types/dashPrincipal";
import type { GlobalFilters } from "@/types/globalFilters";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type FilterOption = "today" | "yesterday" | "7days" | "30days" | "custom";

export const filterOptions: { key: FilterOption; label: string }[] = [
    { key: "today", label: "Hoje" },
    { key: "yesterday", label: "Ontem" },
    { key: "7days", label: "Últimos 7 dias" },
    { key: "30days", label: "30 dias" },
    { key: "custom", label: "Data personalizada" },
];

// Placeholders — trocar pelos valores reais da API
export const TRANSACTION_TYPE_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "transferencia", label: "Transferência" },
    { key: "levantamento", label: "Levantamento" },
    { key: "deposito", label: "Depósito" },
    { key: "pagamento_servico", label: "Pagamento de serviço" },
    { key: "RECHARGE", label: "Recarga" },
    { key: "QR_PAYMENT", label: "Pagamento QR" },
];


export const STATUS_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "PAID", label: "Pago" },
    { key: "SUCCESS", label: "Sucesso" },
    { key: "PENDING", label: "Pendente" },
    { key: "REJECTED", label: "Rejeitada" },
];

export const ACCOUNT_TYPE_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "user", label: "Particular" },
    { key: "merchant", label: "Empresa" },
];

export const SERVICE_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "TRANSFERS", label: "Transferências" },
    { key: "RECHARGES", label: "Recargas" },
    { key: "QR_PAYMENTS", label: "Pagamentos QR" },
    { key: "WITHDRAWALS", label: "Levantamentos" },
    { key: "DEPOSITS", label: "Depósitos" },
];

export const CHANNEL_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "B", label: "Pagamento Automático (POS)" },
    { key: "A", label: "ATM" },
    { key: "L", label: "Internet Banking (IB)" },
    { key: "M", label: "Express" },
    { key: "Z", label: "POS Digital" },
];

// export const CHANNEL_OPTIONS = [
//     { key: "ALL", label: "Todos" },
//     { key: "APP", label: "App" },
//     { key: "WEB", label: "Web" },
//     { key: "AGENT", label: "Agente" },
//     { key: "USSD", label: "USSD" },
// ];


export default function Dashboard() {

    const [activeFilter, setActiveFilter] = useState<FilterOption>("today");
    const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [periodOverrideActive, setPeriodOverrideActive] = useState(false); // novo

    const [transaction_type, setTransactionType] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [account_type, setAccountType] = useState("ALL");
    const [service, setService] = useState("ALL");
    const [channel, setChannel] = useState("ALL");

    // Estado LOCAL da seção de KPIs (separado do global)
    const [kpiActiveFilter, setKpiActiveFilter] = useState<FilterOption>("today");
    const [kpiCustomRange, setKpiCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

    const kpiLocalDates = useMemo(
        () => getDateRange(kpiActiveFilter, kpiCustomRange),
        [kpiActiveFilter, kpiCustomRange]
    );

    const { start_date, end_date } = useMemo(
        () => getDateRange(activeFilter, customRange),
        [activeFilter, customRange]
    );
    // Se o override global está activo, usa as datas globais; senão, usa as locais dos KPIs
    const kpiEffectiveDates = periodOverrideActive
        ? { start_date, end_date }
        : kpiLocalDates;

    function handleKpiFilterClick(key: FilterOption) {
        setKpiActiveFilter(key);
        if (key !== "custom") {
            setKpiCustomRange({ start: "", end: "" });
        }
    }


    const globalFilters: GlobalFilters = useMemo(
        () => ({
            start_date,
            end_date,
            periodOverrideActive, // novo campo
            transactionType: transaction_type,
            status,
            accountType: account_type,
            service,
            channel,
        }),
        [start_date, end_date, periodOverrideActive, transaction_type, status, account_type, service, channel]
    );

    function handleFilterClick(key: FilterOption) {
        setActiveFilter(key);
        setPeriodOverrideActive(true); // qualquer interação com o período global activa o override
        if (key !== "custom") {
            setCustomRange({ start: "", end: "" });
        }
    }

    function handleCustomRangeChange(range: { start: string; end: string }) {
        setCustomRange(range);
        setPeriodOverrideActive(true); // editar as datas customizadas também activa
    }

    function handleClearFilters() {
        setActiveFilter("today");
        setCustomRange({ start: "", end: "" });
        setPeriodOverrideActive(false); // "Limpar" desliga o override, volta cada seção a ser local
        setTransactionType("ALL");
        setStatus("ALL");
        setAccountType("ALL");
        setService("ALL");
        setChannel("ALL");
    }

    const dashboard_principal = async () => {
        const params = new URLSearchParams({
            start_date: kpiEffectiveDates.start_date,
            end_date: kpiEffectiveDates.end_date,
            ...(transaction_type !== "ALL" && { transaction_type: transaction_type }),
            ...(status !== "ALL" && { status }),
            ...(account_type !== "ALL" && { account_type: account_type }),
            ...(service !== "ALL" && { service }),
            ...(channel !== "ALL" && { channel }),
        });

        try {

            const res = await api.get(`/front/dashboard_principal?${params.toString()}`);
            return res.data;
        } catch (error) {
            console.log(error)
        }
    };

    const { data, isLoading } = useQuery<DashboardPrincipalResponse>({
        queryKey: ["dashboard-principal", kpiEffectiveDates, transaction_type, status, account_type, service, channel],
        queryFn: dashboard_principal,
        enabled: !!kpiEffectiveDates.start_date && !!kpiEffectiveDates.end_date,
    });



    // card do kpis
    const cards = [
        {
            key: "totalClientes",
            title: "Total de clientes",
            value: formatNumberPtAO(data?.kpis.clients_total?.value ?? 0),
            unit: "",
            legend: formatChange(data?.kpis.clients_total?.change ?? null),
        },
        {
            key: "clientesActivos",
            title: "Clientes activos",
            value: formatNumberPtAO(data?.kpis.clients_active?.value ?? 0),
            unit: "",
            legend: formatChange(data?.kpis.clients_active?.change ?? null),
        },
        {
            key: "novosClientes",
            title: "Novos clientes",
            value: formatNumberPtAO(data?.kpis.clients_new?.value ?? 0),
            unit: "",
            legend: formatChange(data?.kpis.clients_new?.change ?? null),
        },
        {
            key: "volumeTransacionado",
            title: "Volume transacionado",
            value: formatNumberPtAO(data?.kpis.transaction_volume?.value ?? 0, 2),
            unit: "Kz",
            legend: formatChange(data?.kpis.transaction_volume?.change ?? null),
        },
        {
            key: "totalTransaccoes",
            title: "Total de transacções",
            value: formatNumberPtAO(data?.kpis.transactions_total?.value ?? 0),
            unit: "",
            legend: formatChange(data?.kpis.transactions_total?.change ?? null),
        },
        {
            key: "ticketMedio",
            title: "Ticket médio",
            value: formatNumberPtAO(data?.kpis.average_ticket?.value ?? 0, 2),
            unit: "Kz",
            legend: formatChange(data?.kpis.average_ticket?.change ?? null),
        },
        {
            key: "taxaSucesso",
            title: "Taxa de sucesso",
            value: formatNumberPtAO(data?.kpis.success_rate?.value ?? 0, 2),
            unit: "%",
            legend: formatChange(data?.kpis.success_rate?.change ?? null),
        },
        {
            key: "saldoTotalWallets",
            title: "Saldo total das wallets",
            value: formatNumberPtAO(data?.kpis.wallets_balance?.value ?? 0, 2),
            unit: "Kz",
            legend: formatChange(data?.kpis.wallets_balance?.change ?? null),
        },
    ];


    return (
        <>
            <div className="flex flex-col space-y-4">

                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    <CardOne
                        onFilterClick={handleFilterClick}
                        customRange={customRange}
                        onCustomRangeChange={handleCustomRangeChange}
                        activeFilter={activeFilter}
                        transactionType={transaction_type}
                        onTransactionTypeChange={setTransactionType}
                        status={status}
                        onStatusChange={setStatus}
                        accountType={account_type}
                        onAccountTypeChange={setAccountType}
                        service={service}
                        onServiceChange={setService}
                        channel={channel}
                        onChannelChange={setChannel}
                        onClearFilters={handleClearFilters}
                    />
                </section>

                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] ">
                    <div className="text-[#143163] flex items-center justify-between ">
                        <div className="flex flex-col justify-between p-5 ">
                            <p className="font-bold text-xl ">Principais KPIs</p>
                            <p>Visão rápida dos indicadores que mais influenciam a operação.</p>
                        </div>
                        {/* filtros */}
                        <div className="flex flex-wrap items-center gap-2 p-5 text-[#7084A4]">
                             {filterOptions.map((option) => {
                                                        if (option.key === "custom" && kpiActiveFilter === "custom" && !periodOverrideActive) {
                                                            return (
                                                                <div
                                                                    key={option.key}
                                                                    className="flex items-center gap-2 ring-1 ring-zinc-200 rounded-full px-3 py-2 bg-[#143163] text-white"
                                                                >
                                                                    <DateRangePicker
                                                                        value={kpiCustomRange}
                                                                        onChange={setKpiCustomRange}
                                                                    />
                            
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setKpiActiveFilter("today")}
                                                                        className=" hover:opacity-70"
                                                                        aria-label="Fechar seletor de data"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                                            stroke-linejoin="round" className="w-[15px] h-[15px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            );
                                                        }
                            
                                                        return (
                                                           <p
                                        key={option.key}
                                        onClick={() => !periodOverrideActive && handleKpiFilterClick(option.key)}
                                        className={`text-sm rounded-full ring-1 ring-zinc-200 p-2 px-3 duration-300
                    ${periodOverrideActive
                                                ? "opacity-40 cursor-not-allowed"
                                                : "cursor-pointer hover:bg-[#143163] hover:text-white"}
                    ${kpiActiveFilter === option.key && !periodOverrideActive
                                                ? "bg-[#143163] text-white"
                                                : ""}`}
                                    >
                                        {option.label}
                                    </p>
                                                        );
                                                    })}
                            
                            {periodOverrideActive && (
                                <p className="text-[11px] text-[#7D8CA6] px-5">
                                    Período controlado pelos filtros globais
                                </p>
                            )}
                        </div>
                    </div>
                    {/* cards */}
                    <div className=" p-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, key) => (
                                <div
                                    key={key}
                                    className="relative p-2 ring-1 ring-[#EEEEEE] rounded-lg 
                       flex space-x-4 items-start justify-start overflow-hidden animate-pulse"
                                >
                                    <div className="w-8 h-8 rounded-md bg-zinc-200 shrink-0" />

                                    <div className="space-y-2 min-w-0 flex-1">
                                        <div className="h-3 w-24 bg-zinc-200 rounded" />
                                        <div className="h-5 w-28 bg-zinc-200 rounded" />
                                        <div className="h-2 w-20 bg-zinc-200 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            cards?.map((item: any, key) => (
                                <div
                                    key={key}
                                    className="relative p-2 ring-1 ring-[#EEEEEE] rounded-lg 
                       flex space-x-4 items-start justify-start hover:bg-zinc-100 duration-300 cursor-pointer overflow-hidden"
                                >
                                    <span>{IconsCardsDashboard(item?.key)}</span>
                                    <div className="space-y-2 min-w-0 flex-1">
                                        <p className="text-[#7D8CA6] text-[12px] font-semibold truncate">{item?.title}</p>
                                        <span className="font-bold text-lg flex items-center flex-wrap gap-x-1 min-w-0">
                                            <p className="text-[#143163] break-words leading-tight ">{item?.value}</p>
                                            <p className=" ">{item?.unit}</p>
                                        </span>
                                        <span className="font-bold text-lg flex items-center space-x-1">
                                            <p className="text-[10px] text-[#0D9339] font-normal">{item?.legend}</p>
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </section>

                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    <CardFinanceiro
                        globalFilters={globalFilters}
                    />

                </section>
                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">

                    <CardOperacional
                        globalFilters={globalFilters}
                    />
                </section>
                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    <CardUtilizadoresServicosIntegracao
                        globalFilters={globalFilters}
                    />

                </section>
                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    <CardAlertas />

                </section>
            </div>
        </>
    )
}