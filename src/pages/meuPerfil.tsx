import { useEffect, useState } from "react";
import provinvia from "../components/json/provincias.json"
import municipios from "../components/json/municipios.json"
import { DetailsUser } from "@/hooks/getDetails";
import { api } from "@/api";
import { Spinner } from "@/components/utils/spinner";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { UserAvatarPerfil } from "@/components/utils/avatarPerfil";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";


const abas = [
    { id: 'Perfil', label: 'Editar Perfil', currentValue: 0 },
    { id: 'PalavraPasse', label: 'Alterar Palavra-passe', currentValue: 1 },

];

export default function MeuPerfil() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        municipio: "",
        provincia_id: "",
        provincia_nome: "",
        endereco: "",
        bi: "",
        telefone: "",
        telefoneEmpresa: "",
        palavraPasseAntiga: "",
        confirmaPalavraPasse: "",
        novaPalavraPasse: ""

    })
    const [statusErro, setStatusErro] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isShowNew, setIsShowNew] = useState(false)
    const [isShowConfirm, setIsShowConfirm] = useState(false)
    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(formData.provincia_id)) // retorna a lista de municipios da provincia selecionada
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(formData?.provincia_id);
    }); // retorna o objecto da provincia selecionada

    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const [editSenha, setEditSenha] = useState(false)
    const { details, isLoading } = DetailsUser()
    const idProvince = provinvia?.provincia?.filter((item) => item?.nome === details?.provincia)
    const queryClient = useQueryClient()


    useEffect(() => {
        setFormData({ ...formData, provincia_nome: nomeProvincia[0]?.nome })
    }, [formData.provincia_id])

    useEffect(() => {
        if (details) {
            setFormData((prev) => ({
                ...prev,
                name: details.name || "",
                email: details.email || "",
                municipio: details.municipio || "",
                provincia_nome: details.provincia || "",
                provincia_id: String(idProvince[0]?.id) || "",
                endereco: details.address || "",
                bi: details.bi_number || "",
                telefone: details.phone_number || "",
                telefoneEmpresa: details.tel_empresa || ""
            }));
        }

    }, [details])

    const [formDataFiles, setFormDataFiles] = useState({
        file: null,
    }) as any

    const [preview, setPreview] = useState<string | File | null | undefined>(null);
    const [isFileChanged, setIsFileChanged] = useState(false);

    useEffect(() => {
        setPreview(details?.photo)
        setFormDataFiles({ ...formDataFiles, file: details?.photo })
        setIsFileChanged(false)
    }, [details])



    const handlFileChange = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFormDataFiles({ ...formDataFiles, file: e.target.files[0] })
            setPreview(file); // cria URL temporária
            setIsFileChanged(true)
        }
    }
    const handleDragOver = (e: any) => {
        e.preventDefault()
    }
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        setFormDataFiles({ ...formDataFiles, file: file })
        setPreview(file)
        setIsFileChanged(true)

    }

    const editUser = async (e: any) => {
        e.preventDefault()
        const body = {
            name: formData.name,
            email: formData.email,
            municipio: formData.municipio,
            provincia: formData.provincia_nome,
            address: formData.endereco,
            bi_number: formData.bi,
            phone_number: formData.telefone,
            tel_empresa: formData.telefoneEmpresa

        }
        const photo = new FormData()
        photo.append("file", formDataFiles?.file)

        try {
            setLoading(true)
            if (isFileChanged && formDataFiles?.file instanceof File) {
                await api.post(`/front/manager/photoUpdate`, photo, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
            }

            await api.put(`/front/managers/${details?.id}`, body)
            setEdit(false)
            setLoading(false)
            queryClient.invalidateQueries({ queryKey: ['detailsUser'] })

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
            setLoading(false)
            console.log(error)
            toast.error(`Erro ao Salvar`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                </svg>,
                style: {
                    borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                },
                duration: 2000

            })
        }
    }

    const submitSenha = async (e: any) => {
        e.preventDefault()
        if (formData?.novaPalavraPasse !== formData?.confirmaPalavraPasse) {
            setStatusErro(true)
            return
        }
        if (!formData?.confirmaPalavraPasse || !formData?.novaPalavraPasse || !formData?.palavraPasseAntiga) {
            toast.error(`Preencha todos os campos`, {
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
        const body = {
            password_actual: formData.palavraPasseAntiga,
            password: formData.novaPalavraPasse,
            password_confirmation: formData?.confirmaPalavraPasse
        }
        try {
            setLoading(true)
            await api.patch(`/front/managers/update_password`, body)
            setEditSenha(false)
            setLoading(false)
            toast.success(`Palavra-passe alterada com sucesso!`, {
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
            setLoading(false)
            console.log(error)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.mensagem

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
        }
    }


    const [abaAtiva, setAbaAtiva] = useState('Perfil');
    const [current, setCurrent] = useState(0)
    return (
        <section className="ui-profile-layout">

            <div className="ui-profile-card bg-white p-5 text-sm">
                {isLoading ? <><Spinner width="8" height="8" color="#143163" /></> :
                    <div className="ui-profile-card-content flex flex-col space-y-4">
                        <div className="ui-profile-identity text-center space-y-3 items-center mt-12">
                            <div className="w-full grid place-items-center ">
                                <div className="relative ring-1 ring-[#A9B8CF] rounded-full overflow-hidden">
                                    <div className="w-[120px] h-[120px] object-cover lg:flex rounded-full border-2 items-center justify-center">
                                        <UserAvatarPerfil photo={details?.photo} />
                                    </div>
                                </div>

                            </div>

                            <p className="text-[#143163] font-semibold text-lg">{details?.name}</p>
                            <p className="text-[#4B5563]">{details?.account_type === "admin" ? "Admin" : details?.account_type}</p>
                        </div>

                        <div className="ui-profile-divider w-full mb-5 "></div>
                        <div className="ui-profile-details p-5 w-full mb-[10px]">
                            <p className="ui-profile-section-title text-[#143163] mb-2 font-semibold text-lg">Informações Pessoais</p>
                            <div className="ui-profile-info-list">

                                <div className="text-[#143163]  flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.25548 11.0459C7.04273 11.0459 6.05641 10.0586 6.05641 8.84586C6.05641 7.63311 7.04273 6.64583 8.25548 6.64583C9.46823 6.64583 10.4555 7.63311 10.4555 8.84586C10.4555 10.0586 9.46823 11.0459 8.25548 11.0459ZM8.25548 8.02083C7.80082 8.02083 7.43141 8.39119 7.43141 8.84586C7.43141 9.30052 7.80082 9.67088 8.25548 9.67088C8.71015 9.67088 9.08051 9.30052 9.08051 8.84586C9.08051 8.39119 8.71015 8.02083 8.25548 8.02083ZM11 15.3542C10.6205 15.3542 10.3125 15.0462 10.3125 14.6667V14.3889C10.3125 13.7289 9.85694 13.0625 8.83853 13.0625H7.66243C6.64401 13.0625 6.1884 13.7289 6.1884 14.3889V14.6667C6.1884 15.0462 5.8804 15.3542 5.5009 15.3542C5.1214 15.3542 4.8134 15.0462 4.8134 14.6667V14.3889C4.8134 13.0469 5.79151 11.6875 7.66243 11.6875H8.83853C10.7094 11.6875 11.6875 13.046 11.6875 14.3889V14.6667C11.6875 15.0462 11.3795 15.3542 11 15.3542ZM16.5 18.5625H5.5C3.2835 18.5625 2.0625 17.3415 2.0625 15.125V6.875C2.0625 4.6585 3.2835 3.4375 5.5 3.4375H16.5C18.7165 3.4375 19.9375 4.6585 19.9375 6.875V15.125C19.9375 17.3415 18.7165 18.5625 16.5 18.5625ZM5.5 4.8125C4.05442 4.8125 3.4375 5.42942 3.4375 6.875V15.125C3.4375 16.5706 4.05442 17.1875 5.5 17.1875H16.5C17.9456 17.1875 18.5625 16.5706 18.5625 15.125V6.875C18.5625 5.42942 17.9456 4.8125 16.5 4.8125H5.5ZM17.1875 9.10982C17.1875 8.73032 16.8795 8.42232 16.5 8.42232H12.8333C12.4538 8.42232 12.1458 8.73032 12.1458 9.10982C12.1458 9.48932 12.4538 9.79732 12.8333 9.79732H16.5C16.8795 9.79732 17.1875 9.48932 17.1875 9.10982ZM17.1417 12.8333C17.1417 12.4538 16.8337 12.1458 16.4542 12.1458H13.7042C13.3247 12.1458 13.0167 12.4538 13.0167 12.8333C13.0167 13.2128 13.3247 13.5208 13.7042 13.5208H16.4542C16.8337 13.5208 17.1417 13.2128 17.1417 12.8333Z" fill="#2678F2" />
                                        </svg>

                                        <p className="font-semibold">Bilhete de Identidade:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.bi_number}</p>
                                </div>
                                <div className="text-[#143163] space-x-4 flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.5 19.0234H5.5C3.2835 19.0234 2.0625 17.8024 2.0625 15.5859V7.33594C2.0625 5.11944 3.2835 3.89844 5.5 3.89844H16.5C18.7165 3.89844 19.9375 5.11944 19.9375 7.33594V15.5859C19.9375 17.8024 18.7165 19.0234 16.5 19.0234ZM5.5 5.27344C4.05442 5.27344 3.4375 5.89035 3.4375 7.33594V15.5859C3.4375 17.0315 4.05442 17.6484 5.5 17.6484H16.5C17.9456 17.6484 18.5625 17.0315 18.5625 15.5859V7.33594C18.5625 5.89035 17.9456 5.27344 16.5 5.27344H5.5ZM11.9433 12.0834L16.4458 8.80902C16.7529 8.58627 16.8208 8.15544 16.5971 7.84836C16.3744 7.54219 15.9455 7.47252 15.6366 7.6971L11.1338 10.9714C11.0532 11.0301 10.9459 11.0301 10.8653 10.9714L6.36251 7.6971C6.05268 7.47252 5.62473 7.54311 5.40198 7.84836C5.17831 8.15544 5.24618 8.58535 5.55326 8.80902L10.0558 12.0843C10.3381 12.2896 10.6691 12.3914 10.9991 12.3914C11.3291 12.3914 11.6619 12.2887 11.9433 12.0834Z" fill="#2678F2" />
                                        </svg>


                                        <p className="font-semibold">E-mail Corporativo:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.email}</p>
                                </div>
                                <div className="text-[#143163]  flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.1728 19.9368C14.7521 19.9368 14.3286 19.8799 13.9106 19.7653C8.26028 18.2143 3.78511 13.7429 2.23319 8.09528C1.88027 6.81103 2.07364 5.47268 2.77947 4.32868C3.48806 3.17919 4.6532 2.36885 5.97595 2.10393C6.84953 1.92885 7.72586 2.31936 8.17228 3.07286L9.60501 5.49192C10.3008 6.66708 9.95506 8.18142 8.81748 8.93767L7.78086 9.62702C8.74977 11.6171 10.3795 13.2506 12.3604 14.2186L13.0591 13.1764C13.819 12.0406 15.3342 11.7005 16.5084 12.3999L18.9312 13.8446C19.6811 14.2919 20.0697 15.1664 19.8983 16.0217C19.6343 17.3444 18.823 18.5095 17.6744 19.2181C16.9026 19.6938 16.0437 19.9368 15.1728 19.9368ZM6.39668 3.43493C6.35177 3.43493 6.30596 3.43953 6.26196 3.44869C5.29579 3.64211 4.45979 4.22417 3.95104 5.05009C3.44779 5.86592 3.30935 6.81835 3.56052 7.73043C4.9841 12.9133 9.08984 17.0163 14.2745 18.4389C15.1866 18.6892 16.138 18.5499 16.952 18.0475C17.777 17.5388 18.3602 16.7009 18.5499 15.7513C18.6067 15.4662 18.4774 15.1738 18.2272 15.0253L15.8044 13.5806C15.2562 13.2552 14.5531 13.4147 14.2011 13.9418L13.179 15.468C12.9957 15.7412 12.642 15.8457 12.3432 15.7192C9.62707 14.5843 7.41789 12.3688 6.28031 9.6426C6.15381 9.33827 6.26093 8.9881 6.53409 8.80569L8.0568 7.79276C8.5848 7.44168 8.74517 6.7386 8.42158 6.19318L6.98884 3.77409C6.86326 3.56051 6.63593 3.43493 6.39668 3.43493ZM13.63 13.5586H13.6392H13.63ZM16.271 9.1641C16.271 7.26843 14.7282 5.7266 12.8335 5.7266C12.454 5.7266 12.146 6.0346 12.146 6.4141C12.146 6.7936 12.454 7.1016 12.8335 7.1016C13.9702 7.1016 14.896 8.02651 14.896 9.1641C14.896 9.5436 15.204 9.8516 15.5835 9.8516C15.963 9.8516 16.271 9.5436 16.271 9.1641ZM19.021 9.1641C19.021 5.75226 16.2453 2.9766 12.8335 2.9766C12.454 2.9766 12.146 3.2846 12.146 3.6641C12.146 4.0436 12.454 4.3516 12.8335 4.3516C15.4872 4.3516 17.646 6.51035 17.646 9.1641C17.646 9.5436 17.954 9.8516 18.3335 9.8516C18.713 9.8516 19.021 9.5436 19.021 9.1641Z" fill="#2678F2" />
                                        </svg>


                                        <p className="font-semibold">Número Empresarial:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.tel_empresa}</p>
                                </div>
                                <div className="text-[#143163] flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.1728 19.9368C14.7521 19.9368 14.3286 19.8799 13.9106 19.7653C8.26028 18.2143 3.78511 13.7429 2.23319 8.09528C1.88027 6.81103 2.07364 5.47268 2.77947 4.32868C3.48806 3.17919 4.6532 2.36885 5.97595 2.10393C6.84953 1.92885 7.72586 2.31936 8.17228 3.07286L9.60501 5.49192C10.3008 6.66708 9.95506 8.18142 8.81748 8.93767L7.78086 9.62702C8.74977 11.6171 10.3795 13.2506 12.3604 14.2186L13.0591 13.1764C13.819 12.0406 15.3342 11.7005 16.5084 12.3999L18.9312 13.8446C19.6811 14.2919 20.0697 15.1664 19.8983 16.0217C19.6343 17.3444 18.823 18.5095 17.6744 19.2181C16.9026 19.6938 16.0437 19.9368 15.1728 19.9368ZM6.39668 3.43493C6.35177 3.43493 6.30596 3.43953 6.26196 3.44869C5.29579 3.64211 4.45979 4.22417 3.95104 5.05009C3.44779 5.86592 3.30935 6.81835 3.56052 7.73043C4.9841 12.9133 9.08984 17.0163 14.2745 18.4389C15.1866 18.6892 16.138 18.5499 16.952 18.0475C17.777 17.5388 18.3602 16.7009 18.5499 15.7513C18.6067 15.4662 18.4774 15.1738 18.2272 15.0253L15.8044 13.5806C15.2562 13.2552 14.5531 13.4147 14.2011 13.9418L13.179 15.468C12.9957 15.7412 12.642 15.8457 12.3432 15.7192C9.62707 14.5843 7.41789 12.3688 6.28031 9.6426C6.15381 9.33827 6.26093 8.9881 6.53409 8.80569L8.0568 7.79276C8.5848 7.44168 8.74517 6.7386 8.42158 6.19318L6.98884 3.77409C6.86326 3.56051 6.63593 3.43493 6.39668 3.43493ZM13.63 13.5586H13.6392H13.63ZM16.271 9.1641C16.271 7.26843 14.7282 5.7266 12.8335 5.7266C12.454 5.7266 12.146 6.0346 12.146 6.4141C12.146 6.7936 12.454 7.1016 12.8335 7.1016C13.9702 7.1016 14.896 8.02651 14.896 9.1641C14.896 9.5436 15.204 9.8516 15.5835 9.8516C15.963 9.8516 16.271 9.5436 16.271 9.1641ZM19.021 9.1641C19.021 5.75226 16.2453 2.9766 12.8335 2.9766C12.454 2.9766 12.146 3.2846 12.146 3.6641C12.146 4.0436 12.454 4.3516 12.8335 4.3516C15.4872 4.3516 17.646 6.51035 17.646 9.1641C17.646 9.5436 17.954 9.8516 18.3335 9.8516C18.713 9.8516 19.021 9.5436 19.021 9.1641Z" fill="#2678F2" />
                                        </svg>


                                        <p className="font-semibold">Número Particular:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.phone_number}</p>
                                </div>
                                <div className="text-[#143163]  flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.2334 13.384C17.0932 12.2689 17.6046 10.8714 17.6046 9.35445C17.6046 5.70691 14.6477 2.75 11.0002 2.75C7.35266 2.75 4.39575 5.70691 4.39575 9.35445C4.39575 10.86 4.89955 12.248 5.74775 13.3588L9.53332 18.4063C10.2666 19.384 11.7333 19.384 12.4667 18.4063L16.2334 13.384Z" stroke="#2678F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9443 7.2217C14.0185 8.29601 14.0185 10.0366 12.9443 11.1109C11.8701 12.1852 10.1297 12.1852 9.05558 11.1109C7.9814 10.0366 7.9814 8.29601 9.05558 7.2217C10.1297 6.14832 11.8701 6.14832 12.9443 7.2217Z" stroke="#2678F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                        <p className="font-semibold">Província:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.provincia}</p>
                                </div>
                                <div className="text-[#143163]  flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.2334 13.384C17.0932 12.2689 17.6046 10.8714 17.6046 9.35445C17.6046 5.70691 14.6477 2.75 11.0002 2.75C7.35266 2.75 4.39575 5.70691 4.39575 9.35445C4.39575 10.86 4.89955 12.248 5.74775 13.3588L9.53332 18.4063C10.2666 19.384 11.7333 19.384 12.4667 18.4063L16.2334 13.384Z" stroke="#2678F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9443 7.2217C14.0185 8.29601 14.0185 10.0366 12.9443 11.1109C11.8701 12.1852 10.1297 12.1852 9.05558 11.1109C7.9814 10.0366 7.9814 8.29601 9.05558 7.2217C10.1297 6.14832 11.8701 6.14832 12.9443 7.2217Z" stroke="#2678F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                        <p className="font-semibold">Município:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.municipio}</p>
                                </div>
                                <div className="text-[#143163] flex items-center w-full justify-between">
                                    <div className="flex items-center space-x-1">

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.25 8.25V17.4167C19.25 18.4292 18.4292 19.25 17.4167 19.25H4.58333C3.57081 19.25 2.75 18.4292 2.75 17.4167V8.25M19.25 8.25C19.25 7.23748 18.4292 6.41667 17.4167 6.41667H4.58333C3.57081 6.41667 2.75 7.23748 2.75 8.25M19.25 8.25V11L16.7975 11.8175C15.5015 12.2495 14.1694 12.5327 12.8259 12.6672C12.7419 11.7325 11.9565 11 11 11M2.75 8.25V11L5.20249 11.8175C6.49846 12.2495 7.83064 12.5327 9.1741 12.6672C9.25807 11.7325 10.0435 11 11 11M11 11C9.98748 11 9.16667 11.8208 9.16667 12.8333C9.16667 13.8459 9.98748 14.6667 11 14.6667C12.0125 14.6667 12.8333 13.8459 12.8333 12.8333C12.8333 11.8208 12.0125 11 11 11ZM6.41667 6.41667H15.5833V4.58333C15.5833 3.57081 14.7625 2.75 13.75 2.75H8.25C7.23748 2.75 6.41667 3.57081 6.41667 4.58333V6.41667Z" stroke="#2678F2" stroke-width="1.5" stroke-linejoin="round" />
                                        </svg>


                                        <p className="font-semibold">Endereço:</p>
                                    </div>
                                    <p className="text-[#4B5563] text-end ">{details?.address}</p>
                                </div>

                            </div>
                        </div>
                    </div>}
            </div>

            <div className="ui-profile-editor">
                <div className="ui-tabs ui-profile-tab-list flex" role="tablist" aria-label="Área do perfil">
                    {abas.map((aba) => (
                        <button
                            key={aba.id}
                            type="button"
                            role="tab"
                            aria-selected={abaAtiva === aba.id}
                            onClick={() => { setCurrent(aba.currentValue); setAbaAtiva(aba.id) }}
                            className={`grid flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${
                                abaAtiva === aba.id
                                    ? "border-t-4 border-[#48B9FF] bg-white"
                                    : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"
                            }`}
                        >
                            {aba.label}
                        </button>
                    ))}
                </div>

            <div className="ui-profile-panel w-full overflow-hidden bg-white p-8 text-sm">
                {isLoading ? <><Spinner width="8" height="8" color="#143163" /></> :
                    <div className="ui-profile-carousel overflow-hidden relative w-full">
                        <div className="ui-profile-carousel-track flex w-[200%] min-h-full"
                            style={{
                                transform: `translateX(-${current * 50}%)`,
                            }}
                        >

                            <form className="ui-profile-form w-full p-4" onSubmit={editUser}>
                                {!edit ?
                                    <Button onClick={() => setEdit(true)} className="ui-profile-action ui-profile-action-primary" type="button" variant="outline">
                                        <svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.4441 5.28406L19.2161 3.05603C18.6951 2.53603 18.0441 2.249 17.2681 2.25C16.5321 2.251 15.841 2.53906 15.323 3.06006L2.96899 15.471C2.82799 15.6119 2.75 15.802 2.75 16V21C2.75 21.414 3.086 21.75 3.5 21.75H8.5C8.698 21.75 8.88905 21.671 9.02905 21.532L21.4399 9.177C21.9609 8.658 22.249 7.96706 22.25 7.23206C22.251 6.49606 21.9651 5.80406 21.4441 5.28406ZM8.18994 20.25H4.25V16.3101L13.2429 7.276L17.2251 11.257L8.18994 20.25ZM20.3821 8.11402L18.2881 10.199L14.301 6.21302L16.386 4.11804C16.622 3.88104 16.936 3.751 17.271 3.75H17.272C17.606 3.75 17.92 3.87997 18.157 4.11597L20.385 6.344C20.621 6.581 20.751 6.89498 20.751 7.22998C20.75 7.56398 20.6191 7.87802 20.3821 8.11402Z" fill="#143163" />
                                        </svg>
                                        <p>Editar</p>
                                    </Button> :
                                    <div className="flex space-x-2 items-center">
                                        <Button onClick={() => {
                                            const savedPhoto = details?.photo ?? null;
                                            setPreview(savedPhoto);
                                            setFormDataFiles({ file: savedPhoto });
                                            setIsFileChanged(false);
                                            setEdit(false);
                                        }} className="ui-profile-action ui-profile-action-cancel" type="button" variant="ghost">
                                            Cancelar
                                        </Button>
                                        <Button className="ui-profile-action ui-profile-action-primary" type="submit" variant="outline">
                                            {loading ?
                                                <div className="w-full grid place-items-center">
                                                    <Spinner color="#143163" width="5" height="5" /></div> :

                                                <><svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.3635 6.03003L18.2424 2.90894C17.8234 2.48994 17.2434 2.25 16.6514 2.25H6.27246C3.85446 2.25 2.52246 3.582 2.52246 6V18C2.52246 20.418 3.85446 21.75 6.27246 21.75H18.2725C20.6905 21.75 22.0225 20.418 22.0225 18V7.62109C22.0225 7.02909 21.7825 6.44903 21.3635 6.03003ZM16.5225 20.25H8.02246V14.5C8.02246 13.911 8.18346 13.75 8.77246 13.75H15.7725C16.3615 13.75 16.5225 13.911 16.5225 14.5V20.25ZM20.5225 18C20.5225 19.577 19.8495 20.25 18.2725 20.25H18.0225V14.5C18.0225 13.091 17.1815 12.25 15.7725 12.25H8.77246C7.36346 12.25 6.52246 13.091 6.52246 14.5V20.25H6.27246C4.69546 20.25 4.02246 19.577 4.02246 18V6C4.02246 4.423 4.69546 3.75 6.27246 3.75H16.6514C16.8484 3.75 17.0424 3.82997 17.1814 3.96997L20.3025 7.09106C20.4425 7.23106 20.5225 7.42409 20.5225 7.62109V18ZM15.5225 8C15.5225 8.414 15.1865 8.75 14.7725 8.75H9.77246C9.35846 8.75 9.02246 8.414 9.02246 8C9.02246 7.586 9.35846 7.25 9.77246 7.25H14.7725C15.1865 7.25 15.5225 7.586 15.5225 8Z" fill="#143163" />
                                                </svg>
                                                    <p>Salvar</p>
                                                </>}
                                        </Button>
                                    </div>
                                }

                                <div className="ui-profile-divider w-full mb-6 mt-6"></div>

                                {edit && <div className="ui-profile-photo-field">
                                    <label
                                        htmlFor="profile-photo-input"
                                        className="ui-profile-photo-uploader"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            id="profile-photo-input"
                                            type="file"
                                            className="ui-profile-photo-input"
                                            onChange={handlFileChange}
                                            accept=".jpeg, .jpg, .png"
                                            aria-labelledby="profile-photo-title"
                                            aria-describedby="profile-photo-hint"
                                        />
                                        <span className="ui-profile-photo-avatar" aria-hidden="true">
                                            <span className="ui-profile-photo-image">
                                                {preview instanceof File ?
                                                    <img src={URL.createObjectURL(preview)} alt="" /> :
                                                    <UserAvatarPerfil photo={typeof preview === "string" ? preview : details?.photo} />}
                                            </span>
                                            <span className="ui-profile-photo-camera">
                                                <Camera size={17} strokeWidth={2} />
                                            </span>
                                        </span>
                                        <span className="ui-profile-photo-copy">
                                            <span id="profile-photo-title" className="ui-profile-photo-title">Foto de perfil</span>
                                            <span className="ui-profile-photo-description">Arraste uma imagem para aqui ou escolha no seu dispositivo.</span>
                                            <span className="ui-profile-photo-action">
                                                <Camera size={16} strokeWidth={2} aria-hidden="true" />
                                                Escolher fotografia
                                            </span>
                                            <span id="profile-photo-hint" className="ui-profile-photo-hint">JPG ou PNG · Prefira uma imagem quadrada</span>
                                        </span>
                                    </label>
                                </div>}

                                <div className="ui-profile-field flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold ">Utilizador backoffice</label>
                                    <input disabled={edit ? false : true} required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none
                             ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                </div>
                                <div className="ui-profile-field flex flex-col space-y-2 mt-6 w-full">
                                    <label className="text-[#143163] font-semibold text-[14px]">Bilhete de Identidade</label>
                                    <input disabled={edit ? false : true} type="text" maxLength={14} value={formData.bi} onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none 
                                ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                </div>

                                <div className="ui-profile-field-row flex items-center justify-between space-x-2">

                                    <div className="ui-profile-field flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Número Particular</label>
                                        <input disabled={edit ? false : true} required type="number" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none 
                                ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                    </div>
                                    <div className="ui-profile-field flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Número Empresarial</label>
                                        <input disabled={edit ? false : true} required type="number" value={formData.telefoneEmpresa} onChange={(e) => setFormData({ ...formData, telefoneEmpresa: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none
                                ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                    </div>

                                </div>
                                <div className="ui-profile-field flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold ">Email Corporativo</label>
                                    <input disabled={edit ? false : true} required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none
                                ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                </div>
                                <div className="ui-profile-field-row flex justify-between space-x-2">
                                    <div className="ui-profile-field flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Província</label>
                                        <select disabled={edit ? false : true} required value={formData.provincia_id} onChange={(e) => setFormData({ ...formData, provincia_id: e.target.value })}
                                            className={`p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`}>
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
                                    <div className="ui-profile-field flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Município</label>
                                        <select disabled={edit ? false : true} required value={formData.municipio} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                            className={`p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`}>
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
                                <div className="ui-profile-field flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold ">Endereço Profissional</label>
                                    <input disabled={edit ? false : true} required type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none 
                            ${!edit ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"} text-sm`} />
                                </div>

                            </form>

                            <form className="ui-profile-form w-full flex flex-col space-y-2 p-5" onSubmit={submitSenha}>
                                {!editSenha ?
                                    <Button onClick={() => setEditSenha(true)} className="ui-profile-action ui-profile-action-primary" type="button" variant="outline">
                                        <svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.4441 5.28406L19.2161 3.05603C18.6951 2.53603 18.0441 2.249 17.2681 2.25C16.5321 2.251 15.841 2.53906 15.323 3.06006L2.96899 15.471C2.82799 15.6119 2.75 15.802 2.75 16V21C2.75 21.414 3.086 21.75 3.5 21.75H8.5C8.698 21.75 8.88905 21.671 9.02905 21.532L21.4399 9.177C21.9609 8.658 22.249 7.96706 22.25 7.23206C22.251 6.49606 21.9651 5.80406 21.4441 5.28406ZM8.18994 20.25H4.25V16.3101L13.2429 7.276L17.2251 11.257L8.18994 20.25ZM20.3821 8.11402L18.2881 10.199L14.301 6.21302L16.386 4.11804C16.622 3.88104 16.936 3.751 17.271 3.75H17.272C17.606 3.75 17.92 3.87997 18.157 4.11597L20.385 6.344C20.621 6.581 20.751 6.89498 20.751 7.22998C20.75 7.56398 20.6191 7.87802 20.3821 8.11402Z" fill="#143163" />
                                        </svg>
                                        <p>Editar</p>
                                    </Button> :
                                    <div className="ui-profile-actions flex items-center gap-2">
                                        <Button onClick={() => setEditSenha(false)} className="ui-profile-action ui-profile-action-cancel" type="button" variant="ghost">
                                            Cancelar
                                        </Button>
                                        <Button className="ui-profile-action ui-profile-action-primary" type="submit" variant="outline">
                                            {loading ?
                                                <div className="w-full grid place-items-center">
                                                    <Spinner color="#143163" width="5" height="5" /></div> :

                                                <><svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.3635 6.03003L18.2424 2.90894C17.8234 2.48994 17.2434 2.25 16.6514 2.25H6.27246C3.85446 2.25 2.52246 3.582 2.52246 6V18C2.52246 20.418 3.85446 21.75 6.27246 21.75H18.2725C20.6905 21.75 22.0225 20.418 22.0225 18V7.62109C22.0225 7.02909 21.7825 6.44903 21.3635 6.03003ZM16.5225 20.25H8.02246V14.5C8.02246 13.911 8.18346 13.75 8.77246 13.75H15.7725C16.3615 13.75 16.5225 13.911 16.5225 14.5V20.25ZM20.5225 18C20.5225 19.577 19.8495 20.25 18.2725 20.25H18.0225V14.5C18.0225 13.091 17.1815 12.25 15.7725 12.25H8.77246C7.36346 12.25 6.52246 13.091 6.52246 14.5V20.25H6.27246C4.69546 20.25 4.02246 19.577 4.02246 18V6C4.02246 4.423 4.69546 3.75 6.27246 3.75H16.6514C16.8484 3.75 17.0424 3.82997 17.1814 3.96997L20.3025 7.09106C20.4425 7.23106 20.5225 7.42409 20.5225 7.62109V18ZM15.5225 8C15.5225 8.414 15.1865 8.75 14.7725 8.75H9.77246C9.35846 8.75 9.02246 8.414 9.02246 8C9.02246 7.586 9.35846 7.25 9.77246 7.25H14.7725C15.1865 7.25 15.5225 7.586 15.5225 8Z" fill="#143163" />
                                                </svg>
                                                    <p>Salvar</p>
                                                </>}
                                        </Button>
                                    </div>
                                }
                                <div className="ui-profile-field flex flex-col space-y-2 mt-4 font-semibold">
                                    <label className="text-[#143163] ">{!editSenha ? "Palavra-passe" : "Palavra-passe antiga"}</label>
                                    <div className="relative block  rounded-lg items-center">

                                        <input
                                            disabled={editSenha ? false : true}
                                            value={formData.palavraPasseAntiga} onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, palavraPasseAntiga: e.target.value })} type={isShow ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`p-2 rounded-[6px] ring-1 ${statusErro ? "ring-[#EF4A00]" : "ring-[#ADCBD0]"} 
                                        ${!editSenha ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"}
                                        focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-sm block pr-12 w-full`} />

                                        {editSenha && <button onClick={() => setIsShow(!isShow)} type="button" className="ui-profile-visibility-toggle absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                            {isShow ? <svg className="animate-fadeIn mr-3" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                            </svg> :

                                                <svg className="animate-fadeIn mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                                </svg>
                                            }

                                        </button>}

                                    </div>

                                </div>
                                {editSenha && <>
                                    <div className="ui-profile-field flex flex-col space-y-2 mt-4 font-semibold">
                                        <label className="text-[#143163] ">Nova Palavra-passe</label>
                                        <div className="relative block  rounded-lg items-center">

                                            <input
                                                disabled={editSenha ? false : true}
                                                value={formData.novaPalavraPasse}
                                                onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, novaPalavraPasse: e.target.value })}
                                                type={isShowNew ? "text" : "password"}
                                                className={`p-2 rounded-[6px] ring-1 ${statusErro ? "ring-[#EF4A00]" : "ring-[#ADCBD0]"} 
                                        ${!editSenha ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"}
                                        focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-sm block pr-12 w-full`} />

                                            <button disabled={editSenha ? false : true} onClick={() => setIsShowNew(!isShowNew)} type="button" className="ui-profile-visibility-toggle absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                                {isShowNew ? <svg className="animate-fadeIn mr-3" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                                </svg> :

                                                    <svg className="animate-fadeIn mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                                    </svg>
                                                }

                                            </button>

                                        </div>

                                    </div>
                                    <div className="ui-profile-field flex flex-col space-y-2 mt-4 font-semibold">
                                        <label className="text-[#143163] ">Repetir Palavra-passe</label>
                                        <div className="relative block  rounded-lg items-center">

                                            <input
                                                disabled={editSenha ? false : true}
                                                value={formData.confirmaPalavraPasse}
                                                onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, confirmaPalavraPasse: e.target.value })}
                                                type={isShowConfirm ? "text" : "password"}
                                                className={`p-2 rounded-[6px] ring-1 ${statusErro ? "ring-[#EF4A00]" : "ring-[#ADCBD0]"} 
                                        ${!editSenha ? "bg-[#F2F2F2] text-[#7D8CA6]" : "text-[#143163]"}
                                        focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-sm block pr-12 w-full`} />

                                            <button disabled={editSenha ? false : true} onClick={() => setIsShowConfirm(!isShowConfirm)} type="button" className="ui-profile-visibility-toggle absolute inset-y-4 right-0 flex items-center cursor-pointer">

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
                                </>}
                                {statusErro && <p className="text-[#EF4A00] text-[12px] mt-1">Senhas não coincidem!</p>}
                            </form>
                        </div>
                    </div>
                }
            </div>
            </div>
        </section>
    )
}
