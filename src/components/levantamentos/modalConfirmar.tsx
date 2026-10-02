import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { DialogClose } from "../ui/dialog"

type props = {
    id: string[],
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export default function ModalConfirmar({ id: ids, setSelectedIds }: props) {
    const closeRef = useRef<HTMLButtonElement>(null)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    //const [selectedFileBack, setSelectedFileBack] = useState() as any
    // const [formDataFiles, setFormDataFiles] = useState({
    //     biFront: null,
    //     biBack: null,
    //     selfie: null,
    // }) as any

    // const handlFileChangeBack = async (e: any) => {
    //     if (e.target.files && e.target.files.length > 0) {

    //         setSelectedFileBack(e.target.files[0])
    //         setFormDataFiles({ ...formDataFiles, biBack: e.target.files[0] })
    //         //setChangeIconFileBack(true)
    //     }
    // }



    const processar = async () => {
        setLoading(true);

        try {
            const results = await Promise.allSettled(
                ids.map((id) =>
                    api.put(`front/withdrawal/confirm?id=${id}`)
                )
            );

            // const successful = results.filter(
            //     (result) => result.status === "fulfilled"
            // );

            const failed = results.filter(
                (result) => result.status === "rejected"
            );


            // console.log("✅ Processados:", successful.length);
            // console.log("❌ Falharam:", failed.length);

            queryClient.invalidateQueries({
                queryKey: ["ListaDelevantamentos"],
            });

            // Pelo menos uma request falhou
            if (failed.length > 0) {
                const firstError = failed[0].reason;

                let message = "Não foi possível processar os levantamentos.";

                if (isAxiosError(firstError)) {
                    message =
                        firstError.response?.data?.message ||
                        "Ocorreu um erro ao processar os levantamentos.";
                }

                toast.error(message, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 3000
                });

                setSelectedIds([]);

                return;
            }

            // ✅ Todas as requests tiveram sucesso
            closeRef.current?.click();
            setSelectedIds([]);

            toast.success("Operação efectuada com sucesso!", {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },
                duration: 2000

            });

        } finally {
            setLoading(false);
        }
    };

    // const handleDragOverBack = (e: any) => {
    //     e.preventDefault()
    // }
    // const handleDropBack = async (e: React.DragEvent) => {
    //     e.preventDefault()
    //     const file = e.dataTransfer.files[0]
    //     setSelectedFileBack(file)
    //     setFormDataFiles({ ...formDataFiles, biBack: file })
    // }

    // function clearBiBack() {
    //     setSelectedFileBack(null)
    //     setFormDataFiles({ ...formDataFiles, biBack: null })

    // }

    return (
        <>
            <div className="w-full flex justify-center mt-2">
                <p className=" text-[#143163] font-semibold" >
                    Confirmar Levantamento
                </p>
            </div>
            <div className=" p-4 space-y-6  ">
                <div className="space-y-2">
                    <div className="text-center text-[#143163] w-full grid place-items-start">
                        <p>Tem certeza que pretende processar esse levantamento?</p>
                    </div>
                    {/* <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
                     ${selectedFileBack ? "bg-[#F6F5FA]" : "bg-white border-dashed"}`}>
                        <label className={`w-full flex flex-col place-items-center
                   `}
                            onDragOver={handleDragOverBack}
                            onDrop={handleDropBack}
                        >

                            <input
                                className="hidden"
                                type="file"
                                onChange={handlFileChangeBack}
                                accept=".pdf, .jpeg, .jpg"
                            />
                            {!selectedFileBack &&
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.46997 6.53002C8.17697 6.23702 8.17697 5.76199 8.46997 5.46899L11.47 2.46899C11.539 2.39999 11.6221 2.345 11.7141 2.307C11.8971 2.231 12.1041 2.231 12.2871 2.307C12.3791 2.345 12.462 2.39999 12.531 2.46899L15.531 5.46899C15.824 5.76199 15.824 6.23702 15.531 6.53002C15.385 6.67602 15.193 6.74999 15.001 6.74999C14.809 6.74999 14.6169 6.67702 14.4709 6.53002L12.751 4.80999V16C12.751 16.414 12.415 16.75 12.001 16.75C11.587 16.75 11.251 16.414 11.251 16V4.81097L9.53101 6.531C9.23701 6.823 8.76297 6.82302 8.46997 6.53002ZM18 9.24999C17.586 9.24999 17.25 9.58599 17.25 9.99999C17.25 10.414 17.586 10.75 18 10.75C19.577 10.75 20.25 11.423 20.25 13V18C20.25 19.577 19.577 20.25 18 20.25H6C4.423 20.25 3.75 19.577 3.75 18V13C3.75 11.423 4.423 10.75 6 10.75C6.414 10.75 6.75 10.414 6.75 9.99999C6.75 9.58599 6.414 9.24999 6 9.24999C3.582 9.24999 2.25 10.582 2.25 13V18C2.25 20.418 3.582 21.75 6 21.75H18C20.418 21.75 21.75 20.418 21.75 18V13C21.75 10.582 20.418 9.24999 18 9.24999Z" fill="#487FFF" />
                                    </svg>
                                    <p className="text-[#143163] text-sm">Arraste ou clique para carregar um ficheiro...</p>
                                </div>

                            }

                        </label>

                        {selectedFileBack &&
                            <div className="flex justify-between items-center w-full z-40">
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM16.75 12C16.75 12.414 16.414 12.75 16 12.75H9C8.586 12.75 8.25 12.414 8.25 12C8.25 11.586 8.586 11.25 9 11.25H16C16.414 11.25 16.75 11.586 16.75 12ZM13.75 16C13.75 16.414 13.414 16.75 13 16.75H9C8.586 16.75 8.25 16.414 8.25 16C8.25 15.586 8.586 15.25 9 15.25H13C13.414 15.25 13.75 15.586 13.75 16Z" fill="#487FFF" />
                                    </svg>

                                    <p className="text-[#143163] text-sm">{selectedFileBack?.name}</p>
                                </div>
                                <svg onClick={clearBiBack} className="cursor-pointer " width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.5297 17.47C18.8227 17.763 18.8227 18.238 18.5297 18.531C18.3837 18.677 18.1917 18.751 17.9997 18.751C17.8077 18.751 17.6158 18.678 17.4698 18.531L11.9997 13.061L6.52975 18.531C6.38375 18.677 6.19175 18.751 5.99975 18.751C5.80775 18.751 5.61575 18.678 5.46975 18.531C5.17675 18.238 5.17675 17.763 5.46975 17.47L10.9398 12L5.46975 6.53005C5.17675 6.23705 5.17675 5.76202 5.46975 5.46902C5.76275 5.17602 6.23775 5.17602 6.53075 5.46902L12.0008 10.939L17.4707 5.46902C17.7637 5.17602 18.2387 5.17602 18.5317 5.46902C18.8247 5.76202 18.8247 6.23705 18.5317 6.53005L13.0617 12L18.5297 17.47Z" fill="#4B5563" />
                                </svg>
                            </div>
                        }
                    </div> */}
                    {/* <p className="grid place-items-end text-[12px] text-[#7D8CA6] ">Tamanho máximo do arquivo 4Mb</p></div> */}
                </div>
                <div className="flex space-x-6 mt-10">
                    <DialogClose asChild>
                        <button type="button"
                            className="bg-[#F2F2F2] font-semibold transition cursor-pointer duration-300 hover:bg-[#E4E4E4]  text-[#616161] 
                         rounded-md p-2 w-full">Não</button></DialogClose>
                    <button type="button"
                        onClick={processar}
                        className="bg-[#D0F8FF] hover:bg-[#C4EBF1] cursor-pointer  ml-2 transition  duration-300 font-semibold text-[#143163]  rounded-md p-2 w-full">
                        {loading ?
                            <div className="flex justify-center items-center">
                                <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                            </div> : "Sim"
                        }
                    </button>
                </div>
                <DialogClose asChild>
                    <button ref={closeRef} className="hidden">
                        Fechar
                    </button>
                </DialogClose>

            </div>
        </>
    )
}