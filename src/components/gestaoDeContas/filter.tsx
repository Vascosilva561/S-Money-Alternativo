import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"
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
    setSituacaoParam: (value:string)=>void,
    situacaoParam: string,
    setNivelParam: (value:string)=>void,
    nivelParam: string,
    setNacionalidade: (value:string)=>void,
    nacionalidadeParam: string,
    

}


export default function FilterCounts({ onClose, isOpen, queryParams, setQueryParams, setStatusParam, statusParam,
     filter, setIsFiltered, setShowFilter, typeAccount,  setSituacaoParam,
    situacaoParam,
    setNivelParam,
    nivelParam,
    setNacionalidade,
    nacionalidadeParam,}: props) {

    const mostraLimparFiltro = () => {

        if (queryParams.name !== "" || queryParams.phone_number !== "" || queryParams.nif !== "" || queryParams.email !== "" ||
            queryParams.business_name !== "" || statusParam !== "" || queryParams.bi !== "" || queryParams.passaporte !== "" ||
            queryParams.provincia_id !== "" || queryParams.municipio !== "" || queryParams.dataAdesaoInicial !== "" ||
            queryParams.dataAdesaoFinal !== "" || nacionalidadeParam !== "" || situacaoParam !== "" || nivelParam !== ""
        
        ) {
            setShowFilter(true)
        }
    }


    const municipioLista = municipios?.municipios?.filter((item) => item?.provincia_id === Number(queryParams?.provincia_id))

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent className="ui-filter-sheet-panel w-full overflow-hidden p-5 sm:max-w-[440px] sm:p-6">
                    <div className="flex items-start justify-between gap-4 w-full border-b border-[#E5EBF4] pb-4">
                        <SheetHeader className="p-0" description="Defina os critérios que pretende aplicar para refinar a lista.">
                            <SheetTitle className="text-lg font-semibold text-[#143163]">Filtrar Dados</SheetTitle>
                        </SheetHeader>
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
                        {!typeAccount &&
                            <div className="flex flex-col space-y-2 mt-6">
                                <label className="text-[#143163] font-semibold text-sm">Email</label>
                                <input type="email" value={queryParams.email} onChange={(e) => setQueryParams({ ...queryParams, email: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>}

                        <div className="flex w-full justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">{typeAccount ? "Bilhete de Identidade" : "NIF"}</label>
                                <input type="text" value={queryParams.bi} onChange={(e) => setQueryParams({ ...queryParams, bi: e.target.value })}
                                    className={`p-2 w-full ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            {typeAccount && <div className="flex flex-col space-y-2 mt-6 w-full ">
                                <label className="text-[#143163] font-semibold text-sm">Número do Passaporte</label>
                                <input type="text" value={queryParams.passaporte} onChange={(e) => setQueryParams({ ...queryParams, passaporte: e.target.value })}
                                    className={`p-2 w-full ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>}
                        </div>


                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] font-semibold text-[14px]">Número de Telemóvel</label>
                            <input type="text" value={queryParams.phone_number} onChange={(e) => setQueryParams({ ...queryParams, phone_number: e.target.value })}
                                className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                        </div>


                        <div className="flex justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Província</label>
                                <select required value={queryParams.provincia_id} onChange={(e) => setQueryParams({ ...queryParams, provincia_id: e.target.value })}
                                    className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                    <option value={""}>Selecione...</option>
                                    {provinvia?.provincia?.map((item) => (
                                        <option key={item?.id} value={item?.id}>
                                            {item?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-[14px]">Município</label>
                                <select required value={queryParams.municipio} onChange={(e) => setQueryParams({ ...queryParams, municipio: e.target.value })}
                                    className="p-2 ring-1 rounded-[8px] ring-[#ADCBD0] focus:ring-[#7D8CA6] text-[#143163] text-sm">
                                    <option value={""}>Selecione...</option>
                                    {municipioLista?.map((item) => (
                                        <option key={item?.id} value={item?.nome}>
                                            {item?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Nacionalidade</label>
                                <Select onValueChange={setNacionalidade} value={nacionalidadeParam}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="Nacional">Nacional</SelectItem>
                                        <SelectItem value="Estrangeiro">Estrangeiro</SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Estado da Conta</label>
                                <Select onValueChange={setStatusParam} value={statusParam}>
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
                        </div>
                        <div className="flex w-full justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Situação do utilizador</label>
                                <Select onValueChange={setSituacaoParam} value={situacaoParam}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="Active">Activo</SelectItem>
                                        <SelectItem value="Desactivado">Desactivado</SelectItem>
                                        <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Nível da Conta</label>
                                <Select onValueChange={setNivelParam} value={nivelParam}>
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
                        <div className="flex w-full justify-between space-x-2">
                            <div className="flex flex-col space-y-2 mt-6 w-full">
                                <label className="text-[#143163] font-semibold text-sm">Data de Adesão (Inicial)</label>
                                <input type="date" value={queryParams.dataAdesaoInicial} onChange={(e) => setQueryParams({ ...queryParams, dataAdesaoInicial: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>
                            {typeAccount && <div className="flex flex-col space-y-2 mt-6 w-full ">
                                <label className="text-[#143163] font-semibold text-sm">Data de Adesão (Final)</label>
                                <input type="date" value={queryParams.dataAdesaoFinal} onChange={(e) => setQueryParams({ ...queryParams, dataAdesaoFinal: e.target.value })}
                                    className={`p-2 ring-1 rounded-[6px] ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm`} />
                            </div>}
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
