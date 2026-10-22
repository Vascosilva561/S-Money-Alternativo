export type GpoPaymentMerchant = {
    id: string
    business_name: string
    email: string
    phone_number: string
    nif: string
}

export type GpoPayment = {
    payment_id: number
    merchant_id: string
    merchant_number: string
    transaction_reference: string
    amount: string
    phone_number: string
    status: string
    clearing_period: string | null
    payment_reference: string
    external_payment_id: string | null
    external_customer_id: string | null
    created_at: string
    updated_at: string
    merchant: GpoPaymentMerchant
}

export type GpoPaymentResponse = {
    dados: GpoPayment[]
    total_amount: string
    total: number
}

export type GpoPaymentFilters = {
    merchant_id: string
    merchant_number: string
    business_name: string
    status: string
    payment_reference: string
    transaction_reference: string
    phone_number: string
    external_payment_id: string
    montante_de: string
    montante_ate: string
    data_inicio: string
    data_fim: string
}

export const initialGpoPaymentFilters: GpoPaymentFilters = {
    merchant_id: "",
    merchant_number: "",
    business_name: "",
    status: "",
    payment_reference: "",
    transaction_reference: "",
    phone_number: "",
    external_payment_id: "",
    montante_de: "",
    montante_ate: "",
    data_inicio: "",
    data_fim: "",
}