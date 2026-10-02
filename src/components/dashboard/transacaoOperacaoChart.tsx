"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { DashboardOperationalResponse } from "@/types/dashOperational"
import { formatChange, formatNumberPtAO } from "../utils/formmat"
import { useNavigate } from "react-router"
import { STATUS_OPTIONS } from "@/pages/dashboard"

export const description = "An interactive area chart"

const chartConfig = {
    value: {
        label: "Transacções",
        color: "#2678F2",
    },
} satisfies ChartConfig

type Params = {
    data: DashboardOperationalResponse | undefined;
    isLoading?: boolean;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    statusOverrideActive: boolean;
};

export function ChartTransationChart({ data, isLoading, statusFilter, onStatusFilterChange, statusOverrideActive }: Params) {

    // Transforma os pontos da API pro formato do recharts
    const chartData = React.useMemo(() => {
        return data?.hourly?.points?.map((point) => ({
            hour: point.hour,
            value: point.value,
        })) ?? []
    }, [data])

    const navigate = useNavigate()

function goToFilteredList(status: string) {
    const params = new URLSearchParams({ status });
    navigate(`/movimentos?${params.toString()}`);
}
    return (
        <Card className="pt-0">
            <CardHeader className="space-y-0 border-b p-1 pt-2 pb-8">
                <div className="text-[#143163]">
                    <p className="font-bold text-lg">Transacções por hora</p>
                    <CardDescription className="text-[#143163] flex items-end space-x-2 pb-4 mt-4">
                        <p className="font-bold text-lg">
                            {isLoading ? "..." : formatNumberPtAO(data?.hourly?.total ?? 0)}
                        </p>
                        <p className="text-[11px] text-[#0D9339] font-semibold">
                            {isLoading ? "" : formatChange(data?.hourly?.change ?? null)}
                        </p>
                    </CardDescription>
                </div>
                <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1 w-30">
                    <p className="text-[10px] text-[#7D8CA6] duration-300">Estado</p>
                    <Select
                        disabled={statusOverrideActive}
                        value={statusFilter}
                        onValueChange={onStatusFilterChange}>
                        <SelectTrigger className="border-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.key} value={option.key}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                    {statusOverrideActive && (
                        <p className="text-[11px] text-[#7D8CA6] mt-1">
                            Estado controlado pelo filtro global
                        </p>
                    )}
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[150px] w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a1c8ed" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#cbdff2" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value: string) => `Transacções ${value}`}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="value"
                            type="natural"
                            fill="url(#fillValue)"
                            stroke="var(--color-value)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
                <button
                type="button"
                onClick={()=>goToFilteredList("SUCCESS")}
                className="flex items-center text-[#2678F2] cursor-pointer text-[11px] mt-2 hover:underline w-fit">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 10H15M11 14L15 10L11 6" stroke="#2678F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>Ver transacções bem sucedidas</p>
                </button>
            </CardContent>
        </Card>
    )
}