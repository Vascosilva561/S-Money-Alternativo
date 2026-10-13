export type Otp = {
    dados: [{
        id: string;
        otp: string;
        otp_type: string;
        phone_number: string | null;
        email: string | null;
        created_at: string;
    }],
    total: number
}
