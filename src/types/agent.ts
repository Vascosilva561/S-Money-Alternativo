
export interface Manager {
    id: string;
    name: string;
    phone_number: string;
    account_type: string;
    email: string;
    password_digest: string;
    auth_token: string;
    push_token: string | null;
    created_at: string;
    updated_at: string;
    login: string;
    active: string | null;
    provincia: string | null;
    municipio: string | null;
    tel_empresa: string | null;
    bi_number: string;
    address: string | null;
    photo: string | null;
}

export interface Agent {
    id: string;
    name: string;
    phone_number: string;
    email: string;
    status: string;
    nif: string;
    localization: string;
    owner_name: string;
    level: number;
    account_validate: boolean;
    value: string;
    percentagem_desconto: number | null;
    secret_key: string | null;
    manager: Manager;
    seed_key: string;
    created_at: string;
    updated_at: string;
}

export interface AgentResponse {
    dados: Agent[];
    total: number;
}