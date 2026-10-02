import { formatNumberPtAO } from "@/components/utils/formmat";
import { getStatusInfo } from "@/components/utils/statusIntegration";
import type { DashboardUsersServicesResponse } from "@/types/dashUsersServices";

type params = {
    dataResponse: DashboardUsersServicesResponse | undefined,
    isLoading: boolean
}




export default function CardIntegracao({ dataResponse, isLoading }: params) {
    const integrations = dataResponse?.integrations;

   



    return (
        <div className="flex space-x-2 w-full h-full">
            <div className="w-full ring-1 ring-zinc-200 rounded-lg p-5">
                <div className="flex items-center space-x-2">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1748_57563)">
                            <path d="M19 0H9C4.02944 0 0 4.02944 0 9V19C0 23.9706 4.02944 28 9 28H19C23.9706 28 28 23.9706 28 19V9C28 4.02944 23.9706 0 19 0Z" fill="#DCFCE7" />
                            <path d="M8 15H11L13 10L16 19L18 15H20" stroke="#16A34A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1748_57563">
                                <rect width="28" height="28" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <p className="text-lg font-bold">Saúde das integrações</p>

                </div>
                <div className="mt-5 space-y-4 flex flex-col h-[300px] overflow-auto">
                    {isLoading ? (
                        <>
                            {/* Skeleton: resumo */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4 animate-pulse">
                                <div className="flex items-start space-x-2">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 bg-zinc-200 rounded" />
                                        <div className="h-5 w-16 bg-zinc-200 rounded" />
                                    </div>
                                </div>
                                <div className="h-5 w-14 bg-zinc-200 rounded" />
                            </div>

                            {/* Skeleton: lista de integrações */}
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-[1fr_100px_60px_60px] items-center pb-3 gap-2 animate-pulse">
                                    <div className="flex space-x-2 items-center">
                                        <div className="w-[18px] h-[18px] rounded-full bg-zinc-200 shrink-0" />
                                        <div className="h-3 w-20 bg-zinc-200 rounded" />
                                    </div>
                                    <div className="h-3 w-14 bg-zinc-200 rounded" />
                                    <div className="h-3 w-10 bg-zinc-200 rounded ml-auto" />
                                    <div className="h-3 w-10 bg-zinc-200 rounded ml-auto" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* Resumo */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4 ">
                                <div className="flex items-start space-x-2">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="40" height="40" rx="8" fill="#16A34A" />
                                        <path d="M15.125 17C14.0895 17 13.25 16.1605 13.25 15.125C13.25 14.0895 14.0895 13.25 15.125 13.25C16.1605 13.25 17 14.0895 17 15.125C17 16.1605 16.1605 17 15.125 17ZM15.125 17V17.75C15.125 18.9926 16.1324 20 17.375 20H20M20 23C21.0355 23 21.875 23.8395 21.875 24.875C21.875 25.9105 21.0355 26.75 20 26.75C18.9645 26.75 18.125 25.9105 18.125 24.875C18.125 23.8395 18.9645 23 20 23ZM20 23V20M24.875 17C23.8395 17 23 16.1605 23 15.125C23 14.0895 23.8395 13.25 24.875 13.25C25.9105 13.25 26.75 14.0895 26.75 15.125C26.75 16.1605 25.9105 17 24.875 17ZM24.875 17V17.75C24.875 18.9926 23.8676 20 22.625 20H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-[#7D8CA6]">Integrações operacionais</p>
                                        <p className="font-bold text-lg">
                                            {integrations?.operational ?? 0} de {integrations?.total ?? 0}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">
                                    {formatNumberPtAO(integrations?.operational_rate ?? 0, 1)}%
                                </p>
                            </div>

                            {/* Lista de integrações */}
                            {integrations?.items?.map((item, key) => {
                                const status = getStatusInfo(item?.status);

                                return (
                                    <div
                                        key={key}
                                        className="text-[12px] grid grid-cols-[1fr_100px_60px_60px] items-center pb-3 gap-2"
                                    >
                                        <div className="flex space-x-2 items-center">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.00335 16.7147C13.2638 16.7147 16.7176 13.2609 16.7176 9.00042C16.7176 4.73994 13.2638 1.28613 9.00335 1.28613C4.74287 1.28613 1.28906 4.73994 1.28906 9.00042C1.28906 13.2609 4.74287 16.7147 9.00335 16.7147Z" fill="#F2F2F2" />
                                                <path d="M6.29167 7.33333C5.71637 7.33333 5.25 6.86696 5.25 6.29167C5.25 5.71637 5.71637 5.25 6.29167 5.25C6.86696 5.25 7.33333 5.71637 7.33333 6.29167C7.33333 6.86696 6.86696 7.33333 6.29167 7.33333ZM6.29167 7.33333V7.75C6.29167 8.44036 6.85131 9 7.54167 9H9M9 10.6667C9.5753 10.6667 10.0417 11.133 10.0417 11.7083C10.0417 12.2836 9.5753 12.75 9 12.75C8.4247 12.75 7.95833 12.2836 7.95833 11.7083C7.95833 11.133 8.4247 10.6667 9 10.6667ZM9 10.6667V9M11.7083 7.33333C11.133 7.33333 10.6667 6.86696 10.6667 6.29167C10.6667 5.71637 11.133 5.25 11.7083 5.25C12.2836 5.25 12.75 5.71637 12.75 6.29167C12.75 6.86696 12.2836 7.33333 11.7083 7.33333ZM11.7083 7.33333V7.75C11.7083 8.44036 11.1487 9 10.4583 9H9" stroke="#143163" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="font-semibold text-[#143163] truncate">{item?.name}</p>
                                        </div>

                                        <p className="text-left font-bold truncate" style={{ color: status.color }}>
                                            {status.label}
                                        </p>

                                        <p className="text-right text-[#7D8CA6]">—</p>
                                        <p className="text-right text-[#7D8CA6]">—</p>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* <div className="flex items-center space-x-2 bg-[#F9F9F9] text-[#808080] rounded-full p-2 w-fit px-5 mt-5">
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3.5" r="3.5" fill="#808080" />
                    </svg>

                    <p>Última actualização às 08:42 AM</p>
                </div> */}

            </div>


        </div>
    )
}