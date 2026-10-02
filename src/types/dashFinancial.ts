export interface VolumePoint {
    date: string; // "2026-08-20"
    value: number;
}

export interface DashboardFinancialResponse {
    period: {
        start: string;
        end: string;
    };
    filters: {
        period: string; // "7_days", "custom", "today", etc.
    };
    volume: {
        total: number;
        change: number | null;
        points: VolumePoint[];
    };
    cash_flow: {
        balance: number;
        inflow: {
            value: number;
            change: number | null;
        };
        outflow: {
            value: number;
            change: number | null;
        };
        net: number;
    };
}