import { api } from "@/api"
import { useQuery } from "@tanstack/react-query"

export function ListaManagers() {

    const getMenagers = async () => {

        try {
            const { data } = await api.get("/front/managers")
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const data = useQuery({
        queryKey: ["listaManagers"],
        queryFn: getMenagers
    })

    return data
}