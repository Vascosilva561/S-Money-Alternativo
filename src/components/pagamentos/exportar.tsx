import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LoaderCircle, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DateField, FormField, TextField } from "@/components/ui/form-field"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { useState } from "react"
import { api } from "@/api"


type props = {
    isOpen: boolean,
    onClose: () => void,

}

export default function ExportarPagamentos({ onClose, isOpen }: props) {

    const [tipoDeConta, setTipoDeConta] = useState("User")
    const [status, _setStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [statusPayments, setStatusPayments] = useState("")
    const [servico, setServico] = useState("")

    const [queryParams, setQueryParams] = useState({
        user_name_phone: "",
        account_type: "",
        dataInicial: "",
        dataFinal: "",
        montante_de: "",
        montante_ate: ""
    })

    const agendarRelatorio = async (e: any) => {
        e.preventDefault()

        try {

            const Params = new URLSearchParams({
                status: status,
                account_type: tipoDeConta,
                data_inicio: queryParams?.dataInicial,
                data_fim: queryParams?.dataFinal,
                users_name: queryParams?.user_name_phone,
                servico: servico
            })?.toString()

            setLoading(true)
            //await api.put(`/front/user`)
            await api.get(`/front/pgs_payments_csv?${Params}`)

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
                        <SheetTitle className="text-lg font-semibold text-[#143163]">Exportar Lista de Pagamentos</SheetTitle>
                        <SheetDescription className="text-sm text-[#667085]">Configure os filtros e os dados a incluir no ficheiro CSV.</SheetDescription>
                        <SheetClose aria-label="Fechar exportação" className="ui-export-close"><X className="size-4" aria-hidden="true" /></SheetClose>
                    </SheetHeader>

                    <form onSubmit={agendarRelatorio}>
                        <div className="ui-export-fields">
                            <FormField label="Tipo de conta">
                                <Select onValueChange={setTipoDeConta} value={tipoDeConta}>
                                    <SelectTrigger className="w-full" aria-label="Tipo de conta">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="User">Particular</SelectItem>
                                        <SelectItem value="Merchant">Empresa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <TextField
                                label="Utilizador (nome/telemóvel)"
                                type="text"
                                value={queryParams.user_name_phone}
                                onChange={(event) => setQueryParams({ ...queryParams, user_name_phone: event.target.value })}
                            />
                            <TextField
                                label="Beneficiário (nome/telemóvel)"
                                type="text"
                                value={queryParams.user_name_phone}
                                onChange={(event) => setQueryParams({ ...queryParams, user_name_phone: event.target.value })}
                            />

                            <div className="ui-export-field-row">
                                <FormField label="Estado do pagamento">
                                    <Select onValueChange={setStatusPayments} value={statusPayments}>
                                        <SelectTrigger className="w-full" aria-label="Estado do pagamento">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUCCESS">Sucesso</SelectItem>
                                            <SelectItem value="ERROR">Falhou</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Serviço">
                                    <Select onValueChange={setServico} value={servico}>
                                        <SelectTrigger className="w-full" aria-label="Serviço">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UNITEL">UNITEL</SelectItem>
                                            <SelectItem value="ENDE">ENDE</SelectItem>
                                            <SelectItem value="MOVICEL">MOVICEL</SelectItem>
                                            <SelectItem value="AFRICELL">AFRICELL</SelectItem>
                                            <SelectItem value="ELEPHANTBET">ELEPHANTBET</SelectItem>
                                            <SelectItem value="DSTV">DSTV</SelectItem>
                                            <SelectItem value="BANTUBET">BANTUBET</SelectItem>
                                            <SelectItem value="ZAP">ZAP</SelectItem>
                                            <SelectItem value="ZAP FIBRA">ZAP FIBRA</SelectItem>
                                            <SelectItem value="PREMIERBET">PREMIERBET</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>

                            <div className="ui-export-field-row">
                                <DateField
                                    label="Data inicial"
                                    value={queryParams.dataInicial}
                                    onChange={(event) => setQueryParams({ ...queryParams, dataInicial: event.target.value })}
                                />
                                <DateField
                                    label="Data final"
                                    value={queryParams.dataFinal}
                                    onChange={(event) => setQueryParams({ ...queryParams, dataFinal: event.target.value })}
                                />
                            </div>
                        </div>

                        <SheetFooter className="ui-export-footer">
                            <Button disabled={loading} className="ui-export-submit" type="submit" variant="brand">
                                {loading ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /><span>A agendar...</span></> : "Agendar"}
                            </Button>
                        </SheetFooter>
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}
