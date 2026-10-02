"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, } from "recharts"

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
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
    { month: "January", desktop: 18 },
    { month: "February", desktop: 19 },
    { month: "March", desktop: 23 },
    { month: "April", desktop: 30 },
    { month: "May", desktop: 15 },
    { month: "June", desktop: 21 },
    { month: "March", desktop: 23 },
    { month: "April", desktop: 7 },
    { month: "May", desktop: 15 },
    { month: "June", desktop: 21 },
]
const chartConfig = {
    desktop: {
        label: "Desktop",
        gradient: {
            id: "desktopGradient",
            colors: [
                { offset: "0%", color: "#17CFDA" },   // início
                { offset: "100%", color: "#008CE3" }, // fim
            ],
        },
    },
} satisfies Record<string, {
    label: string;
    gradient: { id: string; colors: { offset: string; color: string }[] };
}>;

export function ChartBarDefault() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        {/* Definição dos gradientes */}
                        <defs>
                            {Object.entries(chartConfig).map(([key, config]) => (
                                <linearGradient
                                    key={key}
                                    id={config.gradient.id}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    {config.gradient.colors.map((stop, i) => (
                                        <stop
                                            key={i}
                                            offset={stop.offset}
                                            stopColor={stop.color}
                                        />
                                    ))}
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value: any) => value.slice(0, 3)}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        {/* Aplicando o gradiente */}
                        <Bar
                            dataKey="desktop"
                            fill={`url(#${chartConfig.desktop.gradient.id})`}
                            radius={15}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
