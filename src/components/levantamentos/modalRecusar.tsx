import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
// import { isAxiosError } from "axios"
import { useRef, useState } from "react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DialogClose } from "../ui/dialog"

type props = {
    // onClose: (e: any) => void,
    id: string[]
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>

}

export default function ModalRecusar({ id: ids, setSelectedIds }: props) {

    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [motivo, setMotivo] = useState("")
    const closeRef = useRef<HTMLButtonElement>(null)


    const processar = async () => {
        if (!motivo) {
            toast.error("Selecione o motivo da recusa!", {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                </svg>,
                style: {
                    borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                },
                duration: 2000

            });

            return;
        }

        setLoading(true);

        try {
            const results = await Promise.allSettled(
                ids.map((id) =>
                    api.put(
                        `front/withdrawal/reject?id=${id}&motivo=${encodeURIComponent(motivo)}`
                    )
                )
            );

            // const successful = results.filter(
            //     (result) => result.status === "fulfilled"
            // );

            const failed = results.filter(
                (result) => result.status === "rejected"
            );

            // console.log("✅ Recusados:", successful.length);
            // console.log("❌ Falharam:", failed.length);

            queryClient.invalidateQueries({
                queryKey: ["ListaDelevantamentos"],
            });

            // Se pelo menos um falhou
            if (failed.length > 0) {
                toast.error(
                    `${failed.length} levantamento(s) não puderam ser recusados.`,
                    {
                        duration: 3000,
                    }
                );

                return;
            }

            // Todos tiveram sucesso
            closeRef.current?.click();
            setSelectedIds([]);

            toast.success(
                `Operação realizada com sucesso!`,
                {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                    </svg>
                    ,
                    style: {
                        borderLeft: "8px solid #45B369", // Tailwind emerald-500
                    },
                    duration: 2000

                }
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="w-full flex justify-start px-4">
                <p className=" text-[#143163] font-semibold text-lg" >
                    Recusar Pedido
                </p>
            </div>
            <div className=" p-4 space-y-6  ">
                <div className="space-y-2">
                    <div className="text-center text-[#143163] w-full grid place-items-start">
                        <p>Selecione o Motivo!</p>
                    </div>
                    <div className="flex flex-col space-y-2 mt-5  w-full">
                        <label className="text-[#143163] font-semibold ">Motivo</label>
                        <Select onValueChange={setMotivo} >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="IBAN Inválido">IBAN Inválido</SelectItem>
                                <SelectItem value="Outro Motivo">Outro Motivo </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex space-x-6 mt-10">
                        <DialogClose asChild>
                            <button type="button"
                                className="bg-[#F2F2F2] font-semibold transition cursor-pointer 
                            duration-300 hover:bg-[#E4E4E4]  text-[#616161]  rounded-md p-2 w-full">Cancelar</button>
                        </DialogClose>
                        <button type="button"
                            onClick={processar}
                            className="bg-[#D0F8FF] hover:bg-[#C4EBF1] cursor-pointer  ml-2 transition  duration-300 font-semibold text-[#143163]  rounded-md p-2 w-full">
                            {loading ?
                                <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                </div> : "Recusar Pedido"
                            }
                        </button>
                    </div>
                    <DialogClose asChild>
                        <button ref={closeRef} className="hidden">
                            Fechar
                        </button>
                    </DialogClose>

                </div>
            </div>
        </>
    )
}