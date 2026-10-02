
export type Wallets ={
    slice(arg0: number, perPage: string): import("react").SetStateAction<Wallets[]>
    dados: Array<{
        id: string,
        balance: string,
        account_type: string,
        updated_at: string,
        account_id: string,
        created_at: string,
        account: {
            id: string,
            first_name: string,
            last_name: string,
            bi_number: string,
            nif: string,
            status: string,
            level: number,
            marital: string,
            category: string,
            gender: string,
            email: string,
            phone_number: string,
            created_at: string,
            updated_at: string,
        }
    }>
}