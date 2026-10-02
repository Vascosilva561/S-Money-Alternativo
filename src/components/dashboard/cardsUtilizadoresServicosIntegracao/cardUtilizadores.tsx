import { formatNumberPtAO } from "@/components/utils/formmat";
import type { DashboardUsersServicesResponse } from "@/types/dashUsersServices"
import { useNavigate } from "react-router";


type params = {
    dataResponse: DashboardUsersServicesResponse | undefined,
    isLoading: boolean
}

export default function CardUtilizadores({ dataResponse, isLoading }: params) {

    const users = dataResponse?.users;

    const navigate = useNavigate()

    return (
        <div className="flex space-x-2 w-full h-full">
            <div className="w-full ring-1 ring-zinc-200 rounded-lg p-5">
                <div className="flex items-center space-x-2">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1748_57437)">
                            <path d="M19 0H9C4.02944 0 0 4.02944 0 9V19C0 23.9706 4.02944 28 9 28H19C23.9706 28 28 23.9706 28 19V9C28 4.02944 23.9706 0 19 0Z" fill="#E2F4FE" />
                            <path d="M14.0031 14.3002C15.8257 14.3002 17.3031 12.8227 17.3031 11.0002C17.3031 9.17766 15.8257 7.7002 14.0031 7.7002C12.1806 7.7002 10.7031 9.17766 10.7031 11.0002C10.7031 12.8227 12.1806 14.3002 14.0031 14.3002Z" stroke="#008CE3" stroke-width="1.8" />
                            <path d="M7.5 21.0002C8.3 17.8002 10.6 16.2002 14 16.2002C17.4 16.2002 19.7 17.8002 20.5 21.0002" stroke="#008CE3" stroke-width="1.8" stroke-linecap="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1748_57437">
                                <rect width="28" height="28" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <p className="text-lg font-bold">Utilizadores</p>

                </div>
                <div className="mt-5">
                    {isLoading ? (
                        <>
                            {/* Skeleton: Total de utilizadores */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4 animate-pulse">
                                <div className="flex items-start space-x-2">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 shrink-0" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-28 bg-zinc-200 rounded" />
                                        <div className="h-5 w-20 bg-zinc-200 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-12 bg-zinc-200 rounded ml-auto" />
                                    <div className="h-3 w-24 bg-zinc-200 rounded" />
                                </div>
                            </div>

                            {/* Skeleton: grid de 6 blocos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="w-full bg-[#F7FAFC] p-2 rounded-lg py-4 animate-pulse">
                                        <div className="flex justify-between items-center">
                                            <div className="h-3 w-24 bg-zinc-200 rounded" />
                                            <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0" />
                                        </div>
                                        <div className="h-4 w-16 bg-zinc-200 rounded mt-2" />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Total de utilizadores */}
                            <div className="flex justify-between items-center w-full bg-[#F6F8FB] p-2 rounded-lg py-4">
                                <div className="flex items-start space-x-2">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="40" height="40" rx="8" fill="#0085FF" />
                                        <path d="M16.0625 16.4375C16.0625 14.2629 17.8254 12.5 20 12.5C22.1746 12.5 23.9375 14.2629 23.9375 16.4375C23.9375 18.6121 22.1746 20.375 20 20.375C17.8254 20.375 16.0625 18.6121 16.0625 16.4375Z" fill="white" />
                                        <path d="M17.8571 21.5C15.3127 21.5 13.25 23.5627 13.25 26.1071C13.25 26.8764 13.8736 27.5 14.6429 27.5H25.3571C26.1264 27.5 26.75 26.8764 26.75 26.1071C26.75 23.5627 24.6873 21.5 22.1429 21.5H17.8571Z" fill="white" />
                                    </svg>
                                    <div>
                                        <p className="text-[11px] text-[#7D8CA6]">Total de utilizadores</p>
                                        <p className="font-bold text-lg">{formatNumberPtAO(users?.total?.value ?? 0)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[16px] text-end font-bold text-[#16A34A]">
                                        {users?.total?.change != null
                                            ? `${users.total.change >= 0 ? "+" : ""}${formatNumberPtAO(users.total.change, 1)}%`
                                            : "—"}
                                    </p>
                                    <p className="text-lg text-[11px] text-[#7D8CA6]">vs. período anterior</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2">
                                {/* Novos registos */}
                                <div className="w-full bg-[#EDFAFF] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">Novos registos</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#BDE7FF" />
                                                <path d="M12.734 13.6788C12.6468 13.6708 12.5585 13.6667 12.4692 13.6667H9.29464C7.71669 13.6667 6.4375 14.9459 6.4375 16.5238C6.4375 16.7868 6.6507 17 6.91369 17H12.7479M15.8819 13.6667V15.3333M15.8819 15.3333V17M15.8819 15.3333H14.2153M15.8819 15.3333H17.5486M13.2431 9.36111C13.2431 10.6651 12.186 11.7222 10.8819 11.7222C9.57794 11.7222 8.52083 10.6651 8.52083 9.36111C8.52083 8.05711 9.57794 7 10.8819 7C12.186 7 13.2431 8.05711 13.2431 9.36111Z" stroke="#0085FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-bold">{formatNumberPtAO(users?.new?.value ?? 0)}</p>
                                    </div>
                                </div>

                                {/* Contas bloqueadas */}
                                <div className="w-full bg-[#FFF2F2] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">Contas bloqueadas</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#FEE2E2" />
                                                <path d="M11.2221 13.6667H9.30246C7.7245 13.6667 6.44531 14.9459 6.44531 16.5238C6.44531 16.7868 6.65851 17 6.9215 17H11.2221M13.7786 13.7778L16.8898 16.8889M13.2509 9.36111C13.2509 10.6651 12.1938 11.7222 10.8898 11.7222C9.58575 11.7222 8.52865 10.6651 8.52865 9.36111C8.52865 8.05711 9.58575 7 10.8898 7C12.1938 7 13.2509 8.05711 13.2509 9.36111ZM17.5564 15.3333C17.5564 16.5606 16.5615 17.5556 15.3342 17.5556C14.1069 17.5556 13.112 16.5606 13.112 15.3333C13.112 14.106 14.1069 13.1111 15.3342 13.1111C16.5615 13.1111 17.5564 14.106 17.5564 15.3333Z" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-bold">{formatNumberPtAO(users?.blocked ?? 0)}</p>
                                    </div>
                                </div>

                                {/* Activos nos últimos 7 dias */}
                                <div className="w-full bg-[#EDFAF2] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">Activos</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#C5EDD3" />
                                                <path d="M13.0876 14.3523C13.4064 14.4428 13.7382 14.2578 13.8288 13.9391C13.9193 13.6203 13.7343 13.2885 13.4156 13.1979L13.2516 13.7751L13.0876 14.3523ZM12.0109 17.6C12.3423 17.6 12.6109 17.3314 12.6109 17C12.6109 16.6686 12.3423 16.4 12.0109 16.4V17V17.6ZM14.3618 15.4646C14.1275 15.2303 13.7476 15.2303 13.5132 15.4646C13.2789 15.6989 13.2789 16.0788 13.5132 16.3132L13.9375 15.8889L14.3618 15.4646ZM15.0486 17L14.6243 17.4243C14.8587 17.6586 15.2386 17.6586 15.4729 17.4243L15.0486 17ZM17.9729 14.9243C18.2072 14.6899 18.2072 14.3101 17.9729 14.0757C17.7386 13.8414 17.3587 13.8414 17.1243 14.0757L17.5486 14.5L17.9729 14.9243ZM9.29464 13.6667V14.2667H12.4692V13.6667V13.0667H9.29464V13.6667ZM6.91369 17V16.4C6.98207 16.4 7.0375 16.4554 7.0375 16.5238H6.4375H5.8375C5.8375 17.1182 6.31933 17.6 6.91369 17.6V17ZM9.29464 13.6667V13.0667C7.38532 13.0667 5.8375 14.6145 5.8375 16.5238H6.4375H7.0375C7.0375 15.2772 8.04806 14.2667 9.29464 14.2667V13.6667ZM13.2431 9.36111H12.6431C12.6431 10.3337 11.8546 11.1222 10.8819 11.1222V11.7222V12.3222C12.5173 12.3222 13.8431 10.9965 13.8431 9.36111H13.2431ZM10.8819 11.7222V11.1222C9.90931 11.1222 9.12083 10.3337 9.12083 9.36111H8.52083H7.92083C7.92083 10.9965 9.24657 12.3222 10.8819 12.3222V11.7222ZM8.52083 9.36111H9.12083C9.12083 8.38848 9.90931 7.6 10.8819 7.6V7V6.4C9.24657 6.4 7.92083 7.72573 7.92083 9.36111H8.52083ZM10.8819 7V7.6C11.8546 7.6 12.6431 8.38848 12.6431 9.36111H13.2431H13.8431C13.8431 7.72573 12.5173 6.4 10.8819 6.4V7ZM12.4692 13.6667V14.2667C12.6845 14.2667 12.8918 14.2966 13.0876 14.3523L13.2516 13.7751L13.4156 13.1979C13.1141 13.1123 12.7965 13.0667 12.4692 13.0667V13.6667ZM12.0109 17V16.4H6.91369V17V17.6H12.0109V17ZM13.9375 15.8889L13.5132 16.3132L14.6243 17.4243L15.0486 17L15.4729 16.5757L14.3618 15.4646L13.9375 15.8889ZM15.0486 17L15.4729 17.4243L17.9729 14.9243L17.5486 14.5L17.1243 14.0757L14.6243 16.5757L15.0486 17Z" fill="#16A34A" />
                                            </svg>
                                        </div>
                                        <p className="font-bold">{formatNumberPtAO(users?.active ?? 0)}</p>
                                    </div>
                                </div>

                                {/* KYC */}
                                <div className="w-full bg-[#FFF6E4] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">KYC</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#FFE8C2" />
                                                <path d="M11.9982 10.6664V12.4442M11.9983 14.222V14.2264M8.89003 15.9978H15.1063C16.1352 15.9978 16.7764 14.8818 16.2582 13.9929L13.1501 8.66178C12.6356 7.77941 11.3608 7.7794 10.8463 8.66178L7.73817 13.9929C7.21993 14.8818 7.86111 15.9978 8.89003 15.9978ZM12.1094 14.222C12.1094 14.2834 12.0596 14.3331 11.9983 14.3331C11.9369 14.3331 11.8872 14.2834 11.8872 14.222C11.8872 14.1606 11.9369 14.1109 11.9983 14.1109C12.0596 14.1109 12.1094 14.1606 12.1094 14.222Z" stroke="#E49500" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="flex justify-between space-x-4">
                                            <p className="font-bold text-[11px] text-[#DA8900]">•{formatNumberPtAO(users?.kyc?.pending ?? 0)} pendentes</p>
                                            <p className="font-bold text-[11px] text-[#E53935]">•{formatNumberPtAO(users?.kyc?.rejected ?? 0)} rejeitadas</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Particulares */}
                                <div className="w-full bg-[#9540EF1A] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">Particulares</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#8009FF" fillOpacity="0.1" />
                                                <path d="M7.55469 16.5238C7.55469 14.9459 8.83387 13.6667 10.4118 13.6667H13.5864C15.1644 13.6667 16.4436 14.9459 16.4436 16.5238C16.4436 16.7868 16.2304 17 15.9674 17H8.03088C7.76788 17 7.55469 16.7868 7.55469 16.5238Z" stroke="#9747FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14.3602 9.36111C14.3602 10.6651 13.3031 11.7222 11.9991 11.7222C10.6951 11.7222 9.63802 10.6651 9.63802 9.36111C9.63802 8.05711 10.6951 7 11.9991 7C13.3031 7 14.3602 8.05711 14.3602 9.36111Z" stroke="#9747FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-bold">{formatNumberPtAO(users?.individuals ?? 0)}</p>
                                    </div>
                                </div>

                                {/* Empresas */}
                                <div className="w-full bg-[#EFEFEF] p-2 rounded-lg py-4">
                                    <div className="flex flex-col space-x-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-[#143163]">Empresas</p>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9967 22.2853C17.6773 22.2853 22.2824 17.6802 22.2824 11.9996C22.2824 6.31894 17.6773 1.71387 11.9967 1.71387C6.31601 1.71387 1.71094 6.31894 1.71094 11.9996C1.71094 17.6802 6.31601 22.2853 11.9967 22.2853Z" fill="#D9D9D9" />
                                                <path d="M15.888 17H16.4436H7.55469H8.11024M15.888 17H8.11024M15.888 17V8.66667C15.888 7.74619 15.1418 7 14.2214 7H9.77691C8.85644 7 8.11024 7.74619 8.11024 8.66667V17M10.888 9.22222H10.3325M10.888 11.4444H10.3325M13.6658 9.22222H13.1102M13.6658 11.4444H13.1102M13.1102 17V14.7778C13.1102 14.1641 12.6128 13.6667 11.9991 13.6667C11.3855 13.6667 10.888 14.1641 10.888 14.7778V17" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-bold">{formatNumberPtAO(users?.companies ?? 0)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center text-[#2678F2] cursor-pointer text-[11px] mt-2 hover:underline w-fit">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 10H15M11 14L15 10L11 6" stroke="#2678F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p onClick={()=>navigate("/gestao-de-utilizadores")}>Ver listagem de utilizadores</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}
