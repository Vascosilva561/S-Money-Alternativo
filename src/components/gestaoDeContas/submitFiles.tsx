import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type props = {
    otherData: any,
    onClose: () => void
    setDadosUser: (e: any) => void
    idUser: string,
    clearInputs: () => void,
    typeAccount: string,
    onCancel: () => void
}

export default function EditFiles({ otherData, onClose, setDadosUser, idUser, clearInputs, typeAccount, onCancel }: props) {
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [formDataFiles, setFormDataFiles] = useState({
        biFront: null,
        biBack: null,
        selfie: null,
    }) as any
    const [selectedFileFront, setSelectedFileFront] = useState() as any
    const [selectedFileBack, setSelectedFileBack] = useState() as any
    const [selectedFileSelfie, setSelectedFileSelfie] = useState() as any

    // console.log(otherData)

    const handlFileChangeFront = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {

            setSelectedFileFront(e.target.files[0])

            setFormDataFiles({ ...formDataFiles, biFront: e.target.files[0] })
            //setChangeIconFileFront(true)

        }
    }


    const handlFileChangeBack = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {

            setSelectedFileBack(e.target.files[0])
            setFormDataFiles({ ...formDataFiles, biBack: e.target.files[0] })
            //setChangeIconFileBack(true)
        }
    }

    const handlFileChangeSelfie = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {

            setSelectedFileSelfie(e.target.files[0])
            setFormDataFiles({ ...formDataFiles, selfie: e.target.files[0] })
            //setChangeIconFileBack(true)

        }
    }

    // console.log(selectedFileBack, selectedFileFront, selectedFileSelfie)
    const submitFiles = async (e: any) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('biBackFile', formDataFiles.biBack || "")
        formData.append('biFrontFile', formDataFiles.biFront || "")
        formData.append('selfieFile', formDataFiles.selfie || "")
        formData.append("account_type", "User")
        //formData.append("city", otherData?.municipio)
        //formData.append("country", otherData?.nacionalidade)
        // formData.append("address", otherData?.morada)
        formData.append("user", idUser)
        //formData.append("nacionalidade", otherData?.nacionalidade !== "Angola" ? "Estrangeiro" : "Nacional")
        //formData.append("birthday", otherData?.nascimento)
        // formData.append("province", otherData?.provincia_nome)

        const formDataMerchants = new FormData()
        formDataMerchants.append('biBackFile', formDataFiles.biBack || "")
        formDataMerchants.append('biFrontFile', formDataFiles.biFront || "")
        formDataMerchants.append("account_type", "Merchant")
        //formDataMerchants.append("city", otherData?.municipio)
        //formDataMerchants.append("address", otherData?.morada)
        formDataMerchants.append("user", idUser)
        // formDataMerchants.append("province", otherData?.provincia_nome)

        const body = typeAccount === "User" ? formData : formDataMerchants

        try {

            setLoading(true)
            //await api.put(`/front/user`)

            await api.post(`/front/user/upload`, body, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            // console.log(data)
            queryClient.invalidateQueries({
                queryKey: ['listaDeContas'],
                //exact: true,
            })

            clearInputs()
            setDadosUser(true)
            onClose()

            toast.success(`Ficheiros submetidos com sucesso!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },
                duration: 2000

            })
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log(error)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.errors[0]?.message
                console.log(message)
                toast.error(`${message || "Erro ao adionar, por favor, tente novamente."}`, {
                    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="30" height="30" rx="4" fill="#FF0000" fill-opacity="0.1" />
                        <path d="M14.75 4C8.822 4 4 8.823 4 14.75C4 20.677 8.822 25.5 14.75 25.5C20.678 25.5 25.5 20.677 25.5 14.75C25.5 8.823 20.678 4 14.75 4ZM14.75 24C9.649 24 5.5 19.851 5.5 14.75C5.5 9.649 9.649 5.5 14.75 5.5C19.851 5.5 24 9.649 24 14.75C24 19.851 19.851 24 14.75 24ZM18.28 12.28L15.81 14.75L18.28 17.22C18.573 17.513 18.573 17.988 18.28 18.281C18.134 18.427 17.942 18.501 17.75 18.501C17.558 18.501 17.366 18.428 17.22 18.281L14.75 15.811L12.28 18.281C12.134 18.427 11.942 18.501 11.75 18.501C11.558 18.501 11.366 18.428 11.22 18.281C10.927 17.988 10.927 17.513 11.22 17.22L13.69 14.75L11.22 12.28C10.927 11.987 10.927 11.512 11.22 11.219C11.513 10.926 11.988 10.926 12.281 11.219L14.751 13.689L17.221 11.219C17.514 10.926 17.989 10.926 18.282 11.219C18.573 11.512 18.573 11.988 18.28 12.28Z" fill="#FF5656" />
                    </svg>

                    ,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 2000

                })
            }
        }
    }

    const handleDragOverFront = (e: any) => {
        e.preventDefault()
    }
    const handleDropFront = async (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setSelectedFileFront(file)
        setFormDataFiles({ ...formDataFiles, biFront: file })
    }
    const handleDragOverBack = (e: any) => {
        e.preventDefault()
    }
    const handleDropBack = async (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setSelectedFileBack(file)
        setFormDataFiles({ ...formDataFiles, biBack: file })
    }
    const handleDragOverSelfie = (e: any) => {
        e.preventDefault()
    }

    const handleDropSelfie = async (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setSelectedFileSelfie(file)
        setFormDataFiles({ ...formDataFiles, selfie: file })
    }

    function clearBiFront() {
        setSelectedFileFront(null)
        setFormDataFiles({ ...formDataFiles, biFront: null })

    }

    function clearBiBack() {
        setSelectedFileBack(null)
        setFormDataFiles({ ...formDataFiles, biBack: null })

    }

    function clearBiSelf() {
        setSelectedFileSelfie(null)
        setFormDataFiles({ ...formDataFiles, selfie: null })

    }
    return (
        <>
            {typeAccount === "User" ? <div >
                <div className="flex flex-col space-y-2 mt-6">
                    <label className="text-[#143163] font-semibold text-sm">{otherData?.user_document?.nacionalidade !== "Nacional" ? "Cartão de Residente" : "Bilhete de Identidade (Frente)"}</label>
                    <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
                     ${selectedFileFront ? "bg-[#F6F5FA]" : "bg-white border-dashed"}`}>
                        <label className={`w-full flex flex-col place-items-center
                   `}
                            onDragOver={handleDragOverFront}
                            onDrop={handleDropFront}
                        >

                            <input
                                className="hidden"
                                type="file"
                                onChange={handlFileChangeFront}
                            />
                            {!selectedFileFront &&
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.46997 6.53002C8.17697 6.23702 8.17697 5.76199 8.46997 5.46899L11.47 2.46899C11.539 2.39999 11.6221 2.345 11.7141 2.307C11.8971 2.231 12.1041 2.231 12.2871 2.307C12.3791 2.345 12.462 2.39999 12.531 2.46899L15.531 5.46899C15.824 5.76199 15.824 6.23702 15.531 6.53002C15.385 6.67602 15.193 6.74999 15.001 6.74999C14.809 6.74999 14.6169 6.67702 14.4709 6.53002L12.751 4.80999V16C12.751 16.414 12.415 16.75 12.001 16.75C11.587 16.75 11.251 16.414 11.251 16V4.81097L9.53101 6.531C9.23701 6.823 8.76297 6.82302 8.46997 6.53002ZM18 9.24999C17.586 9.24999 17.25 9.58599 17.25 9.99999C17.25 10.414 17.586 10.75 18 10.75C19.577 10.75 20.25 11.423 20.25 13V18C20.25 19.577 19.577 20.25 18 20.25H6C4.423 20.25 3.75 19.577 3.75 18V13C3.75 11.423 4.423 10.75 6 10.75C6.414 10.75 6.75 10.414 6.75 9.99999C6.75 9.58599 6.414 9.24999 6 9.24999C3.582 9.24999 2.25 10.582 2.25 13V18C2.25 20.418 3.582 21.75 6 21.75H18C20.418 21.75 21.75 20.418 21.75 18V13C21.75 10.582 20.418 9.24999 18 9.24999Z" fill="#487FFF" />
                                    </svg>
                                    <p className="text-[#143163] text-sm">Arraste ou clique para carregar um ficheiro...</p>
                                </div>

                            }

                        </label>
                        {selectedFileFront &&
                            <div className="flex justify-between items-center w-full z-40">
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM16.75 12C16.75 12.414 16.414 12.75 16 12.75H9C8.586 12.75 8.25 12.414 8.25 12C8.25 11.586 8.586 11.25 9 11.25H16C16.414 11.25 16.75 11.586 16.75 12ZM13.75 16C13.75 16.414 13.414 16.75 13 16.75H9C8.586 16.75 8.25 16.414 8.25 16C8.25 15.586 8.586 15.25 9 15.25H13C13.414 15.25 13.75 15.586 13.75 16Z" fill="#487FFF" />
                                    </svg>

                                    <p className="text-[#143163] text-sm">{selectedFileFront?.name}</p>
                                </div>
                                <svg onClick={clearBiFront} className="cursor-pointer " width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.5297 17.47C18.8227 17.763 18.8227 18.238 18.5297 18.531C18.3837 18.677 18.1917 18.751 17.9997 18.751C17.8077 18.751 17.6158 18.678 17.4698 18.531L11.9997 13.061L6.52975 18.531C6.38375 18.677 6.19175 18.751 5.99975 18.751C5.80775 18.751 5.61575 18.678 5.46975 18.531C5.17675 18.238 5.17675 17.763 5.46975 17.47L10.9398 12L5.46975 6.53005C5.17675 6.23705 5.17675 5.76202 5.46975 5.46902C5.76275 5.17602 6.23775 5.17602 6.53075 5.46902L12.0008 10.939L17.4707 5.46902C17.7637 5.17602 18.2387 5.17602 18.5317 5.46902C18.8247 5.76202 18.8247 6.23705 18.5317 6.53005L13.0617 12L18.5297 17.47Z" fill="#4B5563" />
                                </svg>
                            </div>
                        }
                    </div>
                </div>

                <div className="flex flex-col space-y-2 mt-6">
                    <label className="text-[#143163] font-semibold text-sm">{otherData?.user_document?.nacionalidade !== "Nacional" ? "Passaporte" : "Bilhete de Identidade (Verso)"}</label>
                    <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
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
                    </div>
                </div>

                <div className="flex flex-col space-y-2 mt-6">
                    <label className="text-[#143163] font-semibold text-sm">Selfie</label>
                    <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
                     ${selectedFileSelfie ? "bg-[#F6F5FA]" : "bg-white border-dashed"}`}>
                        <label className={`w-full flex flex-col place-items-center
                   `}
                            onDragOver={handleDragOverSelfie}
                            onDrop={handleDropSelfie}
                        >

                            <input
                                className="hidden"
                                type="file"
                                onChange={handlFileChangeSelfie}
                            />
                            {!selectedFileSelfie &&
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.46997 6.53002C8.17697 6.23702 8.17697 5.76199 8.46997 5.46899L11.47 2.46899C11.539 2.39999 11.6221 2.345 11.7141 2.307C11.8971 2.231 12.1041 2.231 12.2871 2.307C12.3791 2.345 12.462 2.39999 12.531 2.46899L15.531 5.46899C15.824 5.76199 15.824 6.23702 15.531 6.53002C15.385 6.67602 15.193 6.74999 15.001 6.74999C14.809 6.74999 14.6169 6.67702 14.4709 6.53002L12.751 4.80999V16C12.751 16.414 12.415 16.75 12.001 16.75C11.587 16.75 11.251 16.414 11.251 16V4.81097L9.53101 6.531C9.23701 6.823 8.76297 6.82302 8.46997 6.53002ZM18 9.24999C17.586 9.24999 17.25 9.58599 17.25 9.99999C17.25 10.414 17.586 10.75 18 10.75C19.577 10.75 20.25 11.423 20.25 13V18C20.25 19.577 19.577 20.25 18 20.25H6C4.423 20.25 3.75 19.577 3.75 18V13C3.75 11.423 4.423 10.75 6 10.75C6.414 10.75 6.75 10.414 6.75 9.99999C6.75 9.58599 6.414 9.24999 6 9.24999C3.582 9.24999 2.25 10.582 2.25 13V18C2.25 20.418 3.582 21.75 6 21.75H18C20.418 21.75 21.75 20.418 21.75 18V13C21.75 10.582 20.418 9.24999 18 9.24999Z" fill="#487FFF" />
                                    </svg>
                                    <p className="text-[#143163] text-sm">Arraste ou clique para carregar um ficheiro...</p>
                                </div>

                            }

                        </label>
                        {selectedFileSelfie &&
                            <div className="flex justify-between items-center w-full z-40">
                                <div className="flex justify-start w-full items-center space-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM16.75 12C16.75 12.414 16.414 12.75 16 12.75H9C8.586 12.75 8.25 12.414 8.25 12C8.25 11.586 8.586 11.25 9 11.25H16C16.414 11.25 16.75 11.586 16.75 12ZM13.75 16C13.75 16.414 13.414 16.75 13 16.75H9C8.586 16.75 8.25 16.414 8.25 16C8.25 15.586 8.586 15.25 9 15.25H13C13.414 15.25 13.75 15.586 13.75 16Z" fill="#487FFF" />
                                    </svg>

                                    <p className="text-[#143163] text-sm">{selectedFileSelfie?.name}</p>
                                </div>
                                <svg onClick={clearBiSelf} className="cursor-pointer " width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.5297 17.47C18.8227 17.763 18.8227 18.238 18.5297 18.531C18.3837 18.677 18.1917 18.751 17.9997 18.751C17.8077 18.751 17.6158 18.678 17.4698 18.531L11.9997 13.061L6.52975 18.531C6.38375 18.677 6.19175 18.751 5.99975 18.751C5.80775 18.751 5.61575 18.678 5.46975 18.531C5.17675 18.238 5.17675 17.763 5.46975 17.47L10.9398 12L5.46975 6.53005C5.17675 6.23705 5.17675 5.76202 5.46975 5.46902C5.76275 5.17602 6.23775 5.17602 6.53075 5.46902L12.0008 10.939L17.4707 5.46902C17.7637 5.17602 18.2387 5.17602 18.5317 5.46902C18.8247 5.76202 18.8247 6.23705 18.5317 6.53005L13.0617 12L18.5297 17.47Z" fill="#4B5563" />
                                </svg>
                            </div>
                        }
                    </div>
                </div>

            </div> :
                <div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">Documento de Identificação Fiscal (NIF)</label>
                        <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
                     ${selectedFileFront ? "bg-[#F6F5FA]" : "bg-white border-dashed"}`}>
                            <label className={`w-full flex flex-col place-items-center
                   `}
                                onDragOver={handleDragOverFront}
                                onDrop={handleDropFront}
                            >

                                <input
                                    className="hidden"
                                    type="file"
                                    onChange={handlFileChangeFront}
                                />
                                {!selectedFileFront &&
                                    <div className="flex justify-start w-full items-center space-x-1">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.46997 6.53002C8.17697 6.23702 8.17697 5.76199 8.46997 5.46899L11.47 2.46899C11.539 2.39999 11.6221 2.345 11.7141 2.307C11.8971 2.231 12.1041 2.231 12.2871 2.307C12.3791 2.345 12.462 2.39999 12.531 2.46899L15.531 5.46899C15.824 5.76199 15.824 6.23702 15.531 6.53002C15.385 6.67602 15.193 6.74999 15.001 6.74999C14.809 6.74999 14.6169 6.67702 14.4709 6.53002L12.751 4.80999V16C12.751 16.414 12.415 16.75 12.001 16.75C11.587 16.75 11.251 16.414 11.251 16V4.81097L9.53101 6.531C9.23701 6.823 8.76297 6.82302 8.46997 6.53002ZM18 9.24999C17.586 9.24999 17.25 9.58599 17.25 9.99999C17.25 10.414 17.586 10.75 18 10.75C19.577 10.75 20.25 11.423 20.25 13V18C20.25 19.577 19.577 20.25 18 20.25H6C4.423 20.25 3.75 19.577 3.75 18V13C3.75 11.423 4.423 10.75 6 10.75C6.414 10.75 6.75 10.414 6.75 9.99999C6.75 9.58599 6.414 9.24999 6 9.24999C3.582 9.24999 2.25 10.582 2.25 13V18C2.25 20.418 3.582 21.75 6 21.75H18C20.418 21.75 21.75 20.418 21.75 18V13C21.75 10.582 20.418 9.24999 18 9.24999Z" fill="#487FFF" />
                                        </svg>
                                        <p className="text-[#143163] text-sm">Arraste ou clique para carregar um ficheiro...</p>
                                    </div>

                                }

                            </label>
                            {selectedFileFront &&
                                <div className="flex justify-between items-center w-full z-40">
                                    <div className="flex justify-start w-full items-center space-x-1">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.53 8.47L14.53 2.47C14.389 2.329 14.199 2.25 14 2.25H8C5.582 2.25 4.25 3.582 4.25 6V18C4.25 20.418 5.582 21.75 8 21.75H17C19.418 21.75 20.75 20.418 20.75 18V9C20.75 8.801 20.671 8.61 20.53 8.47ZM14.75 4.811L18.189 8.25H17C15.423 8.25 14.75 7.577 14.75 6V4.811ZM17 20.25H8C6.423 20.25 5.75 19.577 5.75 18V6C5.75 4.423 6.423 3.75 8 3.75H13.25V6C13.25 8.418 14.582 9.75 17 9.75H19.25V18C19.25 19.577 18.577 20.25 17 20.25ZM16.75 12C16.75 12.414 16.414 12.75 16 12.75H9C8.586 12.75 8.25 12.414 8.25 12C8.25 11.586 8.586 11.25 9 11.25H16C16.414 11.25 16.75 11.586 16.75 12ZM13.75 16C13.75 16.414 13.414 16.75 13 16.75H9C8.586 16.75 8.25 16.414 8.25 16C8.25 15.586 8.586 15.25 9 15.25H13C13.414 15.25 13.75 15.586 13.75 16Z" fill="#487FFF" />
                                        </svg>

                                        <p className="text-[#143163] text-sm">{selectedFileFront?.name}</p>
                                    </div>
                                    <svg onClick={clearBiFront} className="cursor-pointer " width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.5297 17.47C18.8227 17.763 18.8227 18.238 18.5297 18.531C18.3837 18.677 18.1917 18.751 17.9997 18.751C17.8077 18.751 17.6158 18.678 17.4698 18.531L11.9997 13.061L6.52975 18.531C6.38375 18.677 6.19175 18.751 5.99975 18.751C5.80775 18.751 5.61575 18.678 5.46975 18.531C5.17675 18.238 5.17675 17.763 5.46975 17.47L10.9398 12L5.46975 6.53005C5.17675 6.23705 5.17675 5.76202 5.46975 5.46902C5.76275 5.17602 6.23775 5.17602 6.53075 5.46902L12.0008 10.939L17.4707 5.46902C17.7637 5.17602 18.2387 5.17602 18.5317 5.46902C18.8247 5.76202 18.8247 6.23705 18.5317 6.53005L13.0617 12L18.5297 17.47Z" fill="#4B5563" />
                                    </svg>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                        <label className="text-[#143163] font-semibold text-sm">Alvará Comercial</label>
                        <div className={`p-2 border-2 border-[#CFD7E5] rounded w-full
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
                        </div>
                    </div>

                </div>

            }

            <div className="ui-document-edit-actions mt-8 grid grid-cols-2 gap-2 border-t border-[#E5EBF4] pt-4">
                <Button type="button" variant="outline" className="ui-modal-neutral-action h-11 w-full rounded-[8px]" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="button" variant="brand" className="h-11 w-full rounded-lg font-semibold" onClick={submitFiles} disabled={loading}>
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="size-5 rounded-full border-2 border-t-transparent border-current animate-spin" />
                        </div>
                    ) : "Salvar Alterações"}
                </Button>
            </div>


        </>
    )
}
