export type MovimentosType = {
    id: string;
    type: 'Transaction' | 'Withdrawal' | 'PgsPayment' | 'DepositGpoFrame' | "PaymentReferences" | "CampaignReward" | "Referral" | "MerchantTransaction";
    account_type: 'User' | 'Merchant';
    created_at: string;
    signal: 'CREDIT' | 'DEBIT';
    detalhe: {
        transaction?: {
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
            signal: 'CREDIT' | 'DEBIT';
            balance_sender: string;
            balance_receiver: string;
            motivo: string | null;
        };
        withdrawal?: {
            id: string;
            amount: string;
            fee: string;
            status: string;
            account_type: string;
            iban: string;
            beneficiario: string;
            signal: 'CREDIT' | 'DEBIT';
            created_at: string;
            updated_at: string;
            balance_after: string;
            balance_before: string;
            account: {
                id: string;
                first_name: string;
                last_name: string;
                phone_number: string;
                email: string | null;
                bi_number: string;
                status: string;
                level: number;
                marital: string;
                gender: string;
                category: string;
                updated_at: string;
                created_at: string;
                balance: string;
                account_type: string;
            };
            responsavel: {
                name: string;
            };
            comprovativo: string | null;
            motivo: string | null;
        };
        pgs_payment?: {
            id: string;
            amount: string;
            status: string;
            entity: string;
            signal: 'CREDIT' | 'DEBIT';
            created_at: string;
            product_name: string;
            body_request: {
                unitel_telefone: string;
                produto_id: number;
                valor: number;
            };
            account_type: string;
            account: {
                id: string;
                phone_number: string;
                email: string | null;
                password_digest: string;
                auth_token: string;
                push_token: string;
                created_at: string;
                updated_at: string;
                bi_number: string;
                first_name: string;
                last_name: string;
                bi_validated: boolean;
                status: string;
                level: number;
                marital: string;
                gender: string;
                category: string;
                level_up: boolean;
                codi_transfer_user: string | null;
                status_validate: string;
                motivo: string | null;
                manager_id: string | null;
            };
        };
        deposit_gpo_frame?: {
            id: string;
            amount: string;
            status: string;
            signal: 'CREDIT' | 'DEBIT';
            canal: string;
            phone_number: string;
            payment_reference: string;
            account_type: string;
            frame_id: string | null;
            created_at: string;
            user_name: string;
            user_phone_number: string;
            balance: string;
            balance_after: string;
        };
        payment_references?: {
            id: string;
            reference: string;
            status: string;
            channel: string;
            amount: string;
            id_transaction: string;
            period_id: string;
            created_at: string;
            updated_at: string;
        };
        merchant_transaction?: {
            status?: string;
            amount?: number | string;
            created_at?: string;
            operation?: string;
            reference?: string;
            external_reference?: string;
            source_type?: "merchant" | "customer";
            destination_type?: "merchant" | "customer";
            merchant?: { business_name?: string; nif?: string; email?: string };
            user?: { first_name?: string; last_name?: string; phone_number?: string; level?: number | string };
        };
        campaign_reward?: Record<string, unknown>;
        campaign?: Record<string, unknown>;
        referral?: Record<string, unknown>;
    };
    account: {
        id: string;
        phone_number: string;
        email: string | null;
        password_digest: string;
        auth_token: string;
        push_token: string;
        created_at: string;
        updated_at: string;
        bi_number: string;
        first_name: string;
        last_name: string;
        bi_validated: boolean;
        status: string;
        level: number;
        marital: string;
        gender: string;
        category: string;
        level_up: boolean;
        codi_transfer_user: string | null;
        status_validate: string;
        motivo: string | null;
        manager_id: string | null;
        business_name?: string;
    };
};

export type DataMovimentType = {
    dados: MovimentosType[],
    total: number,
    total_entrada: number,
    total_saida: number
}


