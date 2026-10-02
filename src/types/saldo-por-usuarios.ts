   export type saldo_por_usuario_type = {
        id: string;
        first_name: string;
        last_name: string;
        business_name: string;
        phone_number: string;
        email: string | null;
        balance: string;
        status: string;
    }

    export type saldo_por_usuario_response = {
        dados: saldo_por_usuario_type[];
        total: number;
    }