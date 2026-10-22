// import { ChartBarDefault } from "@/components/dashboard/transacoesChart";
import { api } from "@/api";
import { IconsCardsDashboardUser } from "@/components/dashboard/iconsAccountDash";
import { DateRangePicker } from "@/components/ui/datepicker-range";
import { formatChange, formatNumberPtAO } from "@/components/utils/formmat";
import { getDateRange } from "@/components/utils/rangeDate";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
    ArrowLeftRight,
    ArrowDownToLine,
    ArrowUpFromLine,
    CreditCard,
    ReceiptText,
    WalletCards,
    CircleCheck,
    Clock3,
    CircleX,

} from "lucide-react";
import { useSelectedAccount } from "@/context/selectedAccountCntext";
import { useNavigate } from "react-router";
import { CardsEmpresa } from "@/components/dashboard/selectedAccountDash.tsx/cardsMerchantRef";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBarDefault } from "@/components/dashboard/selectedAccountDash.tsx/chartsGPO";
import type { DashboardResponse } from "@/types/dashboardAccounteSelected";

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

type ActivityType =
    | "transferencia"
    | "deposito"
    | "levantamento"
    | "pagamento"
    | "pagamentoReferencia"
    | "movimento";

interface RecentActivity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    amount: number;
    date: string;
    status?: "sucesso" | "pendente" | "falhou";
}

const recentActivities: RecentActivity[] = [
    // {
    //     id: "1",
    //     type: "transferencia",
    //     title: "Transferência",
    //     description: "Transferência para João Manuel",
    //     amount: 15000,
    //     date: "Hoje, 14:32",
    //     status: "sucesso",
    // },
    // {
    //     id: "2",
    //     type: "deposito",
    //     title: "Depósito",
    //     description: "Depósito via Multicaixa",
    //     amount: 50000,
    //     date: "Hoje, 13:10",
    //     status: "sucesso",
    // },
    // {
    //     id: "3",
    //     type: "levantamento",
    //     title: "Levantamento",
    //     description: "Levantamento por ATM",
    //     amount: 20000,
    //     date: "Ontem, 16:42",
    //     status: "sucesso",
    // },
    // {
    //     id: "4",
    //     type: "pagamento",
    //     title: "Pagamento",
    //     description: "Pagamento de serviço",
    //     amount: 7500,
    //     date: "Ontem, 11:25",
    //     status: "sucesso",
    // },
    // {
    //     id: "5",
    //     type: "pagamentoReferencia",
    //     title: "Pagamento por Referência",
    //     description: "Pagamento de referência",
    //     amount: 12500,
    //     date: "12 Set, 15:08",
    //     status: "pendente",
    // },
];

const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case "transferencia":
            return <ArrowLeftRight className="w-4 h-4" />;

        case "deposito":
            return <ArrowDownToLine className="w-4 h-4" />;

        case "levantamento":
            return <ArrowUpFromLine className="w-4 h-4" />;

        case "pagamento":
            return <CreditCard className="w-4 h-4" />;

        case "pagamentoReferencia":
            return <ReceiptText className="w-4 h-4" />;

        case "movimento":
            return <WalletCards className="w-4 h-4" />;

        default:
            return <WalletCards className="w-4 h-4" />;
    }
};

const activityConfig: Record<ActivityType,
    {
        label: string;
        className: string;
    }> = {
    transferencia: {
        label: "Transferência",
        className: "bg-blue-100 text-blue-600",
    },

    deposito: {
        label: "Depósito",
        className: "bg-green-100 text-green-600",
    },

    levantamento: {
        label: "Levantamento",
        className: "bg-orange-100 text-orange-600",
    },

    pagamento: {
        label: "Pagamento",
        className: "bg-purple-100 text-purple-600",
    },

    pagamentoReferencia: {
        label: "Pagamento por Referência",
        className: "bg-amber-100 text-amber-700",
    },

    movimento: {
        label: "Movimento",
        className: "bg-slate-100 text-slate-600",
    },
};



