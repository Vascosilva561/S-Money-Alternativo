
export type DataLevanvamtosType = {
        id: string;
        amount: string;
        fee: string;
        status: string;
        account_id: string;
        account_type: string;
        signal: string;
        created_at: string;
        iban: string;
        account: {
            id: string;
            first_name: string;
            last_name: string;
            phone_number: string;
            email: string | null;
            bi_number: string;
            status: string;
            level: number;
            iban: string;
            beneficiaio: string;
            marital: string;
            gender: string;
            category: string;
            updated_at: string;
            created_at: string;
            balance: string;
            account_type: string;
            business_name: string;
        };
        responsavel: {
            name: string
        },
        comprovativo: string
    }

export type LevantamentosType = {
    dados: DataLevanvamtosType[];
    total_amount: string;
    total: number;
}

