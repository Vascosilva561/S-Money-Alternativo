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
import { CircleAlert, X } from "lucide-react"
import { toast } from "sonner"

type props = {
    isOpen: boolean,
    onClose: () => void,
    queryParams: any,
    setQueryParams: (e: any) => void
    filter: (currentPage: number) => void
    setIsFiltered: (e: any) => void
    setShowFilter: (e: any) => void

    setStatus: (value: string) => void,
    status: string,

    setTipoDeConta: (value: "User" | "Merchant") => void,
    tipoDeConta: "User" | "Merchant" | "",
    setTipoDeMovimento: (value: string) => void,
    setTipoDeTransacao: (value: "DepositGpoFrame" | "PgsPayment" | "Withdrawal" | "Transaction" | "PaymentReferences" | "CampaignReward" | "Referral" | "MerchantTransaction" | "") => void
    tipoDeTransacao: string
    tipoDeMovimento: string
}

export default function FilterMovimentos({ onClose, isOpen, queryParams, setQueryParams, status, setStatus, tipoDeMovimento,
    setTipoDeMovimento, tipoDeTransacao, setTipoDeTransacao, filter, setIsFiltered, setShowFilter, 
    tipoDeConta, setTipoDeConta

}: props) {

    const mostraLimparFiltro = () => {

        setShowFilter(Boolean(
            queryParams.name || queryParams.iban || queryParams.dataInicial || queryParams.dataFinal ||
            queryParams.valor_de || queryParams.valor_ate || status || tipoDeConta || tipoDeMovimento || tipoDeTransacao
        ))
    }
    const checkFilter = () => {
        if (tipoDeTransacao==="" && (status !== "" || queryParams?.valor_ate !== "" || queryParams?.valor_de !== "")) {
            toast.error(`Selecione o tipo de Transação`, {
                icon: <CircleAlert className="size-5 text-[#B42318]" aria-hidden="true" />,
                style: {
                    borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                },
                duration: 2000

            })
            return
        }
        else {
            setIsFiltered(true)
            mostraLimparFiltro()
            filter(1)
            onClose()
        }
    }
    //console.log(status)
    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-filter-sheet-panel w-full overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="p-0">
                            <SheetTitle>Filtrar movimentos</SheetTitle>
                            <SheetDescription>Defina os critérios para refinar a lista de movimentos.</SheetDescription>
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

                        <FormField label="Tipo de transação">
                            <Select onValueChange={setTipoDeTransacao} value={tipoDeTransacao}>
                                <SelectTrigger className="w-full" aria-label="Tipo de transação">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Transaction">Transferência</SelectItem>
                                    <SelectItem value="Withdrawal">Levantamento</SelectItem>
                                    <SelectItem value="PgsPayment">Pagamento</SelectItem>
                                    <SelectItem value="PaymentReferences">Pag. Referência</SelectItem>
                                    <SelectItem value="DepositGpoFrame">Depósito</SelectItem>
                                    <SelectItem value="CampaignReward">Promoção</SelectItem>
                                    <SelectItem value="Referral">Bónus de convite</SelectItem>
                                    <SelectItem value="MerchantTransaction">Transacção via API</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Tipo de movimento">
                            <Select onValueChange={setTipoDeMovimento} value={tipoDeMovimento}>
                                <SelectTrigger className="w-full" aria-label="Tipo de movimento">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CREDIT">Crédito</SelectItem>
                                    <SelectItem value="DEBIT">Débito</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Valor (de)"
                                type="number"
                                value={queryParams.valor_de}
                                onChange={(event) => setQueryParams({ ...queryParams, valor_de: event.target.value })}
                            />
                            <TextField
                                label="Valor (até)"
                                type="number"
                                value={queryParams.valor_ate}
                                onChange={(event) => setQueryParams({ ...queryParams, valor_ate: event.target.value })}
                            />
                        </div>

                        <TextField
                            label="Utilizador (nome/telemóvel)"
                            type="text"
                            value={queryParams.name}
                            onChange={(event) => setQueryParams({ ...queryParams, name: event.target.value })}
                        />

                        <FormField label="Estado">
                            <Select onValueChange={setStatus} value={status}>
                                <SelectTrigger className="w-full" aria-label="Estado">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={
                                        tipoDeTransacao === "Withdrawal" || tipoDeTransacao === "DepositGpoFrame"
                                            ? "ACCEPTED"
                                            : tipoDeTransacao === "Transaction"
                                                ? "PAID"
                                                : tipoDeTransacao === "MerchantTransaction"
                                                    ? "APPROVED"
                                                    : "SUCCESS"
                                    }>Concluído</SelectItem>
                                    {tipoDeTransacao !== "PgsPayment" && <SelectItem value="PENDING">Pendente</SelectItem>}
                                    <SelectItem value={tipoDeTransacao === "PgsPayment" ? "ERROR" : "REJECTED"}>Falhou</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

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

                        <Button onClick={checkFilter} className="h-11 w-full" type="button" variant="brand">
                            Filtrar
                        </Button>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}
