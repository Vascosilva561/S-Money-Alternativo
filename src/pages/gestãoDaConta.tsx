// import { ChartBarDefault } from "@/components/dashboard/transacoesChart";
import { api } from "@/api";
import { getDateRange } from "@/components/utils/rangeDate";
import type { DashboardPrincipalResponse } from "@/types/dashPrincipal";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
    CreditCard,
    CircleCheck,
    Clock3,
    CircleX,
    User,
    Mail,
    Phone,
    ShieldCheck,
} from "lucide-react";
import { useSelectedAccount } from "@/context/selectedAccountCntext";

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

export default function GestaoDaConta() {

    const [activeFilter, _setActiveFilter] = useState<FilterOption>("today");
    const [customRange, _setCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
    const [periodOverrideActive, _setPeriodOverrideActive] = useState(false); // novo
    const { account: selectedAccount } = useSelectedAccount();

    const [transaction_type, _setTransactionType] = useState("ALL");
    const [status, _setStatus] = useState("ALL");
    const [account_type, _setAccountType] = useState("ALL");
    const [service, _setService] = useState("ALL");
    const [channel, _setChannel] = useState("ALL");

    // Estado LOCAL da seção de KPIs (separado do global)
    const [kpiActiveFilter, _setKpiActiveFilter] = useState<FilterOption>("today");
    const [kpiCustomRange, _setKpiCustomRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

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
    }

    useQuery<DashboardPrincipalResponse>({
        queryKey: ["dashboard-principal", kpiEffectiveDates, transaction_type, status, account_type, service, channel],
        queryFn: dashboard_principal,
        enabled: !!kpiEffectiveDates.start_date && !!kpiEffectiveDates.end_date,
    });


    return (
        <>
            <div className="flex flex-col space-y-4">
                <section className="bg-white rounded-lg text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE]">
                        <div>
                            <p className="font-bold text-xl text-[#143163]">
                                Dados pessoais da conta
                            </p>

                            <p className="text-[#627AA0] mt-1">
                                Informações principais do utilizador desta conta.
                            </p>
                        </div>
                        <div>
                            <button className="flex items-center space-x-1 font-semibold roundedtext-[#143163] bg-[#EAF6F8] ring-1 
                            ring-[#ADCBD0] pr-4 px-4 h-8 duration-300 cursor-pointer hover:bg-[#17CFDA] hover:ring-[#17CFDA] 
                            rounded-[5px]">
                                <p>Editar conta</p>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_18_17646)">
                                        <path d="M8.25006 3H3.00006C2.60224 3 2.22071 3.15804 1.9394 3.43934C1.6581 3.72064 1.50006 4.10218 1.50006 4.5V15C1.50006 15.3978 1.6581 15.7794 1.9394 16.0607C2.22071 16.342 2.60224 16.5 3.00006 16.5H13.5001C13.8979 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15.0001 15.3978 15.0001 15V9.75" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.8751 1.87615C14.1734 1.57778 14.5781 1.41016 15.0001 1.41016C15.422 1.41016 15.8267 1.57778 16.1251 1.87615C16.4234 2.17452 16.5911 2.57919 16.5911 3.00115C16.5911 3.4231 16.4234 3.82778 16.1251 4.12615L9.00006 11.2511L6.00006 12.0011L6.75006 9.00115L13.8751 1.87615Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_18_17646">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>

                        {/* Estado da conta */}
                        <div>
                            {selectedAccount?.status === "ACTIVO" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    <CircleCheck className="w-3.5 h-3.5" />
                                    Activa
                                </span>
                            )}

                            {selectedAccount?.status === "PENDENTE" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                    <Clock3 className="w-3.5 h-3.5" />
                                    Pendente
                                </span>
                            )}

                            {selectedAccount?.status === "INACTIVO" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                    <CircleX className="w-3.5 h-3.5" />
                                    Inactiva
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Dados */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6">

                        {/* Nome */}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#143163] flex items-center justify-center shrink-0">
                                <User className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[#7D8CA6] text-xs font-medium">
                                    Nome completo
                                </p>

                                <p className="text-[#143163] font-semibold mt-1 truncate">
                                    {selectedAccount?.name || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[#7D8CA6] text-xs font-medium">
                                    Email
                                </p>

                                <p className="text-[#143163] font-semibold mt-1 truncate">
                                    {selectedAccount?.email || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Telefone */}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[#7D8CA6] text-xs font-medium">
                                    Telefone
                                </p>

                                <p className="text-[#143163] font-semibold mt-1">
                                    {selectedAccount?.telefone || "—"}
                                </p>
                            </div>
                        </div>

                        {/* BI */}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <CreditCard className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[#7D8CA6] text-xs font-medium">
                                    Nº de BI
                                </p>

                                <p className="text-[#143163] font-semibold mt-1">
                                    {selectedAccount?.bi_number || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Tipo de conta */}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[#7D8CA6] text-xs font-medium">
                                    Tipo de conta
                                </p>

                                <p className="text-[#143163] font-semibold mt-1">
                                    {selectedAccount?.role || "Cliente"}
                                </p>
                            </div>
                        </div>


                    </div>
                </section>

            </div>
        </>
    )
}