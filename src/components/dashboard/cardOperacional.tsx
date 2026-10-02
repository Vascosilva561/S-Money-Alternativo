
import { useMemo, useState } from "react";
import { ChartTransationChart } from "./transacaoOperacaoChart";
import { getDateRange } from "../utils/rangeDate";
import { filterOptions, type FilterOption } from "@/pages/dashboard";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { DashboardOperationalResponse } from "@/types/dashOperational";
import { formatNumberPtAO } from "../utils/formmat";
import type { GlobalFilters } from "@/types/globalFilters";
import { DateRangePicker } from "../ui/datepicker-range";


export const STATUS_OPTIONS = [
    { key: "ALL", label: "Todos" },
    { key: "PAID", label: "Sucesso" },       // valor exato a confirmar com o backend
    { key: "PENDING", label: "Pendente" },
    { key: "FAILED", label: "Falhada" },
    { key: "REVERTED", label: "Revertida" },
    { key: "CANCELLED", label: "Cancelada" },
];

type Props = {
    globalFilters: GlobalFilters;
};

export default function CardOperacional({ globalFilters }: Props) {
    const [activeFilter, setActiveFilter] = useState<FilterOption>("today");
    const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

    const localDates = useMemo(
        () => getDateRange(activeFilter, customRange),
        [activeFilter, customRange]
    );

    const { start_date, end_date } = globalFilters.periodOverrideActive
        ? { start_date: globalFilters.start_date, end_date: globalFilters.end_date }
        : localDates;

    // Estado local — sobrescrito se o global de "Estado" estiver activo
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const statusOverrideActive = globalFilters.status !== "ALL";
    const effectiveStatus = statusOverrideActive ? globalFilters.status : statusFilter;

    const dashboard_operacional = async (start_date: string, end_date: string, status: string) => {
        const params = new URLSearchParams({
            start_date,
            end_date,
            ...(status !== "ALL" && { status }),
            ...(globalFilters.transactionType !== "ALL" && { transaction_type: globalFilters.transactionType }),
            ...(globalFilters.accountType !== "ALL" && { account_type: globalFilters.accountType }),
            ...(globalFilters.service !== "ALL" && { service: globalFilters.service }),
            ...(globalFilters.channel !== "ALL" && { channel: globalFilters.channel }),
        });
        const res = await api.get(`/front/dashboard_operational?${params.toString()}`);
        return res.data;
    };

    const { data: operationalData, isLoading: isLoadingOperational } = useQuery<DashboardOperationalResponse>({
        queryKey: ["dashboard_operational", start_date, end_date, effectiveStatus, globalFilters],
        queryFn: () => dashboard_operacional(start_date, end_date, effectiveStatus),
        enabled: !!start_date && !!end_date,
    });

    function handleFilterClick(key: FilterOption) {
        setActiveFilter(key);
        if (key !== "custom") {
            setCustomRange({ start: "", end: "" });
        }
    }
    return (
        <div className="relative px-4 py-2 ring-1 ring-[#EEEEEE] rounded-lg text-[rgb(20,49,99)] 
                        flex flex-col space-y-2 items-start justify-start  
                        duration-300">

            <div className="w-full mt-5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold">Operacional</p>
                        <p className="text-sm text-[#627AA0]">Estado e cadência das transacções para acompanhar o dia a dia.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 p-5 text-[#7084A4]">
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
                                                stroke-linejoin="round" className="w-[15px] h-[15px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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
                <div className="flex space-x-2 w-full mt-5">
                    <div className="w-[70%] ring-1 ring-zinc-200 rounded-lg p-5">
                        <div className="">
                            <p className="text-lg font-bold">Estado das transacções</p>
                        </div>
                        <div className="mt-5">
                            {isLoadingOperational ? (
                                <>
                                    {/* Skeleton: Total de transacções */}
                                    <div className="w-full bg-[#F6F8FB] p-2 rounded-lg py-4 animate-pulse">
                                        <div className="flex items-start space-x-2">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                            <div className="space-y-2">
                                                <div className="h-3 w-32 bg-zinc-200 rounded" />
                                                <div className="h-5 w-20 bg-zinc-200 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skeleton: Taxa de sucesso */}
                                    <div className="w-full bg-[#EDFAF2] p-2 rounded-lg py-4 mt-4 animate-pulse">
                                        <div className="flex items-start space-x-2">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                            <div className="space-y-2">
                                                <div className="h-3 w-24 bg-zinc-200 rounded" />
                                                <div className="h-5 w-40 bg-zinc-200 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skeleton: grid de 4 status */}
                                    <div className="mt-5 w-full grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="bg-[#F7FAFC] p-2 mb-4 rounded animate-pulse">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0" />
                                                    <div className="h-3 w-16 bg-zinc-200 rounded" />
                                                </div>
                                                <div className="h-4 w-12 bg-zinc-200 rounded mt-2" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full bg-[#F6F8FB] p-2 rounded-lg py-4">
                                        <div className="flex items-start space-x-2">
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="40" height="40" rx="8" fill="#0085FF" />
                                                <path d="M14 16.25L26 16.25M23 13.25L26 16.25L23 19.25M26 23.75L14 23.75M17 26.75L14 23.75L17 20.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-[#7D8CA6]">Total de transacções</p>
                                                <p className="font-bold text-lg">{formatNumberPtAO(operationalData?.states?.total || 0)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-[#EDFAF2] p-2 rounded-lg py-4 mt-4">
                                        <div className="flex items-start space-x-2">
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="40" height="40" rx="8" fill="#16A34A" />
                                                <path d="M25.5338 14.5566C26.0551 14.0235 26.9089 14.0139 27.442 14.5351C27.9751 15.0563 27.9847 15.9102 27.4635 16.4433L18.6637 25.4433C18.4117 25.7011 18.0672 25.8474 17.7067 25.8496C17.3461 25.8516 16.9988 25.71 16.7438 25.455L12.5436 21.2548C12.0166 20.7277 12.0168 19.8729 12.5436 19.3457C13.0708 18.8184 13.9265 18.8184 14.4538 19.3457L17.6872 22.5791L25.5338 14.5566Z" fill="white" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-[#7D8CA6]">Taxa de sucesso</p>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-bold text-lg">{formatNumberPtAO(operationalData?.states?.success?.rate || 0)} %</p>
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="4" cy="4" r="4" fill="#16A34A" />
                                                    </svg>
                                                    <p className="font-bold text-lg">{formatNumberPtAO(operationalData?.states?.success?.count || 0)} concluídas</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 w-full grid grid-cols-2 md:grid-cols-4 space-x-2 items-center">
                                        <div className="bg-[#FFF9ED] p-2 mb-4 rounded">
                                            <div className="flex items-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#FEF3C7" />
                                                    <path d="M12.0024 10.2003V12.0003L13.0309 13.0288M17.1451 12.0003C17.1451 14.8406 14.8426 17.1431 12.0022 17.1431C9.16191 17.1431 6.85938 14.8406 6.85938 12.0003C6.85938 9.15996 9.16191 6.85742 12.0022 6.85742C14.8426 6.85742 17.1451 9.15996 17.1451 12.0003Z" stroke="#E49500" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-[11px]">Pendente</p>
                                            </div>
                                            <p className="text-[16px] font-bold mt-1">{formatNumberPtAO(operationalData?.states?.pending || 0)}</p>
                                        </div>

                                        <div className="bg-[#FFF2F2] p-2 mb-4 rounded">
                                            <div className="flex items-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#FEE2E2" />
                                                    <path d="M8.57031 8.57129L15.4275 15.4284M15.4275 8.57129L8.57031 15.4284" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-[11px]">Falhadas</p>
                                            </div>
                                            <p className="text-[16px] font-bold mt-1">{formatNumberPtAO(operationalData?.states?.failed || 0)}</p>
                                        </div>

                                        <div className="bg-[#F7FAFC] p-2 mb-4 rounded">
                                            <div className="flex items-center">
                                                <svg className="min-w-6 min-h-6 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#DFE6EE" />
                                                    <path d="M8.57031 8.57129L15.4275 15.4284M15.4275 8.57129L8.57031 15.4284" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-[11px]">Canceladas</p>
                                            </div>
                                            <p className="text-[16px] font-bold mt-1">{formatNumberPtAO(operationalData?.states?.cancelled || 0)}</p>
                                        </div>

                                        <div className="bg-[#FDEDFF] p-2 mb-4 rounded">
                                            <div className="flex items-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#E6C7FE" />
                                                    <path d="M10.0227 16.7471L9.75339 17.3932H9.75339L10.0227 16.7471ZM16.7479 13.9788L16.1018 13.7095V13.7095L16.7479 13.9788ZM13.9796 7.2536L13.7103 7.89972H13.7103L13.9796 7.2536ZM7.25441 10.0219L6.57578 10.1936C6.62135 10.3737 6.73665 10.5283 6.89629 10.6233C7.05592 10.7184 7.2468 10.7461 7.42687 10.7003L7.25441 10.0219ZM7.5826 8.46495C7.48779 8.09015 7.1071 7.86318 6.73231 7.95799C6.35752 8.0528 6.13054 8.43349 6.22535 8.80828L6.90398 8.63661L7.5826 8.46495ZM8.81254 10.3481C9.18722 10.2528 9.41375 9.87187 9.3185 9.49719C9.22325 9.1225 8.8423 8.89598 8.46762 8.99122L8.64008 9.66965L8.81254 10.3481ZM8.8601 15.144C8.58674 14.8706 8.14353 14.8706 7.87015 15.1439C7.59677 15.4173 7.59676 15.8605 7.87011 16.1339L8.36511 15.6389L8.8601 15.144ZM6.54793 13.965C6.54793 14.3516 6.86133 14.665 7.24793 14.665C7.63452 14.665 7.94793 14.3516 7.94793 13.965H7.24793H6.54793ZM7.94793 13.9593C7.94793 13.5727 7.63452 13.2593 7.24793 13.2593C6.86133 13.2593 6.54793 13.5727 6.54793 13.9593H7.24793H7.94793ZM6.15938 11.9994C6.15938 12.386 6.47278 12.6994 6.85938 12.6994C7.24597 12.6994 7.55937 12.386 7.55937 11.9994H6.85938H6.15938ZM7.55937 11.9937C7.55937 11.6071 7.24597 11.2937 6.85938 11.2937C6.47278 11.2937 6.15938 11.6071 6.15938 11.9937H6.85938H7.55937ZM12.702 9.14259C12.702 8.75599 12.3886 8.44259 12.002 8.44259C11.6154 8.44259 11.302 8.75599 11.302 9.14259H12.002H12.702ZM12.002 11.9937H11.302C11.302 12.1789 11.3754 12.3566 11.5061 12.4878L12.002 11.9937ZM13.2203 14.2078C13.4933 14.4816 13.9365 14.4823 14.2103 14.2094C14.4841 13.9365 14.4849 13.4933 14.212 13.2195L13.7161 13.7136L13.2203 14.2078ZM10.0227 16.7471L9.75339 17.3932C12.7318 18.6347 16.1526 17.2266 17.3941 14.2481L16.7479 13.9788L16.1018 13.7095C15.1579 15.9743 12.5567 17.045 10.292 16.101L10.0227 16.7471ZM16.7479 13.9788L17.3941 14.2481C18.6355 11.2697 17.2274 7.84889 14.2489 6.60748L13.9796 7.2536L13.7103 7.89972C15.9751 8.84367 17.0458 11.4448 16.1018 13.7095L16.7479 13.9788ZM13.9796 7.2536L14.2489 6.60748C11.2705 5.36607 7.8497 6.77418 6.60828 9.75259L7.25441 10.0219L7.90053 10.2912C8.84447 8.02648 11.4456 6.95578 13.7103 7.89972L13.9796 7.2536ZM6.90398 8.63661L6.22535 8.80828L6.57578 10.1936L7.25441 10.0219L7.93303 9.85022L7.5826 8.46495L6.90398 8.63661ZM7.25441 10.0219L7.42687 10.7003L8.81254 10.3481L8.64008 9.66965L8.46762 8.99122L7.08195 9.34347L7.25441 10.0219ZM8.36511 15.6389L7.87011 16.1339C8.39477 16.6586 9.02823 17.091 9.75339 17.3932L10.0227 16.7471L10.292 16.101C9.73851 15.8703 9.25773 15.5416 8.8601 15.144L8.36511 15.6389ZM7.24793 13.965H7.94793V13.9593H7.24793H6.54793V13.965H7.24793ZM6.85938 11.9994H7.55937V11.9937H6.85938H6.15938V11.9994H6.85938ZM12.002 9.14259H11.302V11.9937H12.002H12.702V9.14259H12.002ZM12.002 11.9937L11.5061 12.4878L13.2203 14.2078L13.7161 13.7136L14.212 13.2195L12.4978 11.4995L12.002 11.9937Z" fill="#8100E4" />
                                                </svg>
                                                <p className="text-[11px]">Revertidas</p>
                                            </div>
                                            <p className="text-[16px] font-bold mt-1">{formatNumberPtAO(operationalData?.states?.reverted || 0)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="w-full ring-1 ring-zinc-200 rounded-lg p-5">
                        <ChartTransationChart
                            data={operationalData}
                            isLoading={isLoadingOperational}
                            statusFilter={effectiveStatus}
                            onStatusFilterChange={setStatusFilter}
                            statusOverrideActive={statusOverrideActive}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
