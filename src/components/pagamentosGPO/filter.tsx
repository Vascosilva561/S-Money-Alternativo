import * as React from "react"
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

type GpoPaymentFilters = {
    merchant_id: string
    merchant_number: string
    business_name: string
    status: string
    payment_reference: string
    transaction_reference: string
    phone_number: string
    external_payment_id: string
    montante_de: string
    montante_ate: string
    data_inicio: string
    data_fim: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    filter: (page?: number) => void
    queryParams: GpoPaymentFilters
    setQueryParams: React.Dispatch<React.SetStateAction<GpoPaymentFilters>>
}

export default function FilterGpoPayments({
    isOpen,
    onClose,
    filter,
    queryParams,
    setQueryParams,
}: Props) {
    const handleChange = (field: keyof GpoPaymentFilters, value: string) => {
        setQueryParams((previous) => ({
            ...previous,
            [field]: value,
        }))
    }

    const applyFilters = () => {
        filter(1)
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="ui-filter-sheet-panel ui-gpo-filter-sheet w-full overflow-hidden p-5 sm:max-w-[620px] sm:p-6">
                <div className="flex w-full items-start justify-between gap-4 border-b border-[#E5EBF4] pb-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Filtrar pagamentos GPO</SheetTitle>
                        <SheetDescription>Defina os critérios para refinar a lista de pagamentos.</SheetDescription>
                    </SheetHeader>
                    <SheetClose aria-label="Fechar filtros" className="ui-gpo-sheet-close">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-gpo-filter-grid grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <TextField
                        label="Nº do comerciante"
                        type="text"
                        value={queryParams.merchant_number}
                        onChange={(event) => handleChange("merchant_number", event.target.value)}
                        placeholder="Digite o número do comerciante"
                    />

                    <TextField
                        label="Nome da empresa"
                        type="text"
                        value={queryParams.business_name}
                        onChange={(event) => handleChange("business_name", event.target.value)}
                        placeholder="Digite o nome da empresa"
                    />

                    <FormField label="Estado">
                        <Select
                            value={queryParams.status}
                            onValueChange={(value) => handleChange("status", value)}
                        >
                            <SelectTrigger className="w-full" aria-label="Estado">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PAID">Concluído</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="REJECTED">Falhou</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <TextField
                        label="Referência do pagamento"
                        type="text"
                        value={queryParams.payment_reference}
                        onChange={(event) => handleChange("payment_reference", event.target.value)}
                        placeholder="Digite a referência"
                    />

                    <TextField
                        label="Referência da transação"
                        type="text"
                        value={queryParams.transaction_reference}
                        onChange={(event) => handleChange("transaction_reference", event.target.value)}
                        placeholder="Digite a referência da transação"
                    />

                    <TextField
                        label="Número de telemóvel"
                        type="text"
                        value={queryParams.phone_number}
                        onChange={(event) => handleChange("phone_number", event.target.value)}
                        placeholder="Digite o número"
                    />

                    <TextField
                        label="External Payment ID"
                        containerClassName="ui-gpo-filter-external-id"
                        type="text"
                        value={queryParams.external_payment_id}
                        onChange={(event) => handleChange("external_payment_id", event.target.value)}
                        placeholder="Digite o External Payment ID"
                    />

                    <div className="ui-gpo-filter-range grid grid-cols-2 gap-3">
                        <TextField
                            label="Montante mínimo"
                            type="number"
                            value={queryParams.montante_de}
                            onChange={(event) => handleChange("montante_de", event.target.value)}
                            placeholder="0,00"
                        />
                        <TextField
                            label="Montante máximo"
                            type="number"
                            value={queryParams.montante_ate}
                            onChange={(event) => handleChange("montante_ate", event.target.value)}
                            placeholder="0,00"
                        />
                    </div>

                    <DateField
                        label="Data inicial"
                        value={queryParams.data_inicio}
                        onChange={(event) => handleChange("data_inicio", event.target.value)}
                    />
                    <DateField
                        label="Data final"
                        value={queryParams.data_fim}
                        onChange={(event) => handleChange("data_fim", event.target.value)}
                    />
                </div>

                <SheetFooter className="ui-gpo-filter-footer">
                    <Button onClick={applyFilters} className="h-11 w-full" type="button" variant="brand">
                        Filtrar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
