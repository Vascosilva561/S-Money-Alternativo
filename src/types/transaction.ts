

export type Transactions = {
    dados: {
        id: string;
        amount: string;
        description: string;
        receiver_id: string;
        sender_id: string;
        receiver_type: string;
        receiver_account: string;
        receiver_name: string;
        sender_type: string;
        sender_name: string;
        sender_account: string;
        created_at: string;
        status: string;
        contacto_sender: string;
        contacto_receiver: string;
        signal: string;
        balance_sender: string;
        balance_receiver: string;
        motivo: string | null;
        estorno: boolean;
    },
    total_amount: string,
    total: number
}
