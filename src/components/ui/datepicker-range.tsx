// components/DateRangePicker.tsx
"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
    value: { start: string; end: string };
    onChange: (range: { start: string; end: string }) => void;
    className?: string;
};

// "yyyy-MM-dd" -> Date (evita bug de timezone do `new Date("yyyy-MM-dd")`)
function parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

// Date -> "yyyy-MM-dd"
function toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function DateRangePicker({ value, onChange, className }: Props) {
    const dateRange: DateRange | undefined = value.start
        ? { from: parseDate(value.start), to: value.end ? parseDate(value.end) : undefined }
        : undefined;

    function handleSelect(range: DateRange | undefined) {
        onChange({
            start: range?.from ? toDateString(range.from) : "",
            end: range?.to ? toDateString(range.to) : "",
        });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`text-[11px] whitespace-nowrap flex items-center gap-1 outline-none bg-transparent ${className ?? ""}`}
                >
                    <CalendarIcon className="w-3 h-3 shrink-0 mb-0.5 mr-1" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <span>
                                {format(dateRange.from, "dd/MM/yyyy")} • {format(dateRange.to, "dd/MM/yyyy")}
                            </span>
                        ) : (
                            <span>{format(dateRange.from, "dd/MM/yyyy")}</span>
                        )
                    ) : (
                        <span>Selecione um período</span>
                    )}
                </button>
                
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Calendar  mode="range" numberOfMonths={2} onSelect={handleSelect} selected={dateRange} />
            </PopoverContent>
        </Popover>
    );
}