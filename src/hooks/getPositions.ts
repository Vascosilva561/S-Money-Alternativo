import { api } from "@/api"
import { useQuery } from "@tanstack/react-query"

export function ListaCargos() {

    const getMenagers = async () => {

        try {
            const { data } = await api.get("/front/position")
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const data = useQuery({
        queryKey: ["listaCargos"],
        queryFn: getMenagers
    })

    return data
}