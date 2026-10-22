export interface ReferenceDepositAccount {
    id: string
    first_name: string
    last_name: string
    email: string | null
}

export interface ReferenceDepositType {
    id: string
    reference: string
    account: ReferenceDepositAccount
    status: string
    channel: string
    amount: string
    id_transaction: string
    period_id: string
    created_at: string
    updated_at: string
}

export interface ReferenceDepositResponse {
    dados: ReferenceDepositType[]
    total_amount: string
    total: number
}