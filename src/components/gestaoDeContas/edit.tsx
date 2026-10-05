import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,

} from "@/components/ui/sheet"

import { useEffect, useState } from "react"
import provinvia from "../json/provincias.json"
import municipios from "../json/municipios.json"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AlterarSenha from "./alterarSenha"
import { getCountries } from "../utils/getCountries"
import paises from "../json/paises.json"
import { DateField, FormField, NativeSelectField, TextAreaField, TextField } from "@/components/ui/form-field"
import { X } from "lucide-react"

type props = {
    isOpen: boolean,
    onClose: () => void,
    typeAccount: boolean,
    selectedItem: any
}

export default function EditUsuario({ onClose, isOpen, typeAccount, selectedItem }: props) {
    const queryClient = useQueryClient()
    const [dadosUser, setDadosUser] = useState(true)  // estado do formulario, para dados do formulario ou submissao de documentos
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        tipoDeConta: "",
        nacionalidade: "",
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
        motivo: "",
        short_name: ""
    })

    const [situacaoUsuario, setSituacaoUsuario] = useState("")

    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(formData.provincia_id)) // retorna a lista de municipios da provincia selecionada
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(formData?.provincia_id);
    }); // retorna o objecto da provincia selecionada

    const idProvince = provinvia.provincia?.filter((item) => item?.nome === selectedItem?.user_document?.province)

    useEffect(() => {
        setSituacaoUsuario(selectedItem?.status)
        setFormData({
            tipoDeConta: "",
            nacionalidade: selectedItem?.user_document?.country || "",
            bi: selectedItem?.bi_number || "",
            primeiro_nome: selectedItem?.first_name || "",
            ultimo_nome: selectedItem?.last_name || "",
            email: selectedItem?.email || "",
            telefone: selectedItem?.phone_number || "",
            nascimento: selectedItem?.user_document?.birthday || "",
            municipio: selectedItem?.user_document?.city || "",
            provincia_id: String(idProvince[0]?.id) || "",
            provincia_nome: selectedItem?.user_document?.province || "",
            morada: selectedItem?.user_document?.address || "",
            palavraPasse: "",
            confirmPalavraPasse: "",
            passaporte: "",
            business_name: selectedItem?.business_name || "",
            nif: selectedItem?.nif || "",
            motivo: selectedItem?.motivo || "",
            short_name: selectedItem?.short_name || ""
        })

    }, [selectedItem])

    useEffect(() => {
        setFormData({ ...formData, provincia_nome: nomeProvincia[0]?.nome })
    }, [formData.provincia_id])

    const updateUser = async (e: any) => {
        e.preventDefault()

        const bodyUsers = {
            bi_number: formData?.bi,
            first_name: formData?.primeiro_nome,
            last_name: formData?.ultimo_nome,
            phone_number: formData.telefone,
            status: situacaoUsuario,
            motivo: formData.motivo,
            city: formData.municipio,
            province: formData.provincia_nome,
            address: formData.morada,
            birthday: formData.nascimento,
            country: formData?.nacionalidade,
        }

        // const otherDataUsers = new FormData()
        // otherDataUsers.append('account_type', typeAccount ? "Users" : "Marchants")
        // otherDataUsers.append('user', selectedItem?.id)
        // otherDataUsers.append('address', formData?.morada)
        // otherDataUsers.append('province', formData?.provincia_nome)
        // otherDataUsers.append('city', formData?.municipio)
        // otherDataUsers.append('birthday', formData?.nascimento)
        // otherDataUsers.append('country', formData?.nacionalidade)
        // otherDataUsers.append('nacionalidade', formData?.nacionalidade === "Angola" ? "Nacional" : "Estrangeira")

        const bodyMerchants = {
            email: formData.email,
            business_name: formData.business_name,
            nif: formData.nif,
            motivo: formData.motivo,
            status: situacaoUsuario,
            city: formData.municipio,
            province: formData.provincia_nome,
            address: formData.morada,
            birthday: formData.nascimento,
            country: "Angola",
            phone_number: formData.telefone,
            short_name: formData?.short_name
            //account_type: typeAccount ? "Users" : "Marchants",

        }

        const body = typeAccount ? bodyUsers : bodyMerchants

        try {

            setLoading(true)
            //await api.put(`/front/user`)
            //await api.put(`/front/${typeAccount ? "users" : "merchants"}/${selectedItem?.id}/`)
            await api.put(`/front/${typeAccount ? "users" : "merchants"}/${selectedItem?.id}`, body) // para dados do user
            //await api.post(`/front/user/upload`, otherDataUsers) // para dados de upload
            queryClient.invalidateQueries({
                queryKey: ['listaDeContas'],
                //exact: true,
            })
            onClose()
            toast.success(`Alterações Efectuadas Com Sucesso!`, {
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
                const message = error?.response?.data?.errors?.[0]?.message
                    || error?.response?.data?.message
                    || error?.message
                    || "Erro desconhecido"

                toast.error(`Erro: ${message}`, {
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

    const { data } = useQuery({
        queryKey: ["listCountries"],
        queryFn: () => getCountries(),
        initialData: paises, // Dados iniciais sincronizados
        staleTime: Infinity, // Nunca expira durante a sessão
    })


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

            <SheetContent className="ui-account-edit-sheet ui-edit-sheet w-full flex-col overflow-y-auto p-5 scrollbar-none sm:p-7">
                    <div className="flex items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="min-w-0 p-0 text-left">
                            <SheetTitle className="text-lg font-semibold text-[#143163]">Editar dados da conta</SheetTitle>
                            <SheetDescription className="mt-1 text-sm text-[#667085]">Actualize os dados pessoais ou da empresa seleccionada.</SheetDescription>
                        </SheetHeader>
                        <SheetClose aria-label="Fechar edição" className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E3EAF4] bg-[#F5F7FA] text-[#143163] transition hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                            <X className="size-4" aria-hidden="true" />
                        </SheetClose>
                    </div>

                    <div>
                        <div className="ui-modal-tabs" role="tablist" aria-label="Secções de edição">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={dadosUser}
                                onClick={() => setDadosUser(true)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t  w-full cursor-pointer  ${dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[14px] p-2 ring-1 ring-[#A9B8CF]`}>Editar utilizador</button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={!dadosUser}
                                onClick={() => setDadosUser(false)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t w-full cursor-pointer   ${!dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"}
                         border-[#48B9FF] text-[14px] p-2 ring-1 ring-[#A9B8CF]`}>Alterar Palavra-passe</button>

                        </div>
                    </div>

                    {!dadosUser && <>
                        <div className="border-b border-[#E5EBF4] pb-3 text-sm font-semibold text-[#143163]">Insira o número que deverá receber a SMS.</div></>}

                    <form onSubmit={updateUser}>
                        {/* dados do usuario */}
                        {dadosUser &&
                            <div className="grid gap-4 pt-3">
                                {typeAccount && <div>
                                    {/* <CountryDropdown
                                        placeholder="Select country"
                                        defaultValue="AOA"
                                        onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                                    /> */}
                                    {<NativeSelectField required label="Nacionalidade" value={formData.nacionalidade || ""} onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}>
                                        <option value="">Seleccione...</option>
                                        {data?.map((item) => (
                                            <option key={item?.nome_pais} value={item?.nome_pais}>
                                                {item?.nome_pais}
                                            </option>
                                        ))}
                                    </NativeSelectField>}
                                </div>}

                                <FormField label="Situação do utilizador">
                                    <Select onValueChange={setSituacaoUsuario} value={situacaoUsuario}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Activo</SelectItem>
                                            <SelectItem value="Desactivado">Desactivado</SelectItem>
                                            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                {situacaoUsuario !== "Active" && <>
                                    <TextAreaField required label="Motivo da alteração de estado" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} className="resize-none" />
                                </>}

                                {!typeAccount && <>
                                    <TextField required label="Empresa" value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} />
                                    <TextField label="NIF" value={formData.nif} onChange={(e) => setFormData({ ...formData, nif: e.target.value })} />
                                </>}

                                {typeAccount && <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <TextField label="Primeiro nome" value={formData.primeiro_nome} onChange={(e) => setFormData({ ...formData, primeiro_nome: e.target.value })} />
                                    <TextField label="Último nome" value={formData.ultimo_nome} onChange={(e) => setFormData({ ...formData, ultimo_nome: e.target.value })} />
                                    </div>
                                    <TextField label="Documento de identificação" value={formData.bi} onChange={(e) => setFormData({ ...formData, bi: e.target.value })} />
                                </>}

                                {!typeAccount && <TextField type="email" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <TextField type="tel" label="Número de telemóvel" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
                                    <DateField label="Data de nascimento" value={formData.nascimento} onChange={(e) => setFormData({ ...formData, nascimento: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <NativeSelectField label="Província" value={formData.provincia_id || ""} onChange={(e) => setFormData({ ...formData, provincia_id: e.target.value })}>
                                            <option value="">Seleccione...</option>
                                            {provinvia?.provincia?.map((item) => (
                                                <option key={item?.id} value={item?.id}>
                                                    {item?.nome}
                                                </option>
                                            ))}
                                    </NativeSelectField>
                                    <NativeSelectField label="Município" value={formData.municipio || ""} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}>
                                            <option value="">Seleccione...</option>
                                            {municipioLista?.map((item) => (
                                                <option key={item?.id} value={item?.nome}>
                                                    {item?.nome}
                                                </option>
                                            ))}
                                    </NativeSelectField>
                                </div>
                                <TextField label={typeAccount ? "Morada" : "Endereço da sede"} value={formData.morada} onChange={(e) => setFormData({ ...formData, morada: e.target.value })} />
                                {/*!typeAccount&&<div className="flex flex-col space-y-2 mt-6">
                                    <label className="text-[#143163] font-semibold text-[14px]">Área de actuação</label>
                                    <input required type="text" value={formData.morada} onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>*/}

                                <Button disabled={loading} className="mt-2 h-11 w-full rounded-lg font-semibold"
                                    type="submit" variant="brand">
                                    {loading ?
                                        <div className="flex justify-center items-center">
                                            <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                        </div> : "Guardar alterações"
                                    }
                                </Button>
                            </div>
                        }
                    </form>
                    {/* submissao de documentos */}
                    {!dadosUser &&
                        <AlterarSenha
                            typeAccount={typeAccount}
                            otherData={selectedItem}
                            onClose={onClose}
                        />
                    }

                    {!dadosUser && <div className="grid gap-4 pt-3">
                        <AlterarSenha typeAccount={typeAccount} otherData={selectedItem} onClose={onClose} />
                    </div>}

                </SheetContent>

            </Sheet>
        </>
    )
}
