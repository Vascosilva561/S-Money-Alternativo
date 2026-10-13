export type ReferenceConfiguration = {
    id: string;
    client_id: string;
    pool_id: string;
    profile: string;
    average_daily_volume: number;
    merchant: {
        business_name: string
    }
};

export type ReferenceConfigurationResponse = ReferenceConfiguration[];