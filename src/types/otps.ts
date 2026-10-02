export type Otp = {
    dados: {
        id: string;
        otp: string;
        otp_type: string;
        phone_number: string | null;
        email: string | null;
        created_at: string;
    }
}
/**{
            "id": "7544e52b-6093-4406-a792-cae76e9ba930",
            "otp": "994276",
            "otp_type": "PWD_CHANGE",
            "phone_number": null,
            "email": "rodinofeliciano2002@gmail.com",
            "created_at": "2025-07-07T14:30:54.596Z"
        }, */