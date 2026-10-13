export type TransactionSignal = "DEBIT" | "CREDIT";

export type AccountType = "Merchant" | "User"; // ajustar caso existam outros valores

export type MerchantOperation = "withdraw" | "deposit" | "transfer"; // ajustar conforme outros valores possíveis

export type MerchantTransactionStatus = "APPROVED" | "PENDING" | "REJECTED"; // ajustar conforme outros valores possíveis

export interface MerchantInfo {
    id: string;
    business_name: string;
    email: string;
    phone_number: string | null;
    nif: string;
}

export interface UserInfo {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string;
    level: number;
}

export interface MerchantTransactionDetail {
    id: string;
    operation: MerchantOperation;
    source_type: "merchant" | "customer"; // ajustar conforme outros valores possíveis
    source_id: string;
    destination_type: "merchant" | "customer"; // ajustar conforme outros valores possíveis
    destination_id: string;
    amount: string; // vem como string, não number
    status: MerchantTransactionStatus;
    reference: string;
    external_reference: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    merchant: MerchantInfo;
    user: UserInfo;
}

export interface ActivityItem {
    id: string;
    type: "MerchantTransaction" | string; // ajustar conforme outros tipos possíveis (ex: "UserTransaction")
    account_type: AccountType;
    created_at: string;
    signal: TransactionSignal;
    detalhe: {
        merchant_transaction: MerchantTransactionDetail;
        // provavelmente existem outras chaves aqui conforme o "type"
        // (ex: user_transaction), a confirmar
    };
}
