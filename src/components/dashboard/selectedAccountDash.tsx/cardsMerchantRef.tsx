import { HandCoins, Landmark } from "lucide-react"


// import { useQuery } from "@tanstack/react-query"
// import { endOfDay, format, startOfDay } from "date-fns"
import { DashboardGPOCards } from "./cardsMerchantGPO"
import type { DashboardPaymentsResponse } from "@/pages/visaoGeral"

import {

    ReceiptText,
} from "lucide-react";


export type METADATA = {
    applied_filters: {
        current_user_profile: string
        aggregate_by_entities: string
        date_range: {
            start_date: string
            end_date: string
        }
        status: string
        nextCursor: number
        PerPage: number
    }
    total: number
    total_perPage: number
}

type props = {
    typePayment: "REFERENCE" | "GPO",
    cardsData: DashboardPaymentsResponse | undefined,
    isLoadingDash: boolean
}

export function CardsEmpresa({ typePayment, cardsData, isLoadingDash }: props) {

    // -----------------------------------------
    // SKELETON
    // -----------------------------------------
    const isLoading = isLoadingDash

    if (isLoading) {
        return (
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="relative p-3 ring-1 ring-[#EEEEEE] rounded-lg flex space-x-3 items-start animate-pulse"
                    >
                        <div className="w-10 h-10 rounded-full bg-zinc-200 shrink-0" />

                        <div className="space-y-2 min-w-0 flex-1">
                            <div className="h-3 w-28 bg-zinc-200 rounded" />
                            <div className="h-5 w-24 bg-zinc-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Resposta da API
    const dataDash = cardsData?.sector;

    // Formatação dos valores monetários
    const formatCurrency = (value: number) =>
        `${Number(value ?? 0).toLocaleString("pt-PT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} Kz`;

    // Cards de referências
const referenceCards = [
    {
        title: "Referências Geradas",
        value: (dataDash?.total_referencias_geradas ?? 0).toLocaleString("pt-PT"),
        icon: <Landmark />,
        border: "border-l-[#327FE4]",
        bg: "bg-[#327FE429]",
        color: "text-[#327FE4]",
        colorBorder: "#327FE4"
    },
    {
        title: "Referências Geradas Hoje",
        value: (dataDash?.total_referencias_geradas_hoje ?? 0).toLocaleString("pt-PT"),
        icon: <Landmark />,
        border: "border-l-[#F95563]",
        bg: "bg-[#FF6D7A29]",
        color: "text-[#F95563]",
        colorBorder: "#F95563"
    },
    {
        title: "Valor dos Pagamentos do Dia",
        value: formatCurrency(dataDash?.total_pagamentos_dia ?? 0),
        icon: <HandCoins />,
        border: "border-l-[#51CB8A]",
        bg: "bg-[#51CB8A29]",
        color: "text-[#36A96D]",
        colorBorder: "#36A96D"
    },
    {
        title: "Quantidade de Pagamentos do Dia",
        value: (dataDash?.quantidade_pagamentos_dia ?? 0).toLocaleString("pt-PT"),
        icon: <ReceiptText />,
        border: "border-l-[#9061F9]",
        bg: "bg-[#9061F929]",
        color: "text-[#9061F9]",
        colorBorder: "#9061F9"
    },
    {
        title: "Valor dos Pagamentos Mensais",
        value: formatCurrency(dataDash?.total_pagamentos_mensal ?? 0),
        icon: <HandCoins />,
        border: "border-l-[#E9A23B]",
        bg: "bg-[#E9A23B29]",
        color: "text-[#D18A20]",
        colorBorder: "#D18A20"
    },
    {
        title: "Quantidade de Pagamentos Mensais",
        value: (dataDash?.quantidade_pagamentos_mensal ?? 0).toLocaleString("pt-PT"),
        icon: <ReceiptText />,
        border: "border-l-[#16A6A1]",
        bg: "bg-[#16A6A129]",
        color: "text-[#16A6A1]",
        colorBorder: "#16A6A1"
    },
];

    return (<>
        {typePayment === "REFERENCE" ?

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 mt-2">
                {referenceCards.map((card) => (
                    <div
                        key={card.title}
                        style={{
        "--card-border-color": card.colorBorder,
    } as React.CSSProperties}
                        className={`flex flex-col rounded-[6px] border-l-[8px] ${card.border} ring-[0.2px] ring-[var(--card-border-color)] bg-white p-3 min-w-0`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div
                                className={`h-9 w-9 rounded-full flex justify-center items-center ${card.bg} ${card.color} shrink-0`}
                            >
                                {card.icon}
                            </div>

                            <span className="text-[#1D5298] font-semibold text-sm">
                                {card.title}
                            </span>
                        </div>

                        <span className="text-[#2D3339] font-medium text-sm md:text-base text-right">
                            {card.value}
                        </span>
                    </div>
                ))}
            </div>

            :
            <DashboardGPOCards cardsData={cardsData} isLoadingDash={isLoadingDash}/>
        }

    </>
    )
}