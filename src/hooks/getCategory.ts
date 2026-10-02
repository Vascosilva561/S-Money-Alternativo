import { api } from "@/api"
import { useQuery } from "@tanstack/react-query"

export function CategoryList() {

    const getCategory = async () => {

        try {
            const { data } = await api.get("/front/categoria_faqs")
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const data = useQuery({
        queryKey: ["categoriaLista"],
        queryFn: getCategory
    })

    return data
}