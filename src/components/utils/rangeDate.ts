import type { FilterOption } from "@/pages/dashboard";

const toApiDate = (date: Date) => {
    return date.toISOString().split("T")[0];
}

export function getDateRange(filter: FilterOption, customRange?: { start: string; end: string }) {
    const today = new Date();

    switch (filter) {
        case "today": {
            const d = toApiDate(today);
            return { start_date: d, end_date: d };
        }
        case "yesterday": {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const d = toApiDate(yesterday);
            return { start_date: d, end_date: d };
        }
        case "7days": {
            const start = new Date(today);
            start.setDate(today.getDate() - 6); // inclui hoje = 7 dias
            return { start_date: toApiDate(start), end_date: toApiDate(today) };
        }
        case "30days": {
            const start = new Date(today);
            start.setDate(today.getDate() - 29);
            return { start_date: toApiDate(start), end_date: toApiDate(today) };
        }
        case "custom": {
            return { start_date: customRange?.start ?? "", end_date: customRange?.end ?? "" };
        }
    }
}