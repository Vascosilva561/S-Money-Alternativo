import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DateField, FormField, TextField } from "@/components/ui/form-field"
import { X } from "lucide-react"


type props = {
    isOpen: boolean,
    onClose: () => void,
    queryParams: any,
    setQueryParams: (e: any) => void
    filter: (currentPage: number) => void
    setIsFiltered: (e: any) => void
    setShowFilter: (e: any) => void
    
    setEstadoDoPagamento: (value: string) => void,
    estadoDoPagamento: string,
    servico: string,
    setServico: (value:string)=>void,

    setTipoDeConta: (value: string) => void,
    tipoDeConta: string,
}


export default function FilterPayments({ onClose, isOpen, queryParams, setQueryParams, servico, setServico,
    filter, setIsFiltered, setShowFilter, setEstadoDoPagamento, estadoDoPagamento,
     tipoDeConta, setTipoDeConta

}: props) {

    const mostraLimparFiltro = () => {

        setShowFilter(Boolean(
            queryParams.users_name || queryParams.beneficiario || queryParams.dataInicial ||
            queryParams.dataFinal || estadoDoPagamento || servico || tipoDeConta
        ))
    }

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-filter-sheet-panel w-full overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="p-0">
                            <SheetTitle>Filtrar pagamentos</SheetTitle>
                            <SheetDescription>Defina os critérios para refinar a lista de pagamentos.</SheetDescription>
                        </SheetHeader>
                        <SheetClose aria-label="Fechar filtros">
                            <X className="size-4" aria-hidden="true" />
                        </SheetClose>
                    </div>

                    <div className="space-y-5">
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
                            value={queryParams.users_name}
                            onChange={(event) => setQueryParams({ ...queryParams, users_name: event.target.value })}
                        />
                        <TextField
                            label="Beneficiário (nome/telemóvel)"
                            type="text"
                            value={queryParams.beneficiario}
                            onChange={(event) => setQueryParams({ ...queryParams, beneficiario: event.target.value })}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="Estado do pagamento">
                                <Select onValueChange={setEstadoDoPagamento} value={estadoDoPagamento}>
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                        <SheetClose asChild>
                            <Button
                                onClick={() => {
                                    setIsFiltered(true)
                                    mostraLimparFiltro()
                                    filter(1)
                                }}
                                className="h-11 w-full"
                                type="button"
                                variant="brand"
                            >
                                Filtrar
                            </Button>
                        </SheetClose>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}
