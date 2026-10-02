import { api } from "@/api"
import { useQuery } from "@tanstack/react-query"
import { format, startOfMonth } from "date-fns"

type User = {
    total: number
}

export function useTotalClientes() {
    const getUsers = async (): Promise<{ users: User; merchants: User, usersToday: User; merchantsToday: User, usersActiveMonth:User, merchantsActiveMonth: User }> => {
        const dataAtual = new Date()
        
        const inicioMes = format(startOfMonth(dataAtual), "yyyy-MM-dd")

        const hoje = format(dataAtual, "yyyy-MM-dd")

        try {
            const [userResponseUser, userResponseMerchant,
                userResponseUserAtivosMes, userResponseMerchantAtivosMes,
                userResponseUserHoje, userResponseMerchantHoje
            ] = await Promise.all([
                api.get("/front/users?per_page=1"), // userResponseUser
                api.get("/front/merchants?per_page=1"), // userResponseMerchant
                api.get(`/front/users?per_page=1&status=Activo&data_inicio=${inicioMes}`), // userResponseUserAtivosMes
                api.get(`/front/merchants?per_page=1&status=Activo&data_inicio=${inicioMes}`), // userResponseMerchantAtivosMes
                api.get(`/front/users?per_page=1&data_inicio=${hoje}`), // userResponseUserHoje
                api.get(`/front/merchants?per_page=1&data_inicio=${hoje}`), // userResponseMerchantHoje
            ])

            return {
                users: userResponseUser.data,
                merchants: userResponseMerchant.data,
                usersActiveMonth: userResponseUserAtivosMes.data,
                merchantsActiveMonth: userResponseMerchantAtivosMes.data,
                usersToday: userResponseUserHoje.data,
                merchantsToday: userResponseMerchantHoje.data,
            }
        } catch (error) {
            console.error("Erro ao buscar utilizadores:", error)
            throw error
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ["totalUsers"],
        queryFn: getUsers,
    })

    const totalUsersCount =
        (data?.users?.total || 0) +
        (data?.merchants?.total || 0)

    const totalUsersTodayCount =
        (data?.usersToday?.total || 0) +
        (data?.merchantsToday?.total || 0)

    const totalUsersActiveMonthCount =
        (data?.usersActiveMonth?.total || 0) +
        (data?.merchantsActiveMonth?.total || 0)

    return {
        totalUsersCount,
        totalUsersActiveMonthCount,
        totalUsersTodayCount,
        users: data?.users,
        merchants: data?.merchants,
        isLoading,
    }
}
