import { api } from "@/api";
import {  useTransition } from "react";

type props = {
    id: string | undefined,
    //status: (value: boolean) => void
}

export default function GetProducts({ id }: props) {
    const [isPending, startTransition] = useTransition()

        const fetchProducts = startTransition(async () => {

            try {
                const { data } = await api.get(`/front/pgs_produtos?partner_id=${id}`)
                return data?.dados
            } catch (error) {
                console.log("erro ao pegar productos ", error)
            }

        })

        return {fetchProducts, isPending}

}