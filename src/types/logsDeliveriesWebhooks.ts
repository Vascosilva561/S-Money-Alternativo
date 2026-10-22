export type WebhookDeliveryStatus = "SUCCESS" | "FAILED" | string;

export interface WebhookDeliverySubscriber {
    ID: number;
    ClientID: string;
    ServiceType: string;
    MerchantNumber: string;
    SubscriberType: string;
    Name: string;
    URL: string;
    Events: string[];
    AuthToken: string;
    TokenPrefix: string;
    DynamicAuthPerTx: boolean;
    DynamicAuthSecretWord: string | null;
    DynamicAuthAlgorithm: string | null;
    DynamicAuthDigest: string;
    IsActive: boolean;
    CheckSSL: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface WebhookDeliveryPayload {
    accounting_period: string;
    client_id: string;
    entity_code: string;
    local_transaction_id: string;
    log_number: string;
    merchant_id: string;
    merchant_number: string;
    nib: string;
    operation_amount: string;
    optional_1: string;
    optional_2: string;
    optional_3: string;
    payment_id: string;
    payment_location: string;
    payment_reference: string;
    payment_status: string;
    period_id: string;
    reconciled: boolean;
    reconciled_at?: string;
    terminal_id: string;
    terminal_type: string;
    transaction_datetime: string;
    transaction_reference: string;
}

export interface WebhookDelivery {
    id: number;
    client_id: string;
    merchant_number: string;
    status: WebhookDeliveryStatus;
    hook: string;
    service: string;
    subscriber: WebhookDeliverySubscriber;
    occurred_at: string;
    retries: number;
    next_call: number | null;
    is_replay: boolean;
    payload: WebhookDeliveryPayload;
    created_at: string;
    updated_at: string;
    lease_until: number;
}

export interface WebhookDeliveriesResponse {
    data: WebhookDelivery[];
    total: number;
}