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
import type { DashboardFinancialResponse } from "@/types/dashFinancial"
import { formatChange, formatNumberPtAO } from "../utils/formmat"
import { ChevronDown } from "lucide-react"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { CATEGORY_OPTIONS } from "./cardFinanceiro"

export const description = "An interactive area chart"

// const chartData = [
//   { date: "2024-04-01", desktop: 222, mobile: 1510 },
//   { date: "2024-04-02", desktop: 97, mobile: 1180 },
//   { date: "2024-04-03", desktop: 167, mobile: 1020 },
//   { date: "2024-04-04", desktop: 242, mobile: 2602 },
//   { date: "2024-04-05", desktop: 373, mobile: 2090 },
//   { date: "2024-04-06", desktop: 301, mobile: 3340 },
//   { date: "2024-04-07", desktop: 245, mobile: 1380 },

// ]

const chartConfig = {
  value: {
    label: "Volume",
    color: "#2678F2",
  },
} satisfies ChartConfig

type params = {
  dataChart: DashboardFinancialResponse | undefined;
  selectedCategories: string[];
  onToggleCategory: (key: string) => void;
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
};
const METRIC_OPTIONS = [
  { key: "transactions_count", label: "Quantidade de transações" },
  { key: "volume", label: "Volume financeiro" },
];

export function ChartAreaInteractive({
  dataChart,
  selectedCategories,
  onToggleCategory,
  selectedMetric,
  onMetricChange,
}: params) {
  // const [timeRange, setTimeRange] = React.useState("90d")

  const chartData = React.useMemo(() => {
    return dataChart?.volume?.points?.map((point) => ({
      date: point.date,
      value: point.value,
    })) ?? [];
  }, [dataChart]);

  const categoriesLabel =
    selectedCategories.length === 0
      ? "Nenhuma"
      : selectedCategories.length === CATEGORY_OPTIONS.length
        ? "Todas"
        : `${selectedCategories.length} selecionadas`;



  return (
    <Card className="pt-0 ">
      <CardHeader className=" space-y-0 border-b p-1 pt-2 pb-8">
        <div className="text-[#143163]">
          <CardDescription className="text-[#143163] flex items-end space-x-2 pb-4">
            <p className="font-bold text-lg">
              {formatNumberPtAO(dataChart?.volume?.total ?? 0, 2)} Kz
            </p>
            <p className="text-[11px] text-[#0D9339] font-semibold">
              {formatChange(dataChart?.volume?.change ?? null)}
            </p>
          </CardDescription>
        </div>
        <div className="flex space-x-2 w-100">
          {/* CATEGORIAS — multi-select via popover + checkboxes */}
          <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1 w-full text-[#143163]">
            <p className="text-[10px] text-[#7D8CA6] duration-300">CATEGORIAS</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-6 w-full flex items-center justify-between text-sm text-[#143163]"
                >
                  <span className="truncate">{categoriesLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[#7D8CA6] shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORY_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.key}
                    checked={selectedCategories.includes(option.key)}
                    onCheckedChange={() => onToggleCategory(option.key)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* MÉTRICAS — seleção única */}
          <div className="bg-white rounded-lg p-2 ring-1 ring-zinc-200 space-y-1 w-full">
            <p className="text-[10px] text-[#7D8CA6] duration-300">MÉTRICAS</p>
            <Select value={selectedMetric} onValueChange={onMetricChange}>
              <SelectTrigger className="h-6 border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRIC_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[150px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#cbdff2"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#cbdff2"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#a1c8ed"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#cbdff2"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: any) => {
                    return "Volume " + new Date(value).toLocaleDateString("pt-PT", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"

                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-value)"
              stackId="a"
            />

            {/* <ChartLegend content={<ChartLegendContent payload={undefined} />} /> */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
