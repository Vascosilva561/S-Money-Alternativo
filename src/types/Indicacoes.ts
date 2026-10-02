export type ReferralItem = {
    id: string;
    user_id: string;
    user_name: string;
    user_phone: string;
    user_email: string;
    user_nro_reference: string;
    code: string;
    user_invite_id: string;
    invited_user_name: string;
    invited_user_phone: string;
    invited_user_email: string;
    invited_user_nro_reference: string;
    validated_referral: string;
    created_at: string;
    updated_at: string;
}
export type ReferralResponse = {
        dados: ReferralItem[];
        total: number;
    }