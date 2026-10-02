

export type Deposit = {
    dados: {
        id: string;
        amount: string;
        status: string;
        signal: string;
        canal: string;
        phone_number: string;
        payment_reference: string;
        account_type: string;
        frame_id: string | null;
        created_at: string;
        user_name: string;
        user_phone_number: string;
    },
    total_amount: string
    total_number: string,
    total: number
}
