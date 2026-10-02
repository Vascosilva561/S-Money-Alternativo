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


type props = {
    isOpen: boolean,
    onClose: () => void,
    queryParams: any,
    setQueryParams: (e: any) => void
    filter: (currentPage: number) => void
    setIsFiltered: (e: any) => void
    setShowFilter: (e: any) => void
   
    canal: string,
    setCanal: (value:string)=>void,

    setStatus: (value: string) => void,
    status: string,

    setTipoDeConta: (value: string) => void,
    tipoDeConta: string,
}

export default function FilterDeposits({ onClose, isOpen, queryParams, setQueryParams, status, setStatus,
    filter, setIsFiltered, setShowFilter, setCanal, canal,
     tipoDeConta, setTipoDeConta

}: props) {

    const mostraLimparFiltro = () => {

        if (queryParams.user_name_phone !== "" || queryParams.destinatario !== "" ||
            queryParams.dataInicial !== "" || canal !== "" || queryParams.dataFinal !== "" || status !== "" ||
             tipoDeConta !== "" || queryParams?.montante_de !== "" || queryParams?.montante_ate !== ""

        ) {
            setShowFilter(true)
        }
    }

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

                        {/*<div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold ">ID da Transação</label>
                            <input type="text" value={queryParams.name} onChange={(e) => setQueryParams({ ...queryParams, name: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>*/}

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-sm">Tipo de Conta</label>
                            <Select onValueChange={setTipoDeConta} value={tipoDeConta}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="User">Particular</SelectItem>
                                    <SelectItem value="Merchant">Empresa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">Utilizador (Nome/Telemóvel)</label>
                            <input type="email" value={queryParams.user_name_phone} onChange={(e) => setQueryParams({ ...queryParams, user_name_phone: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex justify-between space-x-2">

                            <div className="flex flex-col space-y-2 mt-5 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Montante (De)</label>
                                <input type="number" value={queryParams.montante_de} onChange={(e) => setQueryParams({ ...queryParams, montante_de: e.target.value })}
                                className={`p-2 w-full ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            <div className="flex justify-between space-x-2 w-full items-center">
                                <div className="flex flex-col space-y-2 mt-5  w-full ">
                                    <label className="text-[#143163] font-semibold text-sm">Montante (Até)</label>
                                    <input type="number" value={queryParams.montante_ate} onChange={(e) => setQueryParams({ ...queryParams, montante_ate: e.target.value })}
                                className={`p-2 w-full ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between space-x-2">

                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Canal de Entrada</label>
                                <Select onValueChange={setCanal} value={canal}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Todos"/>
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="M. Express">M. Express</SelectItem>
                                            <SelectItem value="P. Refenrencia">P. Referência</SelectItem>
                                            
                                        </SelectContent>
                                    </Select>
                            </div>
                            <div className="flex justify-between space-x-2 w-full items-center">
                                <div className="flex flex-col space-y-2 mt-5  w-full">
                                    <label className="text-[#143163] font-semibold text-sm">Estado do Depósito</label>
                                    <Select onValueChange={setStatus} value={status}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Todos"/>
                                        </SelectTrigger>
                                        <SelectContent >
                                           <SelectItem value="ACCEPTED">Concluído</SelectItem>
                                            <SelectItem value="PENDING">Pendente</SelectItem>
                                            <SelectItem value="REJECTED">Expirado</SelectItem>
                                            <SelectItem value="REFUNDED">Reembolso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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

                        <SheetClose asChild>
                            <Button onClick={() => {
                            setIsFiltered(true)
                            mostraLimparFiltro()
                            filter(1)
                        }} className="h-11 w-full rounded-lg bg-[#143163] text-white hover:bg-[#1D467F]"
                            type="button" variant="brand">
                            Filtrar
                        </Button>
                        </SheetClose>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}
