export type DepositRecord = {
    id: string
    amount: string | number
    status: string
    signal?: string
    canal?: string
    phone_number?: string
    payment_reference?: string
    account_type?: string
    frame_id?: string | null
    created_at: string
    updated_at?: string
    user_name?: string
    user_phone_number?: string
    balance?: string | number | null
    balance_after?: string | number | null
}

export type Deposit = {
    dados: DepositRecord[]
    total_amount: string | number
    total_number?: string
    total: number
}
