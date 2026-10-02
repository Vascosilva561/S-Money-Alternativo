import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumberPtAO } from "@/components/utils/formmat";
import type { DashboardUsersServicesResponse } from "@/types/dashUsersServices";
import { RANKING_OPTIONS } from "../cardUtilizadores";

type params = {
    dataResponse: DashboardUsersServicesResponse | undefined;
    isLoading: boolean;
    rankingBy: string;
    onRankingByChange: (value: string) => void;
};


export default function CardServicos({ dataResponse, isLoading, rankingBy, onRankingByChange }: params) {


    const services = dataResponse?.services;
    const topService = services?.items?.[0];
    // resto da lista, sem repetir o serviço já destacado no topo
    const restServices = services?.items?.slice(1) ?? [];


    return (
        <div className="flex space-x-2 w-full h-full">
            <div className="w-full ring-1 ring-zinc-200 rounded-lg p-5">
                <div className="flex items-center space-x-2">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1748_57513)">
                            <path d="M19 0H9C4.02944 0 0 4.02944 0 9V19C0 23.9706 4.02944 28 9 28H19C23.9706 28 28 23.9706 28 19V9C28 4.02944 23.9706 0 19 0Z" fill="#E2F4FE" />
                            <path d="M9 10H19H9ZM9 14H19H9ZM9 18H15H9Z" fill="black" />
                            <path d="M9 10H19M9 14H19M9 18H15" stroke="#008CE3" stroke-width="1.8" stroke-linecap="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1748_57513">
                                <rect width="28" height="28" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <p className="text-lg font-bold">Serviços mais utilizados</p>

                </div>
                <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1 w-40 mt-5">
                    <p className="text-[10px] text-[#7D8CA6]
                          duration-300 ">Tipo</p>
                    <Select value={rankingBy} onValueChange={onRankingByChange}>
                        <SelectTrigger className="h-6 border-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {RANKING_OPTIONS.map((option) => (
                                <SelectItem key={option.key} value={option.key}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mt-5 text-[#143163] h-[300px] overflow-auto">
                    {isLoading ? (
                        <>
                            {/* Skeleton: serviço em destaque */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4 animate-pulse">
                                <div className="flex space-x-2">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 bg-zinc-200 rounded" />
                                        <div className="h-5 w-40 bg-zinc-200 rounded" />
                                    </div>
                                </div>
                                <div className="h-5 w-10 bg-zinc-200 rounded" />
                            </div>

                            {/* Skeleton: cabeçalho da tabela */}
                            <div className="mt-5 flex justify-between pb-2">
                                <div className="h-3 w-14 bg-zinc-200 rounded" />
                                <div className="flex space-x-4">
                                    <div className="h-3 w-16 bg-zinc-200 rounded" />
                                    <div className="h-3 w-16 bg-zinc-200 rounded" />
                                </div>
                            </div>

                            {/* Skeleton: linhas da lista */}
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center pb-3 animate-pulse">
                                    <div className="flex space-x-2 items-center">
                                        <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0" />
                                        <div className="h-3 w-24 bg-zinc-200 rounded" />
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="h-3 w-10 bg-zinc-200 rounded" />
                                        <div className="h-3 w-10 bg-zinc-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* Serviço em destaque (o primeiro/mais usado) */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4">
                                <div className="flex space-x-2">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="40" height="40" rx="8" fill="#0085FF" />
                                        <path d="M23.0562 16.0411L21.2742 12.4598C20.7494 11.4053 19.2506 11.4053 18.7258 12.4598L16.9438 16.0411L12.9735 16.6134C11.7999 16.7825 11.3339 18.2331 12.1879 19.0588L15.0498 21.8257L14.3727 25.7413C14.1711 26.9071 15.3866 27.8002 16.4325 27.2548L20 25.3946L23.5675 27.2548C24.6134 27.8002 25.8289 26.9071 25.6273 25.7413L24.9502 21.8257L27.8121 19.0588C28.6661 18.2331 28.2001 16.7825 27.0265 16.6134L23.0562 16.0411Z" fill="white" />
                                    </svg>
                                    <div>
                                        <p className="text-[11px] text-[#7D8CA6]">
                                            Serviço nº 1 • {formatNumberPtAO(topService?.percent ?? 0, 0)}% das operações
                                        </p>
                                        <p className="font-bold text-lg break-words">
                                            {topService?.name ?? "—"} <b className="text-[#0085FF]">•</b> {formatNumberPtAO(topService?.count ?? 0)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">{formatNumberPtAO(topService?.percent ?? 0, 0)}%</p>
                            </div>

                            <div className="mt-5 text-[11px] flex justify-between pb-2 font-semibold">
                                <p>Serviço</p>
                                <div className="flex space-x-2">
                                    <p>Transações</p>
                                    <p>Percentual</p>
                                </div>
                            </div>

                            {restServices.map((item, index) => (
                                <div key={item.name} className="text-[12px] flex justify-between pb-2">
                                    <div className="flex space-x-2 items-center">
                                        <p className="w-6 h-6 rounded-full p-2 bg-[#F7F9FC] text-[#7D8CA6] flex flex-col justify-center">
                                            {index + 2}
                                        </p>
                                        <p className="font-semibold">{item.name}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <p className="break-words text-[#7D8CA6]">{formatNumberPtAO(item.count)}</p>
                                        <p className="w-[60px] text-end break-words font-bold">
                                            {formatNumberPtAO(item.percent, 0)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>


        </div >
    )
}