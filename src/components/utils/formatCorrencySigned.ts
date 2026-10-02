// utils/format.ts

import { formatNumberPtAO } from "./formmat";

export function formatSignedCurrency(value: number, unit = "Kz") {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${formatNumberPtAO(value, 0)} ${unit}`;
}