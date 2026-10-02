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

        if (queryParams.user_name_phone !== "" || queryParams.destinatario !== "" ||
            queryParams.dataInicial !== "" || queryParams.dataFinal !== "" ||
            queryParams?.montante_de !== "" || queryParams?.montante_ate !== ""

        ) {
            setShowFilter(true)
        }
    }
    const checkFilter = () => {
        if (tipoDeTransacao==="" && (status !== "" || queryParams?.valor_ate !== "" || queryParams?.valor_de !== "")) {
            toast.error(`Selecione o tipo de Transação`, {
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
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0" description="Defina os critérios que pretende aplicar para refinar a lista.">Filtrar Dados</SheetHeader>
                        <SheetClose aria-label="Fechar filtros" className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <div className="">

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-sm">Tipo de Conta</label>
                            <Select onValueChange={setTipoDeConta} value={tipoDeConta}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">Particular</SelectItem>
                                    <SelectItem value="Merchant">Empresa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> 
                        <div className="flex flex-col space-y-2 mt-5  w-full">
                            <label className="text-[#143163] font-semibold text-sm">Tipo de Transação</label>
                            <Select onValueChange={setTipoDeTransacao} value={tipoDeTransacao}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Transaction">Transferência</SelectItem>
                                    <SelectItem value="Withdrawal">Levantamento</SelectItem>
                                    <SelectItem value="PgsPayment">Pagamento</SelectItem>
                                    <SelectItem value="PaymentReferences">Pag.Referência</SelectItem>
                                    <SelectItem value="DepositGpoFrame">Depósito</SelectItem>
                                    <SelectItem value="CampaignReward">Promoção</SelectItem>
                                    <SelectItem value="Referral">Bónus de convite</SelectItem>
                                    <SelectItem value="MerchantTransaction">Transacção via API</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-between space-x-2 w-full items-center">
                            <div className="flex flex-col space-y-2 mt-5 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Tipo de Movimento</label>
                                <Select onValueChange={setTipoDeMovimento} value={tipoDeMovimento}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="CREDIT">Crédito</SelectItem>
                                        <SelectItem value="DEBIT">Débito </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        <div className="flex justify-between space-x-2">

                            <div className="flex flex-col space-y-2 mt-5 w-full min-w-0">
                                <label className="text-[#143163] font-semibold text-[14px]">Valor (De)</label>
                                <input type="number" value={queryParams.valor_de} onChange={(e) => setQueryParams({ ...queryParams, valor_de: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex justify-between space-x-2 w-full items-center min-w-0">
                                <div className="flex flex-col space-y-2 mt-5  w-full">
                                    <label className="text-[#143163] font-semibold text-sm">Valor (Até)</label>
                                    <input type="number" value={queryParams.valor_ate} onChange={(e) => setQueryParams({ ...queryParams, valor_ate: e.target.value })}
                                        className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">Utilizador (Nome/Telemóvel)</label>
                            <input type="email" value={queryParams.name} onChange={(e) => setQueryParams({ ...queryParams, name: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex justify-between space-x-2 w-full items-center">
                            <div className="flex flex-col space-y-2 mt-5  w-full">
                                <label className="text-[#143163] font-semibold text-sm">Estado</label>
                                <Select onValueChange={setStatus} value={status}>
                                    <SelectTrigger className="w-full">
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
                            </div>

                        </div>

                        <div className="flex justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-5 w-full ">
                                <label className="text-[#143163] font-semibold text-sm">Data Inicial</label>
                                <input type="date" value={queryParams.dataInicial} onChange={(e) => setQueryParams({ ...queryParams, dataInicial: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex flex-col space-y-2 mt-5 w-full ">
                                <label className="text-[#143163] font-semibold text-sm">Data Final</label>
                                <input type="date" value={queryParams.dataFinal} onChange={(e) => setQueryParams({ ...queryParams, dataFinal: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                        </div>

                        <Button onClick={() => {
                            checkFilter()
                        }} className="h-11 w-full rounded-lg bg-[#143163] text-white hover:bg-[#1D467F]"
                            type="button" variant="brand">
                            Filtrar
                        </Button>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}
