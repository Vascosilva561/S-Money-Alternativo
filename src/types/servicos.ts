export type Servicos = {
    status: string;
    partner_id: string;
    name: string;
    category: string;
    id: string;
    dados: {
        id: string;
        name: string;
        status: string;
        body_request: null | {
            field: string;
            description: string;
            type: string;
        }[];
        partner_id: number;
        category: string;
        created_at: string;
        updated_at: string;
    }[];
    total: number;
}

