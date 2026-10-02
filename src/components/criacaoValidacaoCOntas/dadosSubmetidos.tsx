
import { api } from "@/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
type props = {
    biFront: string,
    biBack: string,
    selfie: string,
    statusAccount: string,
    idUser: string,
    onClose: () => void,
    nacionalidade: string,
    typeAccount: string,
    level_up: boolean
}

export default function DadosSubmetidos({ biFront, biBack, selfie, idUser, onClose, nacionalidade, typeAccount, level_up }: props) {
    const queryClient = useQueryClient()
    const [nenhumDocumento, setNenhumDocumento] = useState(false)
    const [motivoRecusa, setMotivoRecusa] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingReject, setLoadingReject] = useState(false)
    const [razaoRecusa, setRazaoRecusa] = useState("")

    useEffect(() => {
        if (typeAccount === "User") {
            if (!biFront || !biBack || !selfie) {
                setNenhumDocumento(true)
            }
        }
        else {
            if (!biFront || !biBack) {
                setNenhumDocumento(true)
            }
        }

    }, [])

    const validarDocumento = async () => {
        try {

            setLoading(true)
            //await api.put(`/front/user/${idUser}/level_up_confirm`)
            await api.put(`/front/${typeAccount?.toLowerCase()}/${idUser}/level_up_confirm`)
            queryClient.invalidateQueries({
                queryKey: ['usersList'],
                //exact: true,
            })
            onClose()
            toast.error("Utilizador validado com sucesso!", {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5298 7.52978L11.5298 17.5298C11.3888 17.6708 11.1978 17.7498 10.9998 17.7498C10.9988 17.7498 10.9978 17.7498 10.9968 17.7498C10.7968 17.7488 10.6058 17.6688 10.4648 17.5258L6.46479 13.4638C6.17379 13.1688 6.1778 12.6938 6.4728 12.4028C6.7678 12.1128 7.24379 12.1158 7.53379 12.4108L11.0028 15.9348L20.4688 6.46877C20.7618 6.17577 21.2368 6.17577 21.5298 6.46877C21.8228 6.76177 21.8228 7.23778 21.5298 7.52978ZM10.9998 13.7498C11.1918 13.7498 11.3838 13.6768 11.5298 13.5298L17.5298 7.52978C17.8228 7.23678 17.8228 6.76177 17.5298 6.46877C17.2368 6.17577 16.7618 6.17577 16.4688 6.46877L10.4688 12.4688C10.1758 12.7618 10.1758 13.2368 10.4688 13.5298C10.6158 13.6768 10.8078 13.7498 10.9998 13.7498ZM3.53379 12.4138C3.24379 12.1188 2.7688 12.1148 2.4728 12.4058C2.1778 12.6968 2.17379 13.1708 2.46479 13.4668L6.46479 17.5268C6.61079 17.6758 6.80479 17.7508 6.99879 17.7508C7.18879 17.7508 7.37879 17.6788 7.52479 17.5348C7.81979 17.2438 7.8238 16.7698 7.5328 16.4738L3.53379 12.4138Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },

            })

            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log(error)

        }
    }

    const recusarDocumento = async () => {
        if (razaoRecusa === "") {
            toast.error("Selecione o Motivo!", {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z" fill="#FF9F29" />
                </svg>,
                style: {
                    borderLeft: "8px solid #FF9F29", // Tailwind emerald-500
                },

            })
            return
        }
        try {

            setLoadingReject(true)
            //await api.put(`/front/user/${idUser}/level_up_confirm`) 
            await api.put(`/front/${typeAccount?.toLowerCase()}/${idUser}/level_up_reject?motivo=${razaoRecusa}`)
            queryClient.invalidateQueries({
                queryKey: ['usersList'],
                //exact: true,
            })
            onClose()
            toast.error("Solicitação de Reenvio de Documentos Submetida!", {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z" fill="#FF9F29" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #FF9F29", // Tailwind emerald-500
                },

            })

            setLoadingReject(false)


        } catch (error) {
            setLoadingReject(false)
            console.log(error)



        }
    }

    return (
        <>

            {!motivoRecusa && (nenhumDocumento ?
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-10 px-4 border border-dashed border-gray-300 mt-10">
                    <svg className="text-gray-400 mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-600 text-center font-medium">Nenhum documento submetido</p>
                    <p className="text-gray-500 text-center text-sm mt-1">Os documentos submetidos pelo utilizador aparecerão aqui.</p>
                </div>:
                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-[#143163] font-semibold">{nacionalidade === "Nacional" ? "Bilhete de Identidade" : "Documentos"}</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>
                        <div className={`flex ${typeAccount === "User" ? (nacionalidade !== "Nacional" && "space-x-12") : "space-x-8"}`}>
                            <div className="text-[#4B5563] ">
                                <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed  border-[#D1D5DB] mt-4 relative">
                                    {biFront?.match(/\.(jpeg|jpg|gif|png)$/i) &&
                                        <div className="w-full flex justify-end p-1 absolute ">
                                            <svg
                                                onClick={() => {
                                                    // Abre uma nova página com o iframe
                                                    const newWindow = window.open('', '_blank');
                                                    newWindow?.document.writeln(`
                                                                        <html>
                                                                            <head>
                                                                            <title>Visualizador de Documento</title>
                                                                            <style>
                                                                                body { margin: 0; padding: 0; overflow: hidden; height: 100vh; }
                                                                                img, object { max-width: 100%; max-height: 100vh; display: block; margin: 0 auto; }
                                                                            </style>
                                                                            </head>
                                                                            <body bgColor="#141f2b">
                                                                            ${biFront?.match(/\.(jpeg|jpg|gif|png)$/i)
                                                            ? `<img src="${biFront}" alt="Documento" />`
                                                            : `<object data="${biFront}" type="application/pdf" width="100%" height="100%">
                                                                                    <a href="${biFront}">Baixar documento</a>
                                                                                </object>`
                                                        }
                                                                            </body>
                                                                        </html>
                                                                        `)
                                                    newWindow?.document.close();
                                                }}
                                                className="bg-[#D9E0F2] text-[#2678F2] duration-300 hover:text-white rounded-full cursor-pointer hover:bg-[#2678F2] "
                                                width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="30" height="30" rx="15" fill-opacity="0.1" />
                                                <path d="M6.74995 15C6.74995 15 9.74995 9 15 9C20.25 9 23.25 15 23.25 15C23.25 15 20.25 21 15 21C9.74995 21 6.74995 15 6.74995 15Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M15 17.25C16.2426 17.25 17.25 16.2426 17.25 15C17.25 13.7574 16.2426 12.75 15 12.75C13.7574 12.75 12.75 13.7574 12.75 15C12.75 16.2426 13.7574 17.25 15 17.25Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>}
                                    <div className="w-full grid place-items-center ">
                                        {biFront?.match(/\.(jpeg|jpg|gif|png)$/i) ? <img src={biFront} className="w-14 h-14  rounded-lg mt-5" /> :
                                            <a href={`${biFront}`} target="_blank" className=" cursor-pointer mt-9">
                                                <svg
                                                    className="" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </a>
                                        }

                                    </div>
                                </div>
                                <p className="font-semibold">{typeAccount === "User" ? (nacionalidade === "Nacional" ? "bilhete de identidade (frente)" : "cartão de residente") : "documento de identificação fiscal"}</p>
                                {/* <p>Tamanho: 2Mb</p> */}
                            </div>
                            <div className="text-[#4B5563]">
                                <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-[#D1D5DB] mt-4 relative">

                                    {biBack?.match(/\.(jpeg|jpg|gif|png)$/i) &&
                                        <div className="w-full flex justify-end p-1 absolute">
                                            <svg
                                                onClick={() => {
                                                    // Abre uma nova página com o iframe
                                                    const newWindow = window.open('', '_blank');
                                                    newWindow?.document.writeln(`
                                                                        <html>
                                                                            <head>
                                                                            <title>Visualizador de Documento</title>
                                                                            <style>
                                                                                body { margin: 0; padding: 0; overflow: hidden; height: 100vh; }
                                                                                img, object { max-width: 100%; max-height: 100vh; display: block; margin: 0 auto; }
                                                                            </style>
                                                                            </head>
                                                                            <body bgColor="#141f2b">
                                                                            ${biBack?.match(/\.(jpeg|jpg|gif|png)$/i)
                                                            ? `<img src="${biBack}" alt="Documento" />`
                                                            : `<object data="${biBack}" type="application/pdf" width="100%" height="100%">
                                                                                    <a href="${biBack}">Baixar documento</a>
                                                                                </object>`
                                                        }
                                                                            </body>
                                                                        </html>
                                                                        `)
                                                    newWindow?.document.close();
                                                }}
                                                className="bg-[#D9E0F2] text-[#2678F2] duration-300 hover:text-white rounded-full cursor-pointer hover:bg-[#2678F2] "
                                                width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="30" height="30" rx="15" fill-opacity="0.1" />
                                                <path d="M6.74995 15C6.74995 15 9.74995 9 15 9C20.25 9 23.25 15 23.25 15C23.25 15 20.25 21 15 21C9.74995 21 6.74995 15 6.74995 15Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M15 17.25C16.2426 17.25 17.25 16.2426 17.25 15C17.25 13.7574 16.2426 12.75 15 12.75C13.7574 12.75 12.75 13.7574 12.75 15C12.75 16.2426 13.7574 17.25 15 17.25Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>}

                                    <div className="w-full grid place-items-center">
                                        {biBack?.match(/\.(jpeg|jpg|gif|png)$/i) ? <img src={biBack} className="w-14 h-14  rounded-lg mt-5" /> :
                                            <a href={`${biBack}`} target="_blank" className=" cursor-pointer mt-9">
                                                <svg
                                                    className="" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </a>
                                        }
                                    </div>
                                </div>
                                <p className="font-semibold">{typeAccount === "User" ? (nacionalidade === "Nacional" ? "bilhete de identidade (verso)" : "passaporte") : "alvará comercial"}</p>
                                {/* <p >Tamanho: 2.5Mb</p> */}
                            </div>
                        </div>
                    </div>
                    {typeAccount === "User" && <div className="space-y-4 mb-10">
                        <p className="text-[#143163] font-semibold">Selfie</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>
                        <div className="text-[#4B5563] mt-8">
                            <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-[#D1D5DB] relative ">
                                {selfie?.match(/\.(jpeg|jpg|gif|png)$/i) && <div className="w-full flex justify-end p-1 absolute"
                                >
                                    <svg
                                        onClick={() => {
                                            // Abre uma nova página com o iframe
                                            const newWindow = window.open('', '_blank');
                                            newWindow?.document.writeln(`
                                                                        <html>
                                                                            <head>
                                                                            <title>Visualizador de Documento</title>
                                                                            <style>
                                                                                body { margin: 0; padding: 0; overflow: hidden; height: 100vh; }
                                                                                img, object { max-width: 100%; max-height: 100vh; display: block; margin: 0 auto; }
                                                                            </style>
                                                                            </head>
                                                                            <body bgColor="#141f2b">
                                                                            ${selfie?.match(/\.(jpeg|jpg|gif|png)$/i)
                                                    ? `<img src="${selfie}" alt="Documento" />`
                                                    : `<object data="${selfie}" type="application/pdf" width="100%" height="100%">
                                                                                    <a href="${selfie}">Baixar documento</a>
                                                                                </object>`
                                                }
                                                                            </body>
                                                                        </html>
                                                                        `)
                                            newWindow?.document.close();
                                        }}
                                        className="bg-[#D9E0F2] text-[#2678F2] duration-300 hover:text-white rounded-full cursor-pointer hover:bg-[#2678F2] "
                                        width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="30" height="30" rx="15" fill-opacity="0.1" />
                                        <path d="M6.74995 15C6.74995 15 9.74995 9 15 9C20.25 9 23.25 15 23.25 15C23.25 15 20.25 21 15 21C9.74995 21 6.74995 15 6.74995 15Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15 17.25C16.2426 17.25 17.25 16.2426 17.25 15C17.25 13.7574 16.2426 12.75 15 12.75C13.7574 12.75 12.75 13.7574 12.75 15C12.75 16.2426 13.7574 17.25 15 17.25Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>}
                                <div className="w-full grid place-items-center">
                                    {selfie?.match(/\.(jpeg|jpg|gif|png)$/i) ? <img src={selfie} className="w-14 h-14  rounded-lg mt-5" /> :
                                        <a href={`${selfie}`} target="_blank" className=" cursor-pointer mt-9">
                                            <svg
                                                className="" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </a>
                                    }
                                </div>
                            </div>
                            <p className="font-semibold">selfie</p>
                            {/* <p>Tamanho: 2Mb</p> */}
                        </div>
                    </div>}
                    {level_up
                        //|| statusAccount === "Pendente"
                        &&

                        <div className="space-y-5">
                            <button onClick={validarDocumento} className=" w-full p-2   rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                                type="button">
                                {loading ?
                                    <div className="flex justify-center items-center">
                                        <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                    </div> : "Validar Documentos"
                                }
                            </button>

                        </div>}

                </div>
                )
            }

            {nenhumDocumento ? "" : (level_up && !motivoRecusa) &&
                <button onClick={() => setMotivoRecusa(true)} className=" w-full p-2 mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                    type="button">
                    Recusar Documentos
                </button>}

            {motivoRecusa &&
                <div className="space-y-4 mt-5">
                    <p className="text-[#143163] font-semibold">Recusar Documentos Submetidos</p>
                    <div className="ring-[0.5px] ring-[#A9B8CF] w-full"></div>
                    <div className="mt-10 text-[#143163]">
                        <label className="text-sm font-semibold">Motivo da Recusa</label>
                        <div className="h-1"></div>
                        <Select onValueChange={setRazaoRecusa}>
                            <SelectTrigger className="w-full text-[#143163]">
                                <SelectValue placeholder="Selecionar Motivo..." />
                            </SelectTrigger>
                            <SelectContent className="text-[#143163]">
                                <SelectItem value="Documentos ilejiveis">Documentos ilejiveis</SelectItem>
                                <SelectItem value="Docmunetos falsos">Docmunetos falsos</SelectItem>
                                <SelectItem value="Documentos não coincidem">Documentos não coincidem</SelectItem>
                                <SelectItem value="Documentos inválidos">Documentos inválidos</SelectItem>
                                <SelectItem value="Outros Motivos">Outros motivos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <button onClick={recusarDocumento} className="mt-10  w-full p-2 mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        type="button">
                        {loadingReject ?
                            <div className="flex justify-center items-center">
                                <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                            </div> : "Solicitar Reenvio"
                        }
                    </button>
                </div>
            }
        </>
    )
}
