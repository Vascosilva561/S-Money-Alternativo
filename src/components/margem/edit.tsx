import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"


type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}


export default function EditMargem({ onClose, isOpen, itemSelected }: props) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: "" as string | File,
        link_url: "",
        start_date: "",
        end_date: ""
    })
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)

    const resetFile = () => {
        setFormData({ ...formData, image_url: "" });
    };

    useEffect(() => {
        setFormData({
            ...formData,
            title: itemSelected?.title,
            description: itemSelected?.description,
            //image_url: itemSelected?.image_url,
            link_url: itemSelected?.link_url,
            start_date: itemSelected?.start_date,
            end_date: itemSelected?.end_date
        })

    }, [itemSelected])


    const formatDateTimeLocal = (date?: string) => {
        if (!date) return "";

        const d = new Date(date);

        const pad = (n: number) => String(n).padStart(2, "0");

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const editarPublicidade = async (e: any) => {
        e.preventDefault()


        try {

            const formDataPayload = new FormData()
            formDataPayload.append('title', formData.title || "")
            formDataPayload.append('image_url', formData.image_url || "")
            formDataPayload.append('link_url', formData.link_url || "")
            formDataPayload.append('description', formData.description || "")
            formDataPayload.append('start_date', new Date(formData.start_date)?.toISOString() || "")
            formDataPayload.append('end_date', new Date(formData.end_date)?.toISOString() || "")
            setLoading(true)

            await api.put(`/front/publicity/${itemSelected?.id}`, formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            queryClient.invalidateQueries({ queryKey: ['publicidadesLista'] })

            onClose()

            toast.success(`Publicidade editada com sucesso!`, {
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
            if (isAxiosError(error)) {
                const message = error?.response?.data?.errors[0]?.message ?? "Erro ao editar publicidade"

                toast.error(`${message}`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 2000

                })
            }
        } finally {
            setLoading(false)
        }
    }

    type FileSource = "click" | "dragAndDrop";

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    const validateImage = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            //  validar tipo (extra)
            if (!file.type.startsWith("image/")) {
                toast.error("Arquivo inválido. Envie uma imagem.");
                return resolve(false);
            }

            //  validar tamanho
            if (file.size > MAX_SIZE) {
                toast.error("A imagem não pode ter mais de 2MB");
                return resolve(false);
            }

            const img = new Image();
            const url = URL.createObjectURL(file);

            img.src = url;

            img.onload = () => {
                const { width, height } = img;

                // 🧹 sempre limpar
                URL.revokeObjectURL(url);

                if (width < 800 || height < 450) {
                    toast.error("A imagem precisa ter pelo menos 800x450px");
                    return resolve(false);
                }

                if (width > 1280 || height > 640) {
                    toast.error("A imagem precisa ter no máximo 1280x640px");
                    return resolve(false);
                }

                resolve(true);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                toast.error("Erro ao carregar imagem");
                resolve(false);
            };
        });
    };

    const validadeFile = async (
        e: React.ChangeEvent<HTMLElement> | React.DragEvent<HTMLElement>,
        type: FileSource
    ) => {
        let file: File | undefined;

        if (type === "click") {
            file = (e as React.ChangeEvent<HTMLInputElement>).target.files?.[0];
        } else {
            file = (e as React.DragEvent<HTMLDivElement>).dataTransfer.files?.[0];
        }

        if (!file) return;

        const isValid = await validateImage(file);

        if (!isValid) {
            resetFile();
            return;
        }

        setFormData({ ...formData, image_url: file });
        toast.success("Imagem anexada com sucesso!");
    };

    const handlFileChangeFront = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        await validadeFile(e, "click")

    }

    const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        await validadeFile(e, "dragAndDrop")
    }

    const handleDragOver = (e: any) => {
        e.preventDefault()
    }
    console.log(formData?.image_url)

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-edit-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Actualize os dados deste registo e guarde as alterações.">Editar margem</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <form onSubmit={editarPublicidade} >

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Título da publicidade</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Link da publicidade</label>
                            <input type="text" value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                       
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">Imagem para o banner</label>
                            <div className=" rounded-lg p-4 bg-white border-2 border-dashed border-[#D4D9EA] flex justify-start items-center space-x-2 ">

                                <label
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className={`cursor-pointer ${formData?.image_url ? "bg-[#17CFDA] hover:bg-[#15b9c2] duration-300" : "bg-[#F4F7FE] hover:bg-[#e8eaf0] duration-300"} w-[70%] p-2 rounded-lg`}
                                >
                                    <input
                                        type="file"
                                        onChange={handlFileChangeFront}
                                        className="hidden"
                                        accept=".jpeg, .jpg, .png, .webp"
                                    //className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`}
                                    />
                                    {!formData?.image_url ?
                                        <div className="flex space-x-2 items-center justify-center rounded-lg h-10">
                                            <p className="text-[#2B3674] text-center ">Carregar imagem</p>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.25 2C5.01625 2 4 3.01625 4 4.25V11.0254C3.42939 11.1412 3 11.6452 3 12.25V17.75C3 18.3549 3.42939 18.8588 4 18.9746V19.75C4 20.9838 5.01625 22 6.25 22H17.75C18.9838 22 20 20.9838 20 19.75V18.9746C20.5706 18.8588 21 18.3549 21 17.75V12.25C21 11.6452 20.5706 11.1412 20 11.0254V9.25C20 9.0511 19.9209 8.86036 19.7803 8.71973L19.7725 8.71191L13.2803 2.21973C13.1396 2.07907 12.9489 2.00004 12.75 2H6.25ZM6.25 3.5H12V7.75C12 8.98375 13.0162 10 14.25 10H18.5V11H5.5V4.25C5.5 3.82675 5.82675 3.5 6.25 3.5ZM13.5 4.56055L17.4395 8.5H14.25C13.8268 8.5 13.5 8.17325 13.5 7.75V4.56055ZM4.5 12.5H19.5V17.5H4.5V12.5ZM11.5 13C11.224 13 11 13.224 11 13.5V16.5C11 16.776 11.224 17 11.5 17H13C13.276 17 13.5 16.776 13.5 16.5C13.5 16.224 13.276 16 13 16H12V13.5C12 13.224 11.776 13 11.5 13ZM15.3125 13C14.6235 13 14.0625 13.561 14.0625 14.25C14.0625 14.939 14.6235 15.5 15.3125 15.5H15.75C15.888 15.5 16 15.612 16 15.75C16 15.888 15.888 16 15.75 16H15.2041C15.0331 16 14.8925 15.873 14.8535 15.834C14.658 15.6385 14.342 15.6385 14.1465 15.834C13.951 16.0295 13.951 16.3455 14.1465 16.541C14.2845 16.679 14.6636 17 15.2041 17H15.75C16.439 17 17 16.439 17 15.75C17 15.061 16.439 14.5 15.75 14.5H15.3125C15.1745 14.5 15.0625 14.388 15.0625 14.25C15.0625 14.112 15.1745 14 15.3125 14H15.75C15.902 14 16.0215 14.1035 16.0215 14.1035C16.217 14.2985 16.533 14.299 16.7285 14.1035C16.924 13.908 16.924 13.592 16.7285 13.3965C16.688 13.356 16.3155 13 15.75 13H15.3125ZM7.90625 13.0088C7.84245 13.021 7.78016 13.0465 7.72266 13.085C7.49266 13.238 7.43048 13.5488 7.58398 13.7783L8.39844 15L7.58398 16.2227C7.43048 16.4527 7.49266 16.763 7.72266 16.916C7.80816 16.973 7.90402 17.001 7.99902 17.001C8.16052 17.001 8.31952 16.9223 8.41602 16.7783L9 15.9023L9.58398 16.7783C9.67998 16.9228 9.83948 17.001 10.001 17.001C10.096 17.001 10.1913 16.9725 10.2773 16.916C10.5073 16.763 10.5695 16.4522 10.416 16.2227L9.60156 15L10.416 13.7783C10.5695 13.5483 10.5073 13.238 10.2773 13.085C10.0463 12.931 9.73698 12.9932 9.58398 13.2227L9 14.0986L8.41602 13.2227C8.30089 13.0505 8.09766 12.9723 7.90625 13.0088ZM5.5 19H18.5V19.75C18.5 20.1733 18.1732 20.5 17.75 20.5H6.25C5.82675 20.5 5.5 20.1733 5.5 19.75V19Z" fill="#2B3674" />
                                            </svg>
                                        </div> :
                                        <>
                                            <div className="flex space-x-2 items-center justify-center rounded-lg h-10">
                                                <p className="text-[#2B3674] text-center ">{formData?.image_url instanceof File ? formData.image_url.name : ""}</p>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.25 2C5.01625 2 4 3.01625 4 4.25V11.0254C3.42939 11.1412 3 11.6452 3 12.25V17.75C3 18.3549 3.42939 18.8588 4 18.9746V19.75C4 20.9838 5.01625 22 6.25 22H17.75C18.9838 22 20 20.9838 20 19.75V18.9746C20.5706 18.8588 21 18.3549 21 17.75V12.25C21 11.6452 20.5706 11.1412 20 11.0254V9.25C20 9.0511 19.9209 8.86036 19.7803 8.71973L19.7725 8.71191L13.2803 2.21973C13.1396 2.07907 12.9489 2.00004 12.75 2H6.25ZM6.25 3.5H12V7.75C12 8.98375 13.0162 10 14.25 10H18.5V11H5.5V4.25C5.5 3.82675 5.82675 3.5 6.25 3.5ZM13.5 4.56055L17.4395 8.5H14.25C13.8268 8.5 13.5 8.17325 13.5 7.75V4.56055ZM4.5 12.5H19.5V17.5H4.5V12.5ZM11.5 13C11.224 13 11 13.224 11 13.5V16.5C11 16.776 11.224 17 11.5 17H13C13.276 17 13.5 16.776 13.5 16.5C13.5 16.224 13.276 16 13 16H12V13.5C12 13.224 11.776 13 11.5 13ZM15.3125 13C14.6235 13 14.0625 13.561 14.0625 14.25C14.0625 14.939 14.6235 15.5 15.3125 15.5H15.75C15.888 15.5 16 15.612 16 15.75C16 15.888 15.888 16 15.75 16H15.2041C15.0331 16 14.8925 15.873 14.8535 15.834C14.658 15.6385 14.342 15.6385 14.1465 15.834C13.951 16.0295 13.951 16.3455 14.1465 16.541C14.2845 16.679 14.6636 17 15.2041 17H15.75C16.439 17 17 16.439 17 15.75C17 15.061 16.439 14.5 15.75 14.5H15.3125C15.1745 14.5 15.0625 14.388 15.0625 14.25C15.0625 14.112 15.1745 14 15.3125 14H15.75C15.902 14 16.0215 14.1035 16.0215 14.1035C16.217 14.2985 16.533 14.299 16.7285 14.1035C16.924 13.908 16.924 13.592 16.7285 13.3965C16.688 13.356 16.3155 13 15.75 13H15.3125ZM7.90625 13.0088C7.84245 13.021 7.78016 13.0465 7.72266 13.085C7.49266 13.238 7.43048 13.5488 7.58398 13.7783L8.39844 15L7.58398 16.2227C7.43048 16.4527 7.49266 16.763 7.72266 16.916C7.80816 16.973 7.90402 17.001 7.99902 17.001C8.16052 17.001 8.31952 16.9223 8.41602 16.7783L9 15.9023L9.58398 16.7783C9.67998 16.9228 9.83948 17.001 10.001 17.001C10.096 17.001 10.1913 16.9725 10.2773 16.916C10.5073 16.763 10.5695 16.4522 10.416 16.2227L9.60156 15L10.416 13.7783C10.5695 13.5483 10.5073 13.238 10.2773 13.085C10.0463 12.931 9.73698 12.9932 9.58398 13.2227L9 14.0986L8.41602 13.2227C8.30089 13.0505 8.09766 12.9723 7.90625 13.0088ZM5.5 19H18.5V19.75C18.5 20.1733 18.1732 20.5 17.75 20.5H6.25C5.82675 20.5 5.5 20.1733 5.5 19.75V19Z" fill="#2B3674" />
                                                </svg>
                                            </div>
                                        </>
                                    }
                                </label>
                                {formData?.image_url && <svg className="cursor-pointer" onClick={() => resetFile()} width="20" height="20" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 1C9.97115 1 8.28178 2.57286 7.99823 4.6H4.04164C3.99239 4.59126 3.94251 4.58694 3.89255 4.58711C3.84938 4.58808 3.80634 4.59238 3.76378 4.6H1.8798C1.76485 4.59831 1.65073 4.62035 1.54406 4.66482C1.43739 4.70929 1.34031 4.77532 1.25845 4.85906C1.17659 4.9428 1.11158 5.04258 1.06722 5.15261C1.02285 5.26264 1 5.38073 1 5.5C1 5.61927 1.02285 5.73736 1.06722 5.84739C1.11158 5.95742 1.17659 6.0572 1.25845 6.14094C1.34031 6.22468 1.43739 6.29071 1.54406 6.33518C1.65073 6.37965 1.76485 6.40169 1.8798 6.4H3.11659L4.5725 22.0176C4.72926 23.7016 6.10818 25 7.73845 25H16.2604C17.8908 25 19.2697 23.7017 19.4264 22.0176L20.8834 6.4H22.1202C22.2351 6.40169 22.3493 6.37965 22.4559 6.33518C22.5626 6.29071 22.6597 6.22468 22.7416 6.14094C22.8234 6.0572 22.8884 5.95742 22.9328 5.84739C22.9772 5.73736 23 5.61927 23 5.5C23 5.38073 22.9772 5.26264 22.9328 5.15261C22.8884 5.04258 22.8234 4.9428 22.7416 4.85906C22.6597 4.77532 22.5626 4.70929 22.4559 4.66482C22.3493 4.62035 22.2351 4.59831 22.1202 4.6H20.2373C20.1453 4.58451 20.0515 4.58451 19.9595 4.6H16.0018C15.7182 2.57286 14.0289 1 12 1ZM12 2.8C13.0867 2.8 13.9782 3.5609 14.233 4.6H9.76701C10.0218 3.5609 10.9133 2.8 12 2.8ZM4.85826 6.4H19.1406L17.6994 21.8441C17.6271 22.6212 17.0127 23.2 16.2604 23.2H7.73845C6.98729 23.2 6.37172 22.6202 6.29948 21.8441L4.85826 6.4ZM9.96241 9.38711C9.73254 9.39084 9.5135 9.48907 9.3534 9.66024C9.19329 9.8314 9.10522 10.0615 9.10852 10.3V19.3C9.10689 19.4193 9.12813 19.5377 9.17099 19.6483C9.21385 19.759 9.27749 19.8597 9.3582 19.9447C9.43891 20.0296 9.53509 20.097 9.64114 20.1431C9.74719 20.1891 9.861 20.2128 9.97596 20.2128C10.0909 20.2128 10.2047 20.1891 10.3108 20.1431C10.4168 20.097 10.513 20.0296 10.5937 19.9447C10.6744 19.8597 10.7381 19.759 10.7809 19.6483C10.8238 19.5377 10.845 19.4193 10.8434 19.3V10.3C10.8451 10.1795 10.8234 10.06 10.7797 9.94835C10.736 9.83673 10.6712 9.73535 10.589 9.65022C10.5069 9.56509 10.4091 9.49794 10.3014 9.45274C10.1938 9.40755 10.0785 9.38523 9.96241 9.38711ZM14.0105 9.38711C13.7806 9.39084 13.5616 9.48907 13.4015 9.66024C13.2414 9.8314 13.1533 10.0615 13.1566 10.3V19.3C13.155 19.4193 13.1762 19.5377 13.2191 19.6483C13.2619 19.759 13.3256 19.8597 13.4063 19.9447C13.487 20.0296 13.5832 20.097 13.6892 20.1431C13.7953 20.1891 13.9091 20.2128 14.024 20.2128C14.139 20.2128 14.2528 20.1891 14.3589 20.1431C14.4649 20.097 14.5611 20.0296 14.6418 19.9447C14.7225 19.8597 14.7861 19.759 14.829 19.6483C14.8719 19.5377 14.8931 19.4193 14.8915 19.3V10.3C14.8932 10.1795 14.8715 10.06 14.8278 9.94835C14.7841 9.83673 14.7192 9.73535 14.6371 9.65022C14.5549 9.56509 14.4571 9.49794 14.3495 9.45274C14.2419 9.40755 14.1266 9.38523 14.0105 9.38711Z" fill="#2B3674" stroke="#2B3674" stroke-width="0.3" />
                                </svg>
                                }
                            </div>

                        </div>

                        <div className="flex justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-5 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Data inicial de visualização </label>
                                
                                <input type="datetime-local" value={formatDateTimeLocal(formData.start_date)} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex flex-col space-y-2 mt-5 w-full ">
                                <label className="text-[#143163] font-semibold text-sm">Data final de vizualização</label>
                                <input type="datetime-local" value={formatDateTimeLocal(formData.end_date)} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">Descrição</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`p-2 ring-1 h-20 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>



                        <Button onClick={() => {

                        }} className=" w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="submit" variant="brand">
                            {loading ?
                                <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                </div> : "Salvar Alterações"
                            }
                        </Button>
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
