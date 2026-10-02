
export type Users = {
    dados: {
        auth_token: string,
        id: string,
        login: number,
        first_name: string,
        last_name: string,
        bi_number: string,
        bi_validated: boolean,
        push_token: null,
        wallet_id: string,
        balance: string,
        email: string,
        phone_number: string,
        active: boolean,
        account_type: string,
        created_at: string,
        nif: string,
        level_up: boolean,
        status_validate: string,
        status: string,
        business_name: string

        user_document: {
            city: string,
            biFrontFile: string,
            biBackFile: string,
            birthday: string,
            country: string,
            selfieFile: string,
            licence_comercial: string,
            address: string,
            user: string,
            province: string,
            nacionalidade: string,
        }
    },
    total: number,
   
}

