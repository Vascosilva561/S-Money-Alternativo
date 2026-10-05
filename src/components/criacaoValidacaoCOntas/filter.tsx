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
import provinvia from "../json/provincias.json"
import municipios from "../json/municipios.json"

type props = {
    isOpen: boolean,
    onClose: () => void,
    queryParams: any,
    setQueryParams: (e: any) => void
    setStatusParam: (e: any) => void
    filter: (currentPage: number) => void
    setIsFiltered: (e: any) => void
    setShowFilter: (e: any) => void
    statusParam: string,
    typeAccount: boolean,
    setCurrentPage: (page: number) => void
}


export default function FilterUsuario({ onClose, isOpen, queryParams, setQueryParams, setStatusParam, statusParam, filter, setIsFiltered, setShowFilter, typeAccount, setCurrentPage }: props) {

    const mostraLimparFiltro = () => {

        if (queryParams.name !== "" || queryParams.phone_number !== "" || queryParams.nif !== "" || queryParams.email !== "" ||
            queryParams.business_name !== "" || statusParam !== "" || queryParams.bi !== "" || queryParams.passaporte !== "" ||
            queryParams.provincia_id !== "" || queryParams.municipio !== "") {
            setShowFilter(true)
        }
    }


    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(queryParams?.provincia_id))

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

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">{typeAccount ? "Utilizador" : "Empresa"}</label>
                            <input type="text" value={queryParams.name} onChange={(e) => setQueryParams({ ...queryParams, name: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] font-semibold text-sm">{typeAccount ? "Documento de identificação" : "NIF"}</label>
                            <input type="text" value={queryParams.bi || queryParams.passaporte || ""} onChange={(e) => setQueryParams({ ...queryParams, bi: e.target.value, passaporte: "" })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>
                        {!typeAccount &&
                            <div className="flex flex-col space-y-2 mt-6">
                                <label className="text-[#143163] font-semibold text-sm">Email</label>
                                <input type="email" value={queryParams.email} onChange={(e) => setQueryParams({ ...queryParams, email: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>}

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-sm">Número de Telemóvel</label>
                            <input type="text" value={queryParams.phone_number} onChange={(e) => setQueryParams({ ...queryParams, phone_number: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Província</label>
                                <Select
                                    value={queryParams?.provincia_id || "all"}
                                    onValueChange={(value) => setQueryParams({ ...queryParams, provincia_id: value === "all" ? "" : value, municipio: "" })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {provinvia?.provincia?.map((item) => (
                                            <SelectItem key={item?.id} value={String(item?.id)}>{item?.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Município</label>
                                <Select
                                    value={queryParams?.municipio || "all"}
                                    onValueChange={(value) => setQueryParams({ ...queryParams, municipio: value === "all" ? "" : value })}
                                    disabled={!queryParams?.provincia_id}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {municipioLista?.map((item) => (
                                            <SelectItem key={item?.id} value={item?.nome}>{item?.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-sm">Estado da Conta</label>
                            <Select onValueChange={setStatusParam}>
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
                        {/* <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold ">Responsável da Operação</label>
                            <Select onValueChange={setQueryParams}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="10">Conta Particular</SelectItem>
                                    <SelectItem value="20">Conta Empresa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}


                        <SheetClose asChild>
                            <Button onClick={() => {
                            setIsFiltered(true)
                            mostraLimparFiltro()
                            setCurrentPage(1)
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
