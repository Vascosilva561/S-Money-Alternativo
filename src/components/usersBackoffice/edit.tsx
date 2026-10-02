import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState, useTransition } from "react"
import provinvia from "../json/provincias.json"
import municipios from "../json/municipios.json"
import { api } from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any

}


export default function EditUsersManagers({ onClose, isOpen, itemSelected }: props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cargo: "",
        estado: "",
        municipio: "",
        provincia_id: "",
        provincia_nome: "",
        endereco: "",
        palavraPasse: "",
        confirmPalavraPasse: "",
        bi: "",
        telefone: "",
        telefoneEmpresa: ""

    })
    const [statusErro, setStatusErro] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isShowConfirm, setIsShowConfirm] = useState(false)
    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(formData.provincia_id)) // retorna a lista de municipios da provincia selecionada
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(formData?.provincia_id);
    }); // retorna o objecto da provincia selecionada
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setFormData({ ...formData, provincia_nome: nomeProvincia[0]?.nome })
    }, [formData.provincia_id])

    const clearInputs = () => {
        setFormData({
            ...formData,
            name: "",
            email: "",
            cargo: "",
            estado: "",
            municipio: "",
            provincia_id: "",
            provincia_nome: "",
            endereco: "",
            palavraPasse: "",
            confirmPalavraPasse: "",
            bi: "",
            telefone: "",
            telefoneEmpresa: ""
        })
    }
    const idProvince = provinvia?.provincia?.filter((item) => item?.nome === itemSelected?.provincia)

    useEffect(() => {
        if (itemSelected) {
            setFormData({
                ...formData,
                name: itemSelected?.name || "",
                email: itemSelected?.email || "",
                cargo: itemSelected?.account_type || "",
                estado: itemSelected?.active || "",
                municipio: itemSelected?.municipio || "",
                provincia_id: String(idProvince[0]?.id) || "",
                provincia_nome: itemSelected?.provincia || "",
                endereco: itemSelected?.address || "",
                palavraPasse: "",
                confirmPalavraPasse: "",
                bi: itemSelected?.bi_number || "",
                telefone: itemSelected?.phone_number || "",
                telefoneEmpresa: itemSelected?.tel_empresa || ""
            });
        }

    }, [itemSelected])

    const [_isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()

    async function updateUser(e: any) {
        e.preventDefault()
        if (formData?.palavraPasse !== formData.confirmPalavraPasse) {
            setStatusErro(true)
            return
        }
        if (formData?.cargo === "") {
            toast.error(`Selecione o cargo do utilizador backoffice`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                </svg>,
                style: {
                    borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                },
                duration: 2000

            })
            return
        }
        try {
            const body = {
                email: formData?.email,
                phone_number: formData.telefone,
                tel_empresa: formData.telefoneEmpresa,
                account_type: formData.cargo,
                active: formData.estado,
                password: formData.palavraPasse,
                password_confirmation: formData.confirmPalavraPasse,
                name: formData.name,
                provincia: formData.provincia_nome,
                bi_number: formData.bi,
                municipio: formData.municipio,
                address: formData.endereco
            }
            setLoading(true)
            await api.put(`/front/managers/${itemSelected?.id}`, body)
            startTransition(() => {
                queryClient.invalidateQueries({
                    queryKey: ['ListaDeUtilizadoresBackOffice'],
                })
            })
            clearInputs()
            onClose()
            toast.success(`Utilizador backoffice editado com sucesso!`, {
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
                const message = error?.response?.data?.errors[0]?.message

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
            setLoading(false);
        }
    }

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-edit-sheet pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Actualize os dados deste registo e guarde as alterações.">Editar utilizador backoffice</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <form onSubmit={updateUser}>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Utilizador backoffice</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Bilhete de Identidade</label>
                                <input type="text" maxLength={14} value={formData.bi} onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>

                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Email Corporativo</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Cargo</label>
                            <Select onValueChange={(value) => setFormData({ ...formData, cargo: value })} value={formData?.cargo}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="callcenter">Call center</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Número Empresarial</label>
                                <input type="number" value={formData.telefoneEmpresa} onChange={(e) => setFormData({ ...formData, telefoneEmpresa: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Número Particular</label>
                                <input type="number" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Província</label>
                                <select value={formData.provincia_id} onChange={(e) => setFormData({ ...formData, provincia_id: e.target.value })}
                                    className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                    <option value="" disabled hidden>
                                        Selecione...
                                    </option>
                                    {provinvia?.provincia?.map((item) => (
                                        <option key={item?.id} value={item?.id}>
                                            {item?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Município</label>
                                <select value={formData.municipio} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                    className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                    <option value="" disabled hidden>
                                        Selecione...
                                    </option>
                                    {municipioLista?.map((item) => (
                                        <option key={item?.id} value={item?.nome}>
                                            {item?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-[14px]">Endereço Profissional</label>
                            <input type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        <div className="flex flex-col space-y-2 mt-4 font-semibold">
                            <label className="text-[#143163] text-[14px]">Palavra-passe</label>
                            <div className="relative block  rounded-lg items-center">

                                <input value={formData.palavraPasse} onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, palavraPasse: e.target.value })} type={isShow ? "text" : "password"}
                                    className={`p-2 rounded-[6px] ring-1 ${statusErro ? "ring-[#EF4A00]" : "ring-[#ADCBD0]"} focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm block pr-12 w-full`} />

                                <button onClick={() => setIsShow(!isShow)} type="button" className="absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                    {isShow ? <svg className="animate-fadeIn mr-3" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                    </svg> :

                                        <svg className="animate-fadeIn mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                        </svg>
                                    }

                                </button>

                            </div>

                        </div>
                        <div className="flex flex-col space-y-2 mt-4 font-semibold">
                            <label className="text-[#143163] text-[14px]">Repetir Palavra-passe</label>
                            <div className="relative block  rounded-lg items-center">

                                <input value={formData.confirmPalavraPasse} onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, confirmPalavraPasse: e.target.value })}
                                    type={isShowConfirm ? "text" : "password"}
                                    className={`p-2 rounded-[6px] ring-1 ${statusErro ? "ring-[#EF4A00]" : "ring-[#ADCBD0]"} focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm block pr-12 w-full`} />

                                <button onClick={() => setIsShowConfirm(!isShowConfirm)} type="button" className="absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                    {isShowConfirm ? <svg className="animate-fadeIn mr-3" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                    </svg> :

                                        <svg className="animate-fadeIn mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                        </svg>
                                    }

                                </button>

                            </div>

                        </div>

                        {statusErro && <p className="text-[#EF4A00] text-[12px] mt-1">Senhas não coincidem!</p>}

                        {<Button className=" w-full p-2 mt-[60px] rounded-[6px] mb-10 cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                            type="submit" variant="brand">
                            {loading ?
                                <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                </div> : "Salvar Alterações"
                            }
                        </Button>}
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
