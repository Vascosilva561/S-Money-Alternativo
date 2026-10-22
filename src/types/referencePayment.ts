export interface ReferencePaymentType {
    id?: string
    value?: string
    cost?: string
    profit_somoney?: string
    transaction_reference?: string
    created_at?: string
    updated_at?: string
    merchant?: { id: string; email: string; business_name: string; balance: string }
    payment_id: string
    entity_code: string
    payment_reference: string
    operation_amount: string
    applied_fee: string | null
    processing_date: string
    transaction_datetime: string
    payment_date: string
    payment_time: string
    product_code: string
    unit_quantity: string | null
    payment_location: string
    mft_status: string
    prt_status: string
    payment_status: string
    pdd_application: string
    log_id: string
    log_number: string
    terminal_type: string
    accounting_period: string
    local_transaction_id: string
    terminal_id: string
    currency_code: string
    nib: string | null
    reference_channels: string[]
    optional_1: string
    optional_2: string
    optional_3: string
}

export interface ReferencePaymentResponse {
    code: string
    payments: ReferencePaymentType[]
    next_cursor: string | null
    total?: number
}
