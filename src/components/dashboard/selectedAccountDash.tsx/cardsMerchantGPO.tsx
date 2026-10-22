import type { DashboardPaymentsResponse } from "@/pages/visaoGeral";
import {
    Landmark,
    HandCoins,
    CalendarDays,
    ReceiptText,
} from "lucide-react";


// const toDateKey = (value?: string) => {
//   if (!value) return "";
//   return value.split("T")[0];
// };

type props = {

    cardsData: DashboardPaymentsResponse | undefined,
    isLoadingDash: boolean
}

export function DashboardGPOCards({ cardsData, isLoadingDash }: props) {
  
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

   const dataDash = cardsData?.gpo;

const formatCurrency = (value: number) =>
    `${Number(value ?? 0).toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} Kz`;

const gpoCards = [
    {
        title: "Valor dos Pagamentos do Dia",
        value: formatCurrency(dataDash?.total_pagamentos_dia ?? 0),
        icon: <Landmark />,
        border: "border-l-[#327FE4]",
        bg: "bg-[#327FE429]",
        colorBorder: "#327FE4",
        color: "text-[#327FE4]",
    },
    {
        title: "Quantidade de Pagamentos do Dia",
        value: (dataDash?.quantidade_pagamentos_dia ?? 0).toLocaleString("pt-PT"),
        icon: <HandCoins />,
        border: "border-l-[#51CB8A]",
        bg: "bg-[#51CB8A29]",
        colorBorder: "#51CB8A",
        color: "text-[#51CB8A]",
    },
    {
        title: "Valor dos Pagamentos Mensais",
        value: formatCurrency(dataDash?.total_pagamentos_mensal ?? 0),
        icon: <CalendarDays />,
        border: "border-l-[#43BCFE]",
        bg: "bg-[#43BCFE29]",
        colorBorder: "#43BCFE",
        color: "text-[#43BCFE]",
    },
    {
        title: "Quantidade de Pagamentos Mensais",
        value: (dataDash?.quantidade_pagamentos_mensal ?? 0).toLocaleString("pt-PT"),
        icon: <ReceiptText />,
        border: "border-l-[#9061F9]",
        bg: "bg-[#9061F929]",
        colorBorder: "#9061F9",
        color: "text-[#9061F9]",
    },
    {
        title: "Valor Total dos Pagamentos",
        value: formatCurrency(dataDash?.total_pagamentos_geral ?? 0),
        icon: <Landmark />,
        border: "border-l-[#E9A23B]",
        bg: "bg-[#E9A23B29]",
        colorBorder: "#D18A20",
        color: "text-[#D18A20]",
    },
    {
        title: "Quantidade Total de Pagamentos",
        value: (dataDash?.quantidade_pagamentos_geral ?? 0).toLocaleString("pt-PT"),
        icon: <HandCoins />,
        border: "border-l-[#16A6A1]",
        bg: "bg-[#16A6A129]",
        colorBorder: "#16A6A1",
        color: "text-[#16A6A1]",
    },
];


  return (
    
<div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 p-4 gap-4 mt-2">
    {gpoCards?.map((card) => (
        <div
            key={card.title}
            style={{
        "--card-border-color": card.colorBorder,
    } as React.CSSProperties}
            className={`flex flex-col rounded-[6px] border-l-[8px] ${card.border} ring-[0.2px] ring-[var(--card-border-color)] bg-white p-3 min-w-0`}
        >
            <div className="flex items-center space-x-3 mb-3">
                <div
                    className={`h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full flex justify-center items-center ${card.color} ${card.bg} shrink-0`}
                >
                    {card.icon}
                </div>

                <span className="text-[#1D5298] font-semibold text-sm md:text-base">
                    {card.title}
                </span>
            </div>

            <span className="text-[#2D3339] font-medium text-sm md:text-base text-right w-full">
                {card.value}
            </span>
        </div>
    ))}
</div>

  );
}
