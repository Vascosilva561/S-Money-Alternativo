import { api } from "@/api"
// import { AuthContext } from "@/context/auth"
import { useQuery } from "@tanstack/react-query"
// import { isAxiosError } from "axios"
// import { useContext } from "react"

type user = {
    details: {
        id: string
        email: string
        phone_number: string
        login: string
        name: string
        auth_token: string
        active: boolean
        account_type: string
        created_at: string
        updated_at: string
        last_login_at: string
        provincia: string | null
        municipio: string
        tel_empresa: string
        bi_number: string
        address: string,
        photo: string | null
    }
}

export function DetailsUser() {

    //const {logout} = useContext(AuthContext)

   const getUser = async (): Promise<user | null> => {
    try {
        const { data } = await api.get("/front/managers/session")
        return data
    } catch (error) {
        // if (isAxiosError(error)) {
        //     const status = error.response?.status

        //     // if (status === 401) {
        //     //     logout()
        //     //     return null
        //     // }
        // }
        console.log(error)

        return null
    }
}

    const { data, isLoading } = useQuery<user | null>({
        queryKey: ["detailsUser"],
        queryFn: getUser
    })

    const UserData = {
        details: data?.details,
        isLoading
    }

    return UserData
}