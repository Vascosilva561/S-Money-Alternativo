import { filterOptions, type FilterOption } from "@/pages/dashboard";
import CardIntegracao from "./cardsUtilizadoresServicosIntegracao/cardIntegracao";
import CardServicos from "./cardsUtilizadoresServicosIntegracao/cardServicos";
import CardUtilizadores from "./cardsUtilizadoresServicosIntegracao/cardUtilizadores";
import { useMemo, useState } from "react";
import { getDateRange } from "../utils/rangeDate";
import { api } from "@/api";
import type { DashboardUsersServicesResponse } from "@/types/dashUsersServices";
import { useQuery } from "@tanstack/react-query";
import type { GlobalFilters } from "@/types/globalFilters";
import { DateRangePicker } from "../ui/datepicker-range";


type Props = {
    globalFilters: GlobalFilters;
};

export const RANKING_OPTIONS = [
    { key: "count", label: "Quantidade" },
    { key: "volume", label: "Volume financeiro" },
    { key: "unique_users", label: "Utilizadores únicos" },
    { key: "success_rate", label: "Taxa de sucesso" },
];

export default function CardUtilizadoresServicosIntegracao({ globalFilters }: Props) {
    const [activeFilter, setActiveFilter] = useState<FilterOption>("today");
    const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [rankingBy, setRankingBy] = useState<string>("count"); // novo estado

    const localDates = useMemo(
        () => getDateRange(activeFilter, customRange),
        [activeFilter, customRange]
    );

    // Se o override global está activo, usa as datas globais; senão, as locais
    const { start_date, end_date } = globalFilters.periodOverrideActive
        ? { start_date: globalFilters.start_date, end_date: globalFilters.end_date }
        : localDates;


    const dashboard_operacional
        = async (start_date: string, end_date: string, ranking_by: string) => {
            try {
                const params = new URLSearchParams({
                    start_date,
                    end_date,
                    ranking_by,
                    ...(globalFilters.transactionType !== "ALL" && { transaction_type: globalFilters.transactionType }),
                    ...(globalFilters.status !== "ALL" && { status: globalFilters.status }),
                    ...(globalFilters.accountType !== "ALL" && { account_type: globalFilters.accountType }),
                    ...(globalFilters.service !== "ALL" && { service: globalFilters.service }),
                    ...(globalFilters.channel !== "ALL" && { channel: globalFilters.channel }),
                });
                const res = await api.get(`/front/dashboard_users_services?${params.toString()}`);
                return res.data;
            } catch (error) {
                console.log(error);
            }
        };


    const { data: dataResponse, isLoading } = useQuery<DashboardUsersServicesResponse>({
        queryKey: ["dasdashboard_users_services", start_date, end_date, rankingBy, globalFilters],
        queryFn: () => dashboard_operacional(start_date, end_date, rankingBy),
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
                        <p className="text-lg font-bold">Utilizadores, serviços e integrações</p>
                        <p className="text-sm text-[#627AA0]">Crescimento, utilização dos serviços e disponibilidade das integrações.</p>
                    </div>
                    <div className="flex flex-wrap justify-between items-start gap-2 text-[#7084A4]">
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
                <div className="flex space-x-2 mt-5">
                    <div className="w-full">
                        <CardUtilizadores dataResponse={dataResponse} isLoading={isLoading} />
                    </div>
                    <div className="w-full">
                        <CardServicos
                            dataResponse={dataResponse}
                            isLoading={isLoading}
                            rankingBy={rankingBy}
                            onRankingByChange={setRankingBy}
                        />
                    </div>
                    <div className="w-full">
                        <CardIntegracao dataResponse={dataResponse} isLoading={isLoading} />
                    </div></div>
            </div>
        </div>
    )
}
