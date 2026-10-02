import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { api } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type props = {
    item: any,
}
export const ChangeStatus = ({ item }: props) => {
    // Estado local para o status do item específico
    const [status, setStatus] = useState(item?.status || '');
    const queryClient = useQueryClient()

    // Atualiza o estado local quando o item muda
    useEffect(() => {
        setStatus(item?.status || '');
    }, [item]);

    const handleStatusChange = async (value: string) => {
        setStatus(value);
        // Chama a função para atualizar o item pai ou fazer a requisição
        if (!item?.id) return
        try {
            const url = status !== "Visível" ? `front/faq/updateStatus_visible?id=${item?.id}` : `front/faq/updateStatus_invisible?id=${item?.id}`
            await api.get(url)
            queryClient.invalidateQueries({
                queryKey: ['ListaDeFaqsWeb'],
            })
            toast.success(`Estado Alterado!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },
                duration: 2000

            })
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger className="w-[50%] cursor-pointer">
                <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Visível">Visível</SelectItem>
                <SelectItem value="Oculto">Oculto</SelectItem>
            </SelectContent>
        </Select>
    );
};