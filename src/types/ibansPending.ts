export interface IbanPending {
    id: string;
    iban: string;
    bank_name: string;
    acronym_bank: string;
    bank_color: string;
    cardholder: string;
    phone_number: string | null;
    first_name: string | null;
    last_name: string | null;
    status: string;
}

export interface IbanPendingResponse {
    dados: IbanPending[];
    total?: number | string;
}
