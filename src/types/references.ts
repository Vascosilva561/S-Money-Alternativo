export type PaymentReferenceMerchant = {
    id: string;
    business_name: string;
    merchant_payment_number: string;
    email: string;
};

export type PaymentReference = {
    id: string,
    payment_reference: string;
    merchant_id: string;
    merchant_number: string;
    transaction_reference: string;
    optional_1: string | null;
    optional_2: string | null;
    optional_3: string | null;
    payment_start_date: string;
    payment_deadline: string;
    minimum_amount: number | null;
    maximum_amount: number | null;
    number_of_lines: number;
    receipt_text: string;
    fixed_amount: number | null;
    limited_amount_for_long_payment: number | null;
    nib: string | null;
    single_use: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    merchant: PaymentReferenceMerchant;
};

export type PaymentReferencesResponse = {
    dados: PaymentReference[];
    total: number;
};