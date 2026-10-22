
"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { GPOChartItem, SectorChartItem } from "@/types/dashboardAccounteSelected"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const chartConfig = {
    referencias_geradas: {
        label: "Referências geradas",
        color: "var(--chart-1)",
    },
    pagamentos_valor: {
        label: "Valor dos pagamentos",
        color: "var(--chart-2)",
    },
    pagamentos_quantidade: {
        label: "Quantidade de pagamentos",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

type Props = {
    chartsData: SectorChartItem[] | GPOChartItem[]
    isLoading: boolean,
    typePayment: "REFERENCE" | "GPO"
}

export function ChartBarDefault({
    chartsData,
    isLoading,
    typePayment
}: Props) {
    const [selectedMetric, setSelectedMetric] = useState<
        "referencias_geradas" | "pagamentos_valor" | "pagamentos_quantidade"
    >(typePayment === "GPO" ? "pagamentos_valor" : "referencias_geradas");

    const chartData = (chartsData ?? []).map((item) => ({
        ...item,
        date: item.date,
    }))

    const formatDate = (value: string) => {
        const [, month, day] = value.split("-")
        return `${day}/${month}`
    }

    const formatTooltipDate = (value: string) => {
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
        if (!match) return value

        const [, year, month, day] = match
        const date = new Date(Number(year), Number(month) - 1, Number(day))

        return new Intl.DateTimeFormat("pt-AO", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date)
    }

    const formatMetricValue = (value: number | string) => {
        const numericValue = Number(value)
        if (!Number.isFinite(numericValue)) return String(value)

        if (selectedMetric === "pagamentos_valor") {
            return `${new Intl.NumberFormat("pt-AO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue)} Kz`
        }

        return new Intl.NumberFormat("pt-AO", {
            maximumFractionDigits: 0,
        }).format(numericValue)
    }

    const metrics = {
        referencias_geradas: {
            label: "Referências geradas",
            color: "var(--color-referencias_geradas)",
        },
        pagamentos_valor: {
            label: "Valor dos pagamentos",
            color: "var(--color-pagamentos_valor)",
        },
        pagamentos_quantidade: {
            label: "Quantidade de pagamentos",
            color: "var(--color-pagamentos_quantidade)",
        },
    } as const;

    useEffect(() => {
        if (typePayment === "GPO" && selectedMetric === "referencias_geradas") {
            setSelectedMetric("pagamentos_valor");
        }
    }, [typePayment, selectedMetric]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="h-5 w-48 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-64 rounded bg-muted animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] rounded bg-muted/50 animate-pulse" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Estatísticas de {typePayment === "REFERENCE"?"Referências":typePayment}</CardTitle>

                    <CardDescription>
                        {chartsData.length > 0
                            ? `${formatDate(chartsData[0].date)} - ${formatDate(
                                chartsData[chartsData.length - 1].date
                            )}`
                            : "Sem dados disponíveis"}
                    </CardDescription>
                </div>

                <div className="w-full min-w-0 sm:w-[220px] sm:flex-none">
                    <Select
                        value={selectedMetric}
                        onValueChange={(value) =>
                            setSelectedMetric(value as keyof typeof metrics)
                        }
                    >
                        <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Selecionar métrica" />
                        </SelectTrigger>

                        <SelectContent>
                            {typePayment === "REFERENCE" && (
                                <SelectItem value="referencias_geradas">
                                    Referências geradas
                                </SelectItem>
                            )}

                            <SelectItem value="pagamentos_valor">
                                Valor dos pagamentos
                            </SelectItem>

                            <SelectItem value="pagamentos_quantidade">
                                Quantidade de pagamentos
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-[300px] min-h-0 aspect-auto "
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={formatDate}
                            minTickGap={20}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    className="!min-w-[14rem] !gap-2 !rounded-xl !border-slate-200 !bg-white !px-4 !py-3 !shadow-lg"
                                    labelClassName="!text-xs !font-semibold !text-[#143163]"
                                    labelFormatter={(value: string) => formatTooltipDate(value)}
                                    formatter={(value: number | string) => (
                                        <div className="flex w-full items-center justify-between gap-5">
                                            <span className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{ backgroundColor: metrics[selectedMetric].color }}
                                                />
                                                {metrics[selectedMetric].label}
                                            </span>
                                            <span className="shrink-0 text-sm font-bold tabular-nums text-[#143163]">
                                                {formatMetricValue(value)}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />

                        <Bar
                            dataKey={selectedMetric}
                            fill={metrics[selectedMetric].color}
                            radius={4}
                            maxBarSize={99}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground">
                Evolução diária das referências e dos pagamentos.
            </CardFooter>
        </Card>
    )
}
