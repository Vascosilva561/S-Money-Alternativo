import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"

import { useEffect, useState } from "react"
import provinvia from "../json/provincias.json"
import municipios from "../json/municipios.json"
import { api } from "@/api"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { format, startOfDay } from "date-fns";

export type UserExportFilters = Partial<Record<
    | "name"
    | "phone_number"
    | "nif"
    | "email"
    | "business_name"
    | "bi_number"
    | "passaporte"
    | "nacionalidade"
    | "status"
    | "level"
    | "province"
    | "city"
    | "data_inicio"
    | "data_final"
    | "status_validate",
    string
>>

type props = {
    isOpen: boolean,
    onClose: () => void,
    typeAccount: boolean,
    initialFilters?: UserExportFilters
}

const DEFAULT_DATA_INICIAL = format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss")
const DEFAULT_DATA_FINAL = format(new Date(), "yyyy-MM-dd HH:mm")

export default function Exportar({ onClose, isOpen, typeAccount, initialFilters }: props) {

    const [dataInicial, setDataInicial] = useState(DEFAULT_DATA_INICIAL)
    const [dataFinal, setDataFinal] = useState(DEFAULT_DATA_FINAL)
    const [loading, setLoading] = useState(false)
    const [situacaoUser, setSituacaoUser] = useState("")
    const [status, setStatus] = useState("")
    const [level, setLevel] = useState("")
    const [formData, setFormData] = useState({
        municipio: "",
        provincia_id: "",
        provincia_nome: "",

    })

    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(formData.provincia_id)) // retorna a lista de municipios da provincia selecionada
    const nomeProvincia = provinvia?.provincia?.filter((item) => {
        return item?.id === Number(formData?.provincia_id);
    }); // retorna o objecto da provincia selecionada

    useEffect(() => {
        if (!isOpen) return

        const province = provinvia?.provincia?.find((item) => item?.nome === initialFilters?.province)

        setSituacaoUser(initialFilters?.status || "")
        setStatus(initialFilters?.status_validate || "")
        setLevel(initialFilters?.level || "")
        setDataInicial(initialFilters?.data_inicio || DEFAULT_DATA_INICIAL)
        setDataFinal(initialFilters?.data_final || DEFAULT_DATA_FINAL)
        setFormData({
            municipio: initialFilters?.city || "",
            provincia_id: province ? String(province.id) : "",
            provincia_nome: initialFilters?.province || ""
        })
    }, [initialFilters, isOpen])

    useEffect(() => {
        setFormData((current) => ({ ...current, provincia_nome: nomeProvincia[0]?.nome || "" }))
    }, [formData.provincia_id])


    const agendarRelatorio = async (e: any) => {
        e.preventDefault()

        try {

            const activeFilters = Object.entries(initialFilters || {}).reduce<Record<string, string>>((filters, [key, value]) => {
                if (value) filters[key] = value
                return filters
            }, {})

            const body = new URLSearchParams({
                ...activeFilters,
                status: situacaoUser,
                level: level,
                province: formData?.provincia_nome || "",
                city: formData?.municipio,
                data_inicio: dataInicial,
                data_final: dataFinal,
                status_validate: status
            })

            setLoading(true)
            //await api.put(`/front/user`)
            await api.get(`/front/${typeAccount ? "user_csv" : "merchants_csv"}?${body}`)
            
            setLoading(false)
            onClose()
            toast.success(`Relatório agendado com sucesso!`, {
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
        }
    }

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-export-sheet w-full overflow-y-auto sm:max-w-xl">
                    <SheetHeader className="ui-export-header text-left">
                        <SheetTitle className="text-lg font-semibold text-[#143163]">Exportar lista de utilizadores</SheetTitle>
                        <SheetDescription className="text-sm text-[#667085]">Configure os filtros e os dados a incluir no ficheiro CSV.</SheetDescription>
                        <SheetClose aria-label="Fechar exportação" className="ui-export-close"><X className="size-4" aria-hidden="true" /></SheetClose>
                    </SheetHeader>

                <form onSubmit={agendarRelatorio}>
                            <div className="ui-export-fields">
                                <div className="ui-field">
                                    <label className="text-[#143163] font-semibold text-[14px]">Situação do utilizador</label>
                                    <Select onValueChange={setSituacaoUser} value={situacaoUser}>
                                        <SelectTrigger className=" w-full">
                                            <SelectValue placeholder="Selecione"/>
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="Activo">Activo</SelectItem>
                                            <SelectItem value="Desactivado">Desactivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="ui-export-field-row">
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Estado do Conta</label>
                                        <Select onValueChange={setStatus} value={status}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                <SelectItem value="Validado">Validado</SelectItem>
                                                <SelectItem value="Pendente">Pendente</SelectItem>
                                                <SelectItem value="Não Validado">Não Validado</SelectItem>
                                                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Nível da Conta</label>
                                        <Select onValueChange={setLevel} value={level}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                {[1, 2, 3, 4, 5].map((level) => {
                                                    const badgeName = getLevelBadgeName(level)
                                                    return (
                                                        <SelectItem key={level} value={String(level)}>
                                                            <span className="inline-flex items-center gap-2">
                                                                <LevelBadgeIcon level={level} className="h-4 w-4 shrink-0" />
                                                                <span>{badgeName ? `Nível ${level} · ${badgeName}` : `Nível ${level}`}</span>
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="ui-export-field-row">
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Província</label>
                                        <select value={formData.provincia_id} onChange={(e) => setFormData({ ...formData, provincia_id: e.target.value })}
                                            className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                            <option>Selecione...</option>
                                            {provinvia?.provincia?.map((item) => (
                                                <option key={item?.id} value={item?.id}>
                                                    {item?.nome}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Município</label>
                                        <select value={formData.municipio} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
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
                                <div className="ui-export-field-row">
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Data Inicial</label>
                                        <input type="datetime-local" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>
                                    <div className="ui-field">
                                        <label className="text-[#143163] font-semibold text-[14px]">Data Final</label>
                                        <input type="datetime-local" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)}
                                            className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                    </div>
                                </div>

                                <SheetFooter className="ui-export-footer">
                                    <Button disabled={loading ? true : false} className="ui-export-submit"
                                    type="submit" variant="brand">
                                    {loading ?
                                        <div className="flex justify-center items-center">
                                            <div className="w-6 h-6 rounded-full border-1 border-t-transparent border-[#143163] animate-spin"></div>
                                        </div> : "Agendar"
                                    }
                                </Button>
                                </SheetFooter>

                            </div>
                        

                       
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
