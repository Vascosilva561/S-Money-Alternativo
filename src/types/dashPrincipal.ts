export interface DashboardKpi {
    value: number;
    change: number | null;
}

export interface DashboardPrincipalResponse {
    period: {
        start: string; // "2026-08-01"
        end: string;   // "2026-08-15"
    };
    filters: {
        period: "today" | "custom" | string; // ajusta os valores possíveis conforme a API
    };
    kpis: {
        clients_total: DashboardKpi;
        clients_active: DashboardKpi;
        clients_new: DashboardKpi;
        transaction_volume: DashboardKpi;
        transactions_total: DashboardKpi;
        average_ticket: DashboardKpi;
        success_rate: DashboardKpi;
        wallets_balance: DashboardKpi;
    };
}