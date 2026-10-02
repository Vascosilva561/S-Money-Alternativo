
import { ChartAreaInteractive } from "./utilizacaoAppChart";
import ComposicaoSaldoProgressBar from "./progressBar";
import type { DashboardFinancialResponse } from "@/types/dashFinancial";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useMemo, useState } from "react";
import { getDateRange } from "../utils/rangeDate";
import { filterOptions, type FilterOption } from "@/pages/dashboard";
import { formatNumberPtAO } from "../utils/formmat";
import type { GlobalFilters } from "@/types/globalFilters";
import { formatSignedCurrency } from "../utils/formatCorrencySigned";
import { DateRangePicker } from "../ui/datepicker-range";


export const CATEGORY_OPTIONS = [
    { key: "deposits", label: "Depósitos" },
    { key: "withdrawals", label: "Levantamentos" },
    { key: "transfers", label: "Transferências" },
    { key: "qr_payments", label: "Pagamentos por QR Code" },
    { key: "recharges", label: "Recargas" },
    { key: "service_payments", label: "Pagamentos de serviços" },
];

type Props = {
    globalFilters: GlobalFilters;
};


export default function CardFinanceiro({ globalFilters }: Props) {

    const [activeFilter, setActiveFilter] = useState<FilterOption>("today");
    const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

    const localDates = useMemo(
        () => getDateRange(activeFilter, customRange),
        [activeFilter, customRange]
    );

    // Se o override global está activo, usa as datas globais; senão, as locais
    const { start_date, end_date } = globalFilters.periodOverrideActive
        ? { start_date: globalFilters.start_date, end_date: globalFilters.end_date }
        : localDates;

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        CATEGORY_OPTIONS.map((option) => option.key)
    );
    const [selectedMetric, setSelectedMetric] = useState<string>("volume");

    const dashboard_financial = async (
        start_date: string,
        end_date: string,
        categories: string[],
        metric: string
    ) => {
        try {
            const categoriesParam = categories.join(",");
            const params = new URLSearchParams({
                start_date,
                end_date,
                categories: categoriesParam,
                metric,
                ...(globalFilters.transactionType !== "ALL" && { transaction_type: globalFilters.transactionType }),
                ...(globalFilters.status !== "ALL" && { status: globalFilters.status }),
                ...(globalFilters.accountType !== "ALL" && { account_type: globalFilters.accountType }),
                ...(globalFilters.service !== "ALL" && { service: globalFilters.service }),
                ...(globalFilters.channel !== "ALL" && { channel: globalFilters.channel }),
            });
            const res = await api.get(
                `/front/dashboard_financial?${params.toString()}`
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data: financialData, isLoading: isLoadingFinancial } = useQuery<DashboardFinancialResponse>({
        queryKey: ["dashboard-financial", start_date, end_date, selectedCategories, selectedMetric, globalFilters],
        queryFn: () => dashboard_financial(start_date, end_date, selectedCategories, selectedMetric),
        enabled: !!start_date && !!end_date && selectedCategories.length > 0,
    });

    function toggleCategory(key: string) {
        setSelectedCategories((prev) =>
            prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
        );
    }

    function handleFilterClick(key: FilterOption) {
        setActiveFilter(key);
        if (key !== "custom") {
            setCustomRange({ start: "", end: "" });
        }
    }

    const cashFlow = financialData?.cash_flow;

    // % de saídas em relação às entradas
    const outflowPercentOfInflow = useMemo(() => {
        if (!cashFlow?.inflow?.value) return 0;
        return (cashFlow.outflow.value / cashFlow.inflow.value) * 100;
    }, [cashFlow]);

    return (
        <div className="relative px-4 py-2 ring-1 ring-[#EEEEEE] rounded-lg text-[rgb(20,49,99)] 
                        flex flex-col space-y-2 items-start justify-start  
                        duration-300">

            <div className="w-full mt-5">
                <div className="flex flex-col items-start">

                    <p className="text-xl font-bold">Financeiro</p>
                    <p className="text-sm text-[#627AA0]">Volume processado, liquidez disponível e fluxo de caixa no período.</p>
                </div>
                <div className="flex space-x-2 w-full mt-5">
                    <div className="flex flex-col justify-between w-full ring-1 ring-zinc-200 rounded-lg p-5 space-y-2">
                        {/* filtros */}
                        <div className="flex justify-between w-full items-center">
                            <p className="text-lg font-semibold w-[290px]">Volume transaccionado</p>
                            <div className="flex flex-wrap items-center justify-end gap-2 w-full text-[#7084A4] ">
                                {filterOptions.map((option) => {
                                    if (option.key === "custom" && activeFilter === "custom" && !globalFilters.periodOverrideActive) {
                                        return (
                                            <div
                                                key={option.key}
                                                className="flex items-center gap-2 ring-1 ring-zinc-200 rounded-full px-3 py-2 bg-[#143163] text-white"
                                            >
                                                <DateRangePicker
                                                    value={customRange}
                                                    onChange={setCustomRange}
                                                    
                                                />
                                               
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveFilter("today")}
                                                    className=" hover:opacity-70"
                                                    aria-label="Fechar seletor de data"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                     stroke-linejoin="round" className="w-[15px] h-[15px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <p
                                            key={option.key}
                                            onClick={() => !globalFilters.periodOverrideActive && handleFilterClick(option.key)}
                                            className={`text-[12px] rounded-full ring-1 ring-zinc-200 py-2 px-2 duration-300 
                ${globalFilters.periodOverrideActive
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "cursor-pointer hover:bg-[#143163] hover:text-white"}
                ${activeFilter === option.key && !globalFilters.periodOverrideActive
                                                    ? "bg-[#143163] text-white"
                                                    : ""}`}
                                        >
                                            {option.label}
                                        </p>
                                    );
                                })}
                                {globalFilters.periodOverrideActive && (
                                    <p className="text-[11px] text-[#7D8CA6] mt-1">
                                        Período controlado pelos filtros globais
                                    </p>
                                )}
                            </div>
                        </div>
                        <ChartAreaInteractive
                            dataChart={financialData}
                            selectedCategories={selectedCategories}
                            onToggleCategory={toggleCategory}
                            selectedMetric={selectedMetric}
                            onMetricChange={setSelectedMetric}
                        />
                    </div>
                    <div className="w-[55%] ring-1 ring-zinc-200 rounded-lg p-5">
                        <div className="flex flex-col justify-between w-full items-start space-y-2">
                            <p className="text-lg font-bold">Saldos e Cash-flow</p>
                            {/* filtros */}
                            <div className="flex flex-wrap items-center gap-2  text-[#7084A4]">
                                {filterOptions.map((option) => {
                                    if (option.key === "custom" && activeFilter === "custom" && !globalFilters.periodOverrideActive) {
                                        return (
                                            <div
                                                key={option.key}
                                                className="flex items-center gap-2 ring-1 ring-zinc-200 rounded-full px-3 py-2 bg-[#143163] text-white"
                                            >
                                                <DateRangePicker
                                                    value={customRange}
                                                    onChange={setCustomRange}
                                                    
                                                />
                                               
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveFilter("today")}
                                                    className=" hover:opacity-70"
                                                    aria-label="Fechar seletor de data"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                     stroke-linejoin="round" className="w-[15px] h-[15px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <p
                                            key={option.key}
                                            onClick={() => !globalFilters.periodOverrideActive && handleFilterClick(option.key)}
                                            className={`text-[12px] rounded-full ring-1 ring-zinc-200 py-2 px-2 duration-300 
                ${globalFilters.periodOverrideActive
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "cursor-pointer hover:bg-[#143163] hover:text-white"}
                ${activeFilter === option.key && !globalFilters.periodOverrideActive
                                                    ? "bg-[#143163] text-white"
                                                    : ""}`}
                                        >
                                            {option.label}
                                        </p>
                                    );
                                })}
                                {globalFilters.periodOverrideActive && (
                                    <p className="text-[11px] text-[#7D8CA6] mt-1">
                                        Período controlado pelos filtros globais
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-5">
                            {isLoadingFinancial ? (
                                <>
                                    {/* Skeleton: Saldo total */}
                                    <div className="flex items-center justify-between w-full bg-[#F6F8FB] p-2 rounded-lg py-4 animate-pulse">
                                        <div className="flex items-start space-x-2">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                            <div className="space-y-2">
                                                <div className="h-3 w-32 bg-zinc-200 rounded" />
                                                <div className="h-5 w-28 bg-zinc-200 rounded" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-12 bg-zinc-200 rounded ml-auto" />
                                            <div className="h-3 w-16 bg-zinc-200 rounded" />
                                        </div>
                                    </div>

                                    {/* Skeleton: Entradas / Saídas */}
                                    <div className="mt-5 flex justify-between space-x-2">
                                        {Array.from({ length: 2 }).map((_, i) => (
                                            <div key={i} className="w-full bg-[#F7FAFC] p-2 rounded-lg py-4 animate-pulse">
                                                <div className="flex items-start space-x-2">
                                                    <div className="w-7 h-7 rounded-full bg-zinc-200 shrink-0" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-3 w-24 bg-zinc-200 rounded" />
                                                        <div className="h-4 w-20 bg-zinc-200 rounded" />
                                                        <div className="h-2 w-28 bg-zinc-200 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Skeleton: barra de composição */}
                                    <div className="mt-5 w-full h-6 bg-zinc-200 rounded animate-pulse" />
                                </>
                            ) : (
                                <>
                                    {/* Saldo total */}
                                    <div className="flex items-center justify-between w-full bg-[#F6F8FB] p-2 rounded-lg py-4">
                                        <div className="flex items-start space-x-2">
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="40" height="40" rx="8" fill="#0085FF" />
                                                <path d="M26 10H14C11.7909 10 10 11.7909 10 14V26C10 28.2091 11.7909 30 14 30H26C28.2091 30 30 28.2091 30 26V25.5C30 25.2239 29.7761 25 29.5 25H24C21.2386 25 19 22.7614 19 20C19 17.2386 21.2386 15 24 15H29.5C29.7761 15 30 14.7761 30 14.5V14C30 11.7909 28.2091 10 26 10Z" fill="white" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M24 17C22.3431 17 21 18.3431 21 20C21 21.6569 22.3431 23 24 23H29.5C30.3284 23 31 22.3284 31 21.5V18.5C31 17.6716 30.3284 17 29.5 17H24ZM24 18.75C23.3096 18.75 22.75 19.3096 22.75 20C22.75 20.6904 23.3096 21.25 24 21.25C24.6904 21.25 25.25 20.6904 25.25 20C25.25 19.3096 24.6904 18.75 24 18.75Z" fill="white" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-[#7D8CA6]">Saldo total nas carteiras</p>
                                                <p className="font-bold text-lg">{formatNumberPtAO(cashFlow?.balance ?? 0)} Kz</p>
                                            </div>
                                        </div>
                                        {/* "94,8% Disponível" — sem campo correspondente na API, ver observação abaixo */}
                                    </div>

                                    <div className="mt-5 flex justify-between space-x-2">
                                        {/* Entradas */}
                                        <div className="flex items-center justify-between w-full bg-[#0D93391A] p-2 rounded-lg py-4">
                                            <div className="flex items-start space-x-2">
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_1737_56379)">
                                                        <path d="M19 0H9C4.02944 0 0 4.02944 0 9V19C0 23.9706 4.02944 28 9 28H19C23.9706 28 28 23.9706 28 19V9C28 4.02944 23.9706 0 19 0Z" fill="#0D9339" />
                                                        <path d="M14 7V19M18 15L14 19L10 15" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1737_56379">
                                                            <rect width="28" height="28" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-[#7D8CA6] text-[11px]">Entradas (cash-in)</p>
                                                    <p className="font-bold text-lg">{formatNumberPtAO(cashFlow?.inflow?.value ?? 0)} Kz</p>
                                                    <p className="text-[#16A34A] text-[11px]">
                                                        Fluxo líquido {formatSignedCurrency(cashFlow?.net ?? 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Saídas */}
                                        <div className="flex items-center justify-between w-full bg-[#F59E0B1A] p-2 rounded-lg py-4">
                                            <div className="flex items-start space-x-2">
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_1737_56388)">
                                                        <path d="M19 0H9C4.02944 0 0 4.02944 0 9V19C0 23.9706 4.02944 28 9 28H19C23.9706 28 28 23.9706 28 19V9C28 4.02944 23.9706 0 19 0Z" fill="#E29400" />
                                                        <path d="M14 21V9M18 13L14 9L10 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1737_56388">
                                                            <rect width="28" height="28" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-[#7D8CA6] text-[11px]">Saídas (cash-out)</p>
                                                    <p className="font-bold text-lg">{formatNumberPtAO(cashFlow?.outflow?.value ?? 0)} Kz</p>
                                                    <p className="text-[#7D8CA6] text-[11px]">
                                                        {formatNumberPtAO(outflowPercentOfInflow, 1)}% das entradas
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 w-full">
                                        <ComposicaoSaldoProgressBar />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}
