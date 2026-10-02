interface Account {
    id: string;
    name: string;
    email: string;
    first_name: string,
    last_name: string,
    business_name: string
}

export type ReferencePaymentType = {
    id: string;
    reference: string;
    account: Account;
    status: "SUCCESS" | "PENDING" | "FAILED"; // adiciona outros status se existirem
    channel: "MULTICAIXA" | string;
    amount: string;
    id_transaction: string | null;
    period_id: string;
    created_at: string;
    updated_at: string;
}

export type ReferencePaymentResponse = {
    dados: ReferencePaymentType[];
    total: number;
    total_amount: number
}