export interface HourlyPoint {
    hour: string; // "00:00"
    value: number;
}

export interface DashboardOperationalResponse {
    period: {
        start: string;
        end: string;
    };
    filters: {
        period: string; // "today", "7_days", "custom", etc.
        status: string; // "PAID", ou outros status possíveis
    };
    states: {
        total: number;
        success: {
            count: number;
            rate: number; // percentual, ex: 96.46
        };
        pending: number;
        failed: number;
        cancelled: number;
        reverted: number;
    };
    hourly: {
        total: number;
        change: number | null;
        points: HourlyPoint[];
    };
}