const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("pt-AO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export interface DashboardPaymentsResponse {
    sector: {
        total_referencias_geradas_hoje: number;
        total_referencias_geradas: number;
        total_pagamentos_dia: number;
        quantidade_pagamentos_dia: number;
        total_pagamentos_mensal: number;
        quantidade_pagamentos_mensal: number;
    };
    gpo: {
        total_pagamentos_dia: number;
        quantidade_pagamentos_dia: number;
        total_pagamentos_mensal: number;
        quantidade_pagamentos_mensal: number;
        total_pagamentos_geral: number;
        quantidade_pagamentos_geral: number;
    };
}


export default function VisaoGeral() {
    const { account: selectedAccount } = useSelectedAccount();

    const [activeFilter, _setActiveFilter] = useState<FilterOption>("today");
    const [customRange, _setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [periodOverrideActive, _setPeriodOverrideActive] = useState(false); // novo

    const [transaction_type, _setTransactionType] = useState("ALL");
    const [status, _setStatus] = useState("ALL");
    const [account_type, _setAccountType] = useState("ALL");
    const [service, _setService] = useState("ALL");
    const [channel, _setChannel] = useState("ALL");
    const navigate = useNavigate()
    const [kpiActiveFilter, setKpiActiveFilter] = useState<FilterOption>("today");
    const [kpiCustomRange, setKpiCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [typePayment, setTypePayment] = useState<"REFERENCE" | "GPO">("REFERENCE");
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

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-principal", kpiEffectiveDates, transaction_type, status, account_type, service, channel],
        queryFn: dashboard_principal,
        enabled: !!kpiEffectiveDates.start_date && !!kpiEffectiveDates.end_date,
    });

    const isMerchant = selectedAccount?.accountType === "Merchant";

    const cardsUserSingle = [
        {
            key: "saldoDisponivel",
            title: "Saldo disponível",
            value: formatNumberPtAO(
                data?.kpis?.available_balance?.value ?? 0,
                2
            ),
            unit: "Kz",
            change: data?.kpis?.available_balance?.change ?? null,
            legend: formatChange(
                data?.kpis?.available_balance?.change ?? null
            ),
        },

        {
            key: "saldoTotal",
            title: "Saldo total",
            value: formatNumberPtAO(
                data?.kpis?.total_balance?.value ?? 0,
                2
            ),
            unit: "Kz",
            change: data?.kpis?.total_balance?.change ?? null,
            legend: formatChange(
                data?.kpis?.total_balance?.change ?? null
            ),
        },

        {
            key: "transferencias",
            title: "Transferências",
            value: formatNumberPtAO(
                data?.kpis?.transfers_total?.value ?? 0
            ),
            unit: "",
            change: data?.kpis?.transfers_total?.change ?? null,
            legend: formatChange(
                data?.kpis?.transfers_total?.change ?? null
            ),
        },

        {
            key: "depositos",
            title: "Depósitos",
            value: formatNumberPtAO(
                data?.kpis?.deposits_total?.value ?? 0
            ),
            unit: "Kz",
            change: data?.kpis?.deposits_total?.change ?? null,
            legend: formatChange(
                data?.kpis?.deposits_total?.change ?? null
            ),
        },

        {
            key: "levantamentos",
            title: "Levantamentos",
            value: formatNumberPtAO(
                data?.kpis?.withdrawals_total?.value ?? 0
            ),
            unit: "Kz",
            change: data?.kpis?.withdrawals_total?.change ?? null,
            legend: formatChange(
                data?.kpis?.withdrawals_total?.change ?? null
            ),
        },

        {
            key: "pagamentos",
            title: "Pagamentos",
            value: formatNumberPtAO(
                data?.kpis?.payments_total?.value ?? 0
            ),
            unit: "Kz",
            change: data?.kpis?.payments_total?.change ?? null,
            legend: formatChange(
                data?.kpis?.payments_total?.change ?? null
            ),
        },

        {
            key: "pagamentosReferencia",
            title: "Pagamentos por referência",
            value: formatNumberPtAO(
                data?.kpis?.reference_payments_total?.value ?? 0
            ),
            unit: "Kz",
            change: data?.kpis?.reference_payments_total?.change ?? null,
            legend: formatChange(
                data?.kpis?.reference_payments_total?.change ?? null
            ),
        },

        {
            key: "ultimaAtividade",
            title: "Última actividade",
            value: data?.kpis?.last_activity?.value
                ? formatDateTime(data.kpis.last_activity.value)
                : "Sem actividade",
            unit: "",
            change: null,
            legend: "",
        },
    ];

    interface DashboardPaymentsData {
        cards: DashboardResponse;
        charts: DashboardResponse;
    }
    {/**busca de pagamentos */ }
    /** Busca de pagamentos */
    async function getPayments(): Promise<DashboardPaymentsData | undefined> {
        if (!selectedAccount?.id) {
            return undefined;
        }

        try {
            const urlPaymentsCards =
                `/front/merchant/${selectedAccount.id}/payments/statistics`;

            const urlPaymentsChart =
                `/front/merchant/${selectedAccount.id}/payments/chart`;

            const [
                { data: cards },
                { data: charts },
            ] = await Promise.all([
                api.get<DashboardResponse>(urlPaymentsCards),
                api.get<DashboardResponse>(urlPaymentsChart),
            ]);

            return {
                cards,
                charts,
            };
        } catch (error) {
            console.error("Erro ao buscar pagamentos", error);
            throw error;
        }
    }

    const {
        data: dashMerchant,
    } = useQuery<DashboardPaymentsData | undefined>({
        queryKey: [
            "merchantPaymentsDash",
            selectedAccount?.id,
        ],
        queryFn: getPayments,
        enabled: Boolean(selectedAccount?.id),
    });

    const today = new Date().toISOString().split("T")[0];

    const chartsDataFiltered = typePayment === "REFERENCE" ? (dashMerchant?.charts.sector.dados ?? []) : (dashMerchant?.charts.gpo.dados ?? [])
        .filter((item) => item.date <= today);


    return (
        <>
            <div className="flex flex-col space-y-4">

                <section className="bg-white rounded-lg h-fit text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)] ">
                    <div className="text-[#143163] flex items-center justify-between ">
                        <div className="flex flex-col justify-between p-5">
                            <p className="font-bold text-xl">
                                Visão Geral
                            </p>

                            <p className="text-[#627AA0]">
                                Resumo financeiro e operacional desta conta.
                            </p>
                        </div>

                        {/* filtros */}
                        {!isMerchant && <div className="flex flex-wrap items-center gap-2 p-5 text-[#7084A4]">
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
                        </div>}
                    </div>
                    {isMerchant ? <>
                        <div className="w-full flex justify-end items-end pr-5">
                            <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 w-[157px] h-[50px]">
                                <p className="text-[8px] text-[#7D8CA6] duration-300">Tipo de Pagamento</p>
                                <Select value={typePayment} onValueChange={() => setTypePayment(prev => prev === "REFERENCE" ? "GPO" : "REFERENCE")}>
                                    <SelectTrigger className="focus:ring-0 border-0 focus:ring-offset-0 h-[24px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>

                                        <SelectItem key="REFERENCE" value="REFERENCE">
                                            Referência
                                        </SelectItem>
                                        <SelectItem key="GPO" value="GPO">
                                            GPO
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {/* cards user single */}
                        <CardsEmpresa typePayment={typePayment} cardsData={dashMerchant?.cards} isLoadingDash={isLoading} />
                    </> : (
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
                                cardsUserSingle?.map((item: any, key) => {
                                    const isPositive = (item?.change ?? 0) >= 0;
                                    const hasData = item?.change !== null && item?.change !== undefined;

                                    return (
                                        <div
                                            key={key}
                                            className="relative p-2 ring-1 ring-[#EEEEEE] rounded-lg 
                       flex space-x-4 items-start justify-start hover:bg-zinc-100 duration-300 cursor-pointer overflow-hidden"
                                        >
                                            {IconsCardsDashboardUser(item?.key)}
                                            <div className="space-y-2 min-w-0 flex-1">
                                                <p className="text-[#7D8CA6] text-[12px] font-semibold truncate">{item?.title}</p>
                                                <span className="font-bold text-lg flex items-center flex-wrap gap-x-1 min-w-0">
                                                    <p className="text-[#143163] break-words leading-tight ">{item?.value}</p>
                                                    <p className=" ">{item?.unit}</p>
                                                </span>
                                                <span className="font-bold text-lg flex items-center space-x-1">
                                                    <p
                                                        className={`text-[10px] font-normal ${!hasData ? "text-[#7D8CA6]" :
                                                            isPositive ? "text-[#0D9339]" : "text-[#E53935]"
                                                            }`}
                                                    >
                                                        {item?.legend}
                                                    </p>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>)}

                </section>
                {isMerchant && <section className="bg-white rounded-lg text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE]">
                        <div>
                            <p className="font-bold text-xl text-[#143163]">
                                Evolução dos pagamentos
                            </p>

                            <p className="text-[#627AA0] mt-1">
                                Visão geral dos pagamentos
                            </p>
                        </div>

                    </div>

                    <ChartBarDefault
                        chartsData={chartsDataFiltered}
                        isLoading={isLoading}
                        typePayment={typePayment}
                    />
                </section>}
                <section className="bg-white rounded-lg text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE]">
                        <div>
                            <p className="font-bold text-xl text-[#143163]">
                                Actividades recentes
                            </p>

                            <p className="text-[#627AA0] mt-1">
                                Últimas operações realizadas nesta conta.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(`/movimentos?user_name=${selectedAccount?.name}`)}
                            className="text-[#143163] font-semibold hover:underline cursor-pointer"
                        >
                            Ver toda a actividade
                        </button>
                    </div>

                    {/* Actividades */}
                    <div className="p-5">
                        {recentActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-12 h-12 rounded-full bg-[#F3F6FA] flex items-center justify-center mb-3">
                                    <Clock3 className="w-5 h-5 text-[#627AA0]" />
                                </div>

                                <p className="font-semibold text-[#143163]">
                                    Nenhuma actividade recente
                                </p>

                                <p className="text-[#7D8CA6] text-sm mt-1">
                                    Esta conta ainda não possui movimentos recentes.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#EEEEEE]">
                                {recentActivities.map((activity) => {
                                    const config = activityConfig[activity.type];

                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            {/* Ícone + informação */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`
                    w-10 h-10
                    rounded-lg
                    flex items-center justify-center
                    shrink-0
                    ${config.className}
                  `}
                                                >
                                                    {getActivityIcon(activity.type)}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#143163] truncate">
                                                        {activity.title}
                                                    </p>

                                                    <p className="text-[#7D8CA6] text-xs truncate mt-1">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Valor + status + data */}
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-[#143163]">
                                                    {formatNumberPtAO(activity.amount, 2)} Kz
                                                </p>

                                                {/* Status */}
                                                <div className="flex items-center justify-end mt-1">
                                                    {activity.status === "sucesso" && (
                                                        <span className="flex items-center gap-1 text-[11px] text-green-600">
                                                            <CircleCheck className="w-3 h-3" />
                                                            Concluído
                                                        </span>
                                                    )}

                                                    {activity.status === "pendente" && (
                                                        <span className="flex items-center gap-1 text-[11px] text-yellow-600">
                                                            <Clock3 className="w-3 h-3" />
                                                            Pendente
                                                        </span>
                                                    )}

                                                    {activity.status === "falhou" && (
                                                        <span className="flex items-center gap-1 text-[11px] text-red-600">
                                                            <CircleX className="w-3 h-3" />
                                                            Falhou
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-[#7D8CA6] text-xs mt-1">
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </>
    )
}