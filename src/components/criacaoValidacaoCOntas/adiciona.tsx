import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"

import { useEffect, useState } from "react"
import paises from "../json/paises.json"
import provinvia from "../json/provincias.json"
import municipios from "../json/municipios.json"
import { useQuery } from "@tanstack/react-query"
import SubmissaoDocumentos from "../submissaoDocumentos"
import { toast } from "sonner"
import { getCountries } from "../utils/getCountries"
import { isAxiosError } from "axios"
import { api } from "@/api"
import { ErrorIcon } from "../tranferenciaSOmoney/transferir"
import { Info } from "lucide-react"

type props = {
    isOpen: boolean,
    onClose: () => void,
    typeAccount: boolean // true para conta de usuario e false para conta de empresa
}

export default function AdicionaUsuario({ onClose, isOpen, typeAccount }: props) {

    const [dadosUser, setDadosUser] = useState(true)  // estado do formulario, para dados do formulario ou submissao de documentos
    const [formData, setFormData] = useState({
        tipoDeConta: "",
        nacionalidade: "Angola",
        bi: "",
        primeiro_nome: "",
        ultimo_nome: "",
        email: "",
        telefone: "",
        nascimento: "",
        municipio: "",
        provincia_id: "",
        provincia_nome: "",
        morada: "",
        palavraPasse: "",
        confirmPalavraPasse: "",
        passaporte: "",
        business_name: "",
        nif: "",
    })
    const [statusErro, setStatusErro] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isShowConfirm, setIsShowConfirm] = useState(false)
    const [estrangeiro, setEstrangeiro] = useState(false)
    const [loadingValidBI, setLoadingBI] = useState(false)
    const urlValidBI = import.meta.env.VITE_VALID_BI_API_URL;

    const { data } = useQuery({
        queryKey: ["listCountries"],
        queryFn: () => getCountries(),
        initialData: paises, // Dados iniciais sincronizados
        staleTime: Infinity, // Nunca expira durante a sessão
    })

    const [userName, setUserName] = useState({ nif: "", name: "" } as { nif: string, name: string } | null)
    const [isVerified, setIsVeified] = useState(false)
    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(formData.provincia_id)) // retorna a lista de municipios da provincia selecionada
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(formData?.provincia_id);
    }); // retorna o objecto da provincia selecionada

    useEffect(() => {
        setFormData({ ...formData, provincia_nome: nomeProvincia[0]?.nome })
    }, [formData.provincia_id])

    const clearInputs = () => {
        setFormData({
            ...formData,
            tipoDeConta: "",
            nacionalidade: "",
            bi: "",
            passaporte: "",
            primeiro_nome: "",
            ultimo_nome: "",
            email: "",
            telefone: "",
            nascimento: "",
            municipio: "",
            provincia_id: "",
            provincia_nome: "",
            morada: "",
            palavraPasse: "",
            confirmPalavraPasse: "",
            business_name: "",
            nif: "",
        })
    }




    async function verificarBI(bi: string, e?: any) {
        e?.preventDefault();

        if (!bi) return toast?.error("Insira o número da BI!");

        try {
            setUserName(null);
            setLoadingBI(true);

            const res = await api.get(`${urlValidBI}check-number?number_id=${bi}`);

            setUserName(res?.data);
            setIsVeified(true);

        } catch (error) {
            console.log(error);

            if (isAxiosError(error)) {
                const message = error?.response?.data?.errors?.[0]?.message || "Erro ao verificar a BI";
                toast.error(message, {
                    icon: ErrorIcon,
                    style: { borderLeft: "8px solid #EF4A00" },
                    duration: 2000,
                });
            }

            setIsVeified(false);

        } finally {
            setLoadingBI(false);
        }
    }

    useEffect(() => {
        if (userName?.name) {
            const partes = userName?.name?.trim().split(/\s+/);

            const primeiroNome = partes?.[0];
            const ultimoNome = partes?.slice(1).join(" ");

            setFormData((prevFormData) => ({
                ...prevFormData,
                primeiro_nome: primeiroNome || "",
                ultimo_nome: ultimoNome || "",
            }));

        }
    }, [userName?.name]);

    const submitDataUser = async (e: any) => {
        e.preventDefault()
        if (formData.palavraPasse != formData.confirmPalavraPasse) {
            setStatusErro(true)
            return
        }
        if (typeAccount) {
            if (formData.nacionalidade === "" || formData.nacionalidade === "Selecione..." || formData.provincia_id === "" || formData.municipio === "") {
                toast.error(`Preencha todos os campos`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z" fill="#FF9F29" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #FF9F29", // Tailwind emerald-500
                    },
                    duration: 2000

                })
                return;
            }
        }
        else {
            if (formData.nif === "" || formData.business_name === "" || formData.provincia_id === "" || formData.municipio === "") {
                toast.error(`Preencha todos os campos`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12C1.25 6.072 6.072 1.25 12 1.25C17.928 1.25 22.75 6.072 22.75 12C22.75 17.928 17.928 22.75 12 22.75ZM12 2.75C6.899 2.75 2.75 6.899 2.75 12C2.75 17.101 6.899 21.25 12 21.25C17.101 21.25 21.25 17.101 21.25 12C21.25 6.899 17.101 2.75 12 2.75ZM12.75 16.5V11.929C12.75 11.515 12.414 11.179 12 11.179C11.586 11.179 11.25 11.515 11.25 11.929V16.5C11.25 16.914 11.586 17.25 12 17.25C12.414 17.25 12.75 16.914 12.75 16.5ZM13.02 8.5C13.02 7.948 12.573 7.5 12.02 7.5H12.01C11.458 7.5 11.0149 7.948 11.0149 8.5C11.0149 9.052 11.468 9.5 12.02 9.5C12.572 9.5 13.02 9.052 13.02 8.5Z" fill="#FF9F29" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #FF9F29", // Tailwind emerald-500
                    },
                    duration: 2000

                })
                return;
            }
        }
        if(!isVerified) return toast.error("Valide o BI antes de submeter os dados do utilizador!");

        setDadosUser(false)

    }

    useEffect(() => {
        if (formData.nacionalidade !== "Angola") {
            setEstrangeiro(true)
        } else {
            setEstrangeiro(false)
        }
    }, [formData.nacionalidade])


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none" >
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="text-[#143163] font-semibold text-[18px] p-0" description="Preencha os campos para adicionar um novo registo.">Adicionar utilizador</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>
                    {/* <div className="flex flex-col space-y-2 mt-5">
                        <label className="text-[#143163] font-semibold text-[14px]">Tipo de Conta</label>
                        <Select onValueChange={setTypeAccount}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar tipo de conta" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="User">Conta Particular</SelectItem>
                                <SelectItem value="marchant">Conta Empresa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>*/}
                    <div>
                        <div className="ui-modal-tabs flex space-x-1.5 mt-5 pr-1 pl-1">
                            <button
                                //onClick={() => setDadosUser(true)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer  ${dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[13px] p-2 ring-1 ring-[#A9B8CF]`}>Dados do utilizador</button>
                            <button
                                //onClick={() => setDadosUser(false)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer   ${!dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[13px] p-2 ring-1 ring-[#A9B8CF] `}>Submissão de Documentos</button>

                        </div>
                    </div>
                    <div className="ui-modal-step-heading">
                        <h2 className="ui-modal-step-title">{dadosUser ? "Informações do utilizador" : "Submissão de documentos"}</h2>
                        <span className="ui-modal-step-indicator">Etapa {dadosUser ? "1" : "2"} de 2</span>
                    </div>
                    <div className="ui-modal-step-divider" aria-hidden="true" />
                    {dadosUser && (
                        <div className="ui-modal-step-note">
                            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <span>Preencha os campos obrigatórios para avançar à submissão dos documentos.</span>
                        </div>
                    )}

                    <form onSubmit={submitDataUser}>
                        {/* dados do usuario */}
                        {dadosUser &&
                            <div>

                                {typeAccount && <div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Nacionalidade<span className="text-[#FF5656]">*</span></label>
                                    {/* <CountryDropdown
                                        placeholder="Select country"
                                        defaultValue="AOA"
                                        onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                                    /> */}
                                    {<select required value={formData.nacionalidade} onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })} className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                        <option>Selecione...</option>
                                        {data?.map((item) => (
                                            <option key={item?.nome_pais} value={item?.nome_pais}>
                                                {item?.nome_pais}
                                            </option>
                                        ))}
                                    </select>}
                                </div>}

                                {!typeAccount && <div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Empresa<span className="text-[#FF5656]">*</span></label>
                                    <input required type="text" value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>}

                                {typeAccount ? (!estrangeiro ? <div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Bilhete de Identidade<span className="text-[#FF5656]">*</span></label>
                                    <div className="relative">
                                        <input required type="text" value={formData.bi}
                                            onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                                            className={`w-full p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1
                                         focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                        <Button type="button"
                                            disabled={loadingValidBI}
                                            onClick={() => verificarBI(formData?.bi)}
                                            className={`ui-inline-validation absolute
                                         ${loadingValidBI ? "bg-[#f2f7f8] text-zinc-500" : "bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA]"}
                                 transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold
                                 p-2 rounded-r text-sm px-3 h- flex flex-col justify-center top-0 right-0 cursor-pointer`} variant="brand">
                                            {loadingValidBI ? "A validar..." : "Validar"}
                                        </Button>
                                    </div>
                                </div> :
                                    <div className="flex flex-col space-y-2 mt-6">
                                        <label className="text-[#143163] font-semibold text-[14px]">Número do Passaporte<span className="text-[#FF5656]">*</span></label>
                                        <input required type="number" value={formData.passaporte} onChange={(e) => setFormData({ ...formData, passaporte: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>) :
                                    <div className="flex flex-col space-y-2 mt-6">
                                        <label className="text-[#143163] font-semibold text-[14px]">NIF<span className="text-[#FF5656]">*</span></label>
                                        <input required type="text" value={formData.nif} onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>
                                }

                                {typeAccount && <><div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Primeiro Nome<span className="text-[#FF5656]">*</span> </label>
                                    <input disabled={true} required type="text" value={formData.primeiro_nome} onChange={(e) => setFormData({ ...formData, primeiro_nome: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] bg-zinc-100
                                        focus:outline-none text-[#143163] text-sm`} />
                                </div>
                                    <div className="flex flex-col space-y-2 mt-6">
                                        <label className="text-[#143163] font-semibold text-[14px]">Último Nome<span className="text-[#FF5656]">*</span></label>
                                        <input disabled={true} required type="text" value={formData.ultimo_nome} onChange={(e) => setFormData({ ...formData, ultimo_nome: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0]
                                             focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm bg-zinc-100`} />
                                    </div></>
                                }

                                {!typeAccount && <div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Email<span className="text-[#FF5656]">*</span></label>
                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>}

                                <div className="flex justify-between space-x-2">
                                    <div className="flex flex-col space-y-2 mt-6 w-full min-w-0">
                                        <label className="text-[#143163] font-semibold text-[14px]">Número de Telemóvel<span className="text-[#FF5656]">*</span></label>
                                        <input required type="text" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>
                                    <div className="flex flex-col space-y-2 mt-6 w-full min-w-0">
                                        <label className="text-[#143163] font-semibold text-[14px]">Data de Nascimento</label>
                                        <input required type="date" value={formData.nascimento} onChange={(e) => setFormData({ ...formData, nascimento: e.target.value })}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <div className="flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Província<span className="text-[#FF5656]">*</span></label>
                                        <select required value={formData.provincia_id} onChange={(e) => setFormData({ ...formData, provincia_id: e.target.value })}
                                            className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                            <option>Selecione...</option>
                                            {provinvia?.provincia?.map((item) => (
                                                <option key={item?.id} value={item?.id}>
                                                    {item?.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col space-y-2 mt-6 w-full">
                                        <label className="text-[#143163] font-semibold text-[14px]">Município<span className="text-[#FF5656]">*</span></label>
                                        <select required value={formData.municipio} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                            className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                            <option>Selecione...</option>
                                            {municipioLista?.map((item) => (
                                                <option key={item?.id} value={item?.nome}>
                                                    {item?.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">{typeAccount ? "Morada" : "Endereço da Sede"}<span className="text-[#FF5656]">*</span></label>
                                    <input required type="text" value={formData.morada} onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>
                                {/*!typeAccount&&<div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Área de actuação</label>
                                    <input required type="text" value={formData.morada} onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>*/}
                                <div className="flex flex-col space-y-2 mt-4 font-semibold">
                                    <label className="text-[#143163] text-[14px]">Palavra-passe<span className="text-[#FF5656]">*</span></label>
                                    <div className="relative block  rounded-lg items-center">

                                        <input required value={formData.palavraPasse} onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, palavraPasse: e.target.value })} type={isShow ? "text" : "password"}
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
                                    <label className="text-[#143163] text-[14px]">Repetir Palavra-passe<span className="text-[#FF5656]">*</span></label>
                                    <div className="relative block  rounded-lg items-center">

                                        <input required value={formData.confirmPalavraPasse} onSelect={() => setStatusErro(false)} onChange={(e) => setFormData({ ...formData, confirmPalavraPasse: e.target.value })}
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

                                <Button className=" w-full p-2 mt-[60px] mb-10 rounded-[6px] cursor-pointer bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] transition duration-300 ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                                    type="submit" variant="brand">
                                    {"Seguinte"}
                                </Button>

                            </div>
                        }

                        {/* submissao de documentos */}
                        {!dadosUser &&
                            <SubmissaoDocumentos
                                typeAccount={typeAccount}
                                otherData={formData}
                                onClose={onClose}
                                setDadosUser={setDadosUser}
                                clearInputs={clearInputs}
                            />
                        }
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
