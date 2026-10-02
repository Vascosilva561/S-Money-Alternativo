// utils/format.ts

export function formatNumberPtAO(value: number, decimals = 0) {
    return new Intl.NumberFormat("pt-AO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export function formatChange(change: number | null) {
    if (change === null || change === undefined) return "Sem dados no período anterior";
    const sign = change >= 0 ? "+" : "";
    return `${sign}${formatNumberPtAO(change, 1)}% vs. período anterior`;
}

type DateInput = Date | string | number | null | undefined;

function parseDate(value: DateInput) {
    if (value === null || value === undefined || value === "") return undefined;

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

const dateOnlyFormatter = new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

export function formatDate(value: DateInput, fallback = "—") {
    const date = parseDate(value);
    return date ? dateOnlyFormatter.format(date) : fallback;
}

export function formatDateTime(value: DateInput, fallback = "—") {
    const date = parseDate(value);
    return date ? dateTimeFormatter.format(date) : fallback;
}

function parseNumber(value: unknown) {
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value !== "string" || !value.trim()) return undefined;

    const normalized = value.trim().replace(/\s/g, "");
    const parsed = normalized.includes(",")
        ? Number(normalized.replace(/\./g, "").replace(",", "."))
        : Number(normalized);

    return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatCurrency(value: unknown, unit = "Kz", decimals = 2, fallback = "—") {
    const number = parseNumber(value);
    return number === undefined ? fallback : `${formatNumberPtAO(number, decimals)} ${unit}`;
}
