import { Button } from "@/components/ui/button"
import { DateField, FormField, TextField } from "@/components/ui/form-field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { X } from "lucide-react"

type DepositFilters = {
    user_name_phone: string
    account_type: string
    dataInicial: string
    dataFinal: string
    montante_de: string
    montante_ate: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    queryParams: DepositFilters
    setQueryParams: React.Dispatch<React.SetStateAction<DepositFilters>>
    filter: (page: number) => void
    setIsFiltered: (value: boolean) => void
    setShowFilter: (value: boolean) => void
    canal: string
    setCanal: (value: string) => void
    status: string
    setStatus: (value: string) => void
    tipoDeConta: string
    setTipoDeConta: (value: string) => void
}

export default function FilterDepositsGPO({
    onClose,
    isOpen,
    queryParams,
    setQueryParams,
    status,
    setStatus,
    filter,
    setIsFiltered,
    setShowFilter,
    setCanal,
    canal,
    tipoDeConta,
    setTipoDeConta,
}: Props) {
    const hasFilter = Boolean(
        queryParams.user_name_phone.trim() ||
        queryParams.dataInicial ||
        queryParams.dataFinal ||
        queryParams.montante_de ||
        queryParams.montante_ate ||
        canal ||
        status !== "ACCEPTED" ||
        tipoDeConta !== "User"
    )

    const handleSubmit = () => {
        setIsFiltered(true)
        setShowFilter(hasFilter)
        filter(1)
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="ui-filter-sheet-panel ui-gpo-filter-sheet flex h-full w-full flex-col gap-0 overflow-hidden p-5 sm:p-6">
                <div className="flex w-full items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Filtrar depósitos GPO</SheetTitle>
                        <SheetDescription>Defina os critérios para refinar a lista de depósitos GPO.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar filtros de depósitos GPO" className="ui-gpo-sheet-close">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-gpo-filter-grid min-w-0 grid grid-cols-1 gap-x-6 gap-y-6 overflow-x-hidden py-6 sm:grid-cols-2">
                    <FormField label="Tipo de conta" className="sm:col-span-2">
                        <Select value={tipoDeConta || "ALL"} onValueChange={setTipoDeConta}>
                            <SelectTrigger className="h-10 w-full" aria-label="Tipo de conta"><SelectValue placeholder="Todas" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas</SelectItem>
                                <SelectItem value="User">Particular</SelectItem>
                                <SelectItem value="Merchant">Empresa</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <TextField
                        label="Utilizador (nome/telemóvel)"
                        type="text"
                        containerClassName="sm:col-span-2"
                        value={queryParams.user_name_phone}
                        onChange={(event) => setQueryParams((previous) => ({ ...previous, user_name_phone: event.target.value }))}
                        placeholder="Digite o nome ou telemóvel"
                    />

                    <TextField
                        label="Montante mínimo"
                        type="number"
                        min="0"
                        step="0.01"
                        value={queryParams.montante_de}
                        onChange={(event) => setQueryParams((previous) => ({ ...previous, montante_de: event.target.value }))}
                        placeholder="0,00"
                    />

                    <TextField
                        label="Montante máximo"
                        type="number"
                        min="0"
                        step="0.01"
                        value={queryParams.montante_ate}
                        onChange={(event) => setQueryParams((previous) => ({ ...previous, montante_ate: event.target.value }))}
                        placeholder="0,00"
                    />

                    <FormField label="Canal de entrada">
                        <Select value={canal || "ALL"} onValueChange={(value) => setCanal(value === "ALL" ? "" : value)}>
                            <SelectTrigger className="h-10 w-full" aria-label="Canal de entrada"><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="M. Express">M. Express</SelectItem>
                                <SelectItem value="P. Refenrencia">Por referência</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="Estado do depósito">
                        <Select value={status || "ALL"} onValueChange={setStatus}>
                            <SelectTrigger className="h-10 w-full" aria-label="Estado do depósito"><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="ACCEPTED">Concluído</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="REJECTED">Rejeitado</SelectItem>
                                <SelectItem value="EXPIRED">Expirado</SelectItem>
                                <SelectItem value="REFUNDED">Reembolso</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <DateField
                        label="Data inicial"
                        value={queryParams.dataInicial}
                        onChange={(event) => setQueryParams((previous) => ({ ...previous, dataInicial: event.target.value }))}
                    />
                    <DateField
                        label="Data final"
                        value={queryParams.dataFinal}
                        onChange={(event) => setQueryParams((previous) => ({ ...previous, dataFinal: event.target.value }))}
                    />
                </div>

                <SheetFooter className="ui-gpo-filter-footer mt-auto border-t border-[#E5EBF4] pt-4">
                    <SheetClose asChild>
                        <Button onClick={handleSubmit} className="h-11 w-full rounded-lg" type="button" variant="brand">
                            Filtrar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
