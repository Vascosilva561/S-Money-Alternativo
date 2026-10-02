
export type Pagamentos = {
    dados: {
        id: string,
        amount: string,
        status: string,
        entity: string,
        signal: string,
        created_at: string,
        body_request: {
            unitel_telefone: string,
            produto_id: number,
            valor: number
        }
        token_ende: string | null,
        account_type: string,
        account: {
            id: string,
            phone_number: string,
            email: string | null,
            password_digest: string,
            auth_token: string,
            push_token: string,
            created_at: string,
            updated_at: string,
            bi_number: string,
            first_name: string,
            last_name: string,
            bi_validated: boolean,
            status: string,
            level: number,
            marital: string,
            gender: string,
            category: string,
            level_up: boolean,
            codi_transfer_user: string,
            status_validate: string,
            motivo: string

            business_name: string
        }
    },
    total: number,
    total_payment: number
}
