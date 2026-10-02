export interface ValueChange {
    value: number;
    change: number | null;
}

export interface ServiceItem {
    name: string;
    count: number;
    percent: number;
}

export interface IntegrationItem {
    name: string;
    status: string; // "ACTIVE", possivelmente outros: "INACTIVE", "MAINTENANCE", etc.
    operational: boolean;
}

export interface DashboardUsersServicesResponse {
    period: {
        start: string;
        end: string;
    };
    filters: {
        period: string; // "custom", "today", "7_days", etc.
    };
    users: {
        total: ValueChange;
        new: ValueChange;
        active: number;
        blocked: number;
        kyc: {
            pending: number;
            rejected: number;
        };
        individuals: number;
        companies: number;
    };
    services: {
        total: number;
        items: ServiceItem[];
    };
    integrations: {
        total: number;
        operational: number;
        operational_rate: number;
        items: IntegrationItem[];
    };
}