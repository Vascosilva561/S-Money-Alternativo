import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { MerchantUser } from "@/pages/configGPO"
import { getGpoConfigurationPresentation, getStatusPresentation, isGpoConfigured } from "@/components/ConfigsMerchants/gpoStatus"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

const AVAILABLE_PERMISSIONS = [
    {
        label: "Cash In",
        permissions: [
            { value: "cash_in:create", label: "Criar" },
            { value: "cash_in:read", label: "Consultar" },
        ],
    },
    {
        label: "Cash Out",
        permissions: [
            { value: "cash_out:create", label: "Criar" },
            { value: "cash_out:read", label: "Consultar" },
        ],
    },
    {
        label: "Transferência",
        permissions: [
            { value: "transfer:create", label: "Criar" },
            { value: "transfer:read", label: "Consultar" },
        ],
    },
    {
        label: "Pagamento por Referência",
        permissions: [
            { value: "payment_reference:create", label: "Criar" },
            { value: "payment_reference:read", label: "Consultar" },
        ],
    },
    {
        label: "Pagamento GPO",
        permissions: [
            { value: "payment_gpo:create", label: "Criar" },
            { value: "payment_gpo:read", label: "Consultar" },
        ],
    },
]

type Props = {
    isOpen: boolean
    onClose: () => void
    itemSelected: MerchantUser | null
}

export default function DetailsMerchant({
    onClose,
    isOpen,
    itemSelected,
}: Props) {
    const [selectedServiceAccountId, setSelectedServiceAccountId] = useState("")

    useEffect(() => {
        setSelectedServiceAccountId(
            itemSelected?.service_accounts?.find((account) => account.id)?.id ?? ""
        )
    }, [itemSelected])

    const serviceAccounts = itemSelected?.service_accounts?.filter((account) => Boolean(account.id)) ?? []
    const selectedServiceAccount = serviceAccounts.find((account) => account.id === selectedServiceAccountId)
    const permissions = selectedServiceAccount?.permissions ?? []
    const assignedPermissionGroups = AVAILABLE_PERMISSIONS
        .map((group) => ({
            ...group,
            assignedPermissions: group.permissions.filter((permission) => permissions.includes(permission.value)),
        }))
        .filter((group) => group.assignedPermissions.length > 0)
    const assignedPermissionCount = assignedPermissionGroups.reduce(
        (count, group) => count + group.assignedPermissions.length,
        0,
    )

    const formatAmount = (value: number | null) => {
        if (value === null || value === undefined) {
            return "—"
        }

        return value.toLocaleString("pt-AO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const formatBoolean = (value: boolean | null | undefined) => {
        if (value === null || value === undefined) {
            return "—"
        }

        return value ? "Activa" : "Inactiva"
    }

    return (
        <Sheet
            onOpenChange={onClose}
            open={isOpen}
        >
            <SheetContent className="ui-detail-sheet ui-detail-sheet--structured ui-gpo-detail-sheet w-full">
                <div className="ui-detail-sheet-header flex w-full items-start justify-between gap-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>Detalhes do comerciante</SheetTitle>
                        <SheetDescription>Consulte os dados do comerciante e a sua configuração GPO.</SheetDescription>
                    </SheetHeader>

                    <SheetClose aria-label="Fechar detalhes do comerciante" className="ui-gpo-sheet-close">
                        <X className="size-4" aria-hidden="true" />
                    </SheetClose>
                </div>

                <div className="ui-detail-sheet-body ui-gpo-detail-body">
                <div className="ui-gpo-detail-content">

                    {/* ==================== */}
                    {/* DADOS BÁSICOS */}
                    {/* ==================== */}

                    <section className="ui-gpo-detail-section">
                        <p className="font-semibold text-[#143163]">
                            Dados do comerciante
                        </p>

                        <div className="ui-gpo-detail-divider" />

                        {itemSelected && (
                            <div className="ui-gpo-detail-list text-sm text-[#143163]">

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Comerciante:</p>

                                    <p className="ui-gpo-detail-value">
                                        {itemSelected.business_name || "—"}
                                        <span className="block text-xs text-[#8998B1]">
                                            {itemSelected.email || "—"}
                                        </span>
                                    </p>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Contacto:</p>

                                    <p className="ui-gpo-detail-value">
                                        {itemSelected.phone_number || "—"}
                                        {itemSelected.user_document?.city && (
                                            <span className="block text-xs text-[#8998B1]">
                                                {itemSelected.user_document.city}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">NIF:</p>

                                    <p className="ui-gpo-detail-value">
                                        {itemSelected.nif || "—"}
                                    </p>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Nº do comerciante:</p>

                                    <p className="ui-gpo-detail-value">
                                        {itemSelected.merchant_payment_number || "—"}
                                    </p>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Estado da conta:</p>

                                    <div className="ui-gpo-detail-value"><span className={`ui-status-tag ${getStatusPresentation(itemSelected.status).className}`}>{getStatusPresentation(itemSelected.status).label}</span></div>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Integração:</p>

                                    <div className="ui-gpo-detail-value">
                                        <span className={`ui-status-tag ${itemSelected.integration == null
                                            ? "bg-[#F3F4F6] text-[#374151]"
                                            : itemSelected.integration
                                                ? "bg-[#DEF7EC] text-[#03543F]"
                                                : "bg-[#FDE8E8] text-[#9B1C1C]"
                                            }`}>
                                            {formatBoolean(itemSelected.integration)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ==================== */}
                    {/* GPO */}
                    {/* ==================== */}

                    <section className="ui-gpo-detail-section">
                        <p className="font-semibold text-[#143163]">
                            Configuração GPO
                        </p>

                        <div className="ui-gpo-detail-divider" />

                        {itemSelected && (
                            <div className="ui-gpo-detail-list text-sm text-[#143163]">

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">GPO configurado?</p>

                                    <div className="ui-gpo-detail-value">
                                        <span className={`ui-status-tag ${isGpoConfigured(itemSelected.gpo_min_amount_per_trx, itemSelected.gpo_max_amount_per_trx) ? "bg-[#DEF7EC] text-[#03543F]" : "bg-[#F3F4F6] text-[#374151]"}`}>
                                            {isGpoConfigured(itemSelected.gpo_min_amount_per_trx, itemSelected.gpo_max_amount_per_trx) ? "Sim" : "Não"}
                                        </span>
                                    </div>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Estado da configuração:</p>

                                    <div className="ui-gpo-detail-value">
                                        <span className={`ui-status-tag ${getGpoConfigurationPresentation(itemSelected.gpo_status).className}`}>
                                            {getGpoConfigurationPresentation(itemSelected.gpo_status).label}
                                        </span>
                                    </div>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Cobrança GPO:</p>

                                    <span className="ui-gpo-detail-value ui-status-tag bg-[#DDEAFE] text-[#1D4ED8]">
                                        {itemSelected.gpo_billing !== null &&
                                            itemSelected.gpo_billing !== undefined
                                            ? `${itemSelected.gpo_billing}%`
                                            : "—"}
                                    </span>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Valor mínimo por transação:</p>

                                    <p className="ui-gpo-detail-value">
                                        {formatAmount(
                                            itemSelected.gpo_min_amount_per_trx
                                        )}{" "}
                                        {itemSelected.gpo_min_amount_per_trx !== null
                                            ? "Kz"
                                            : ""}
                                    </p>
                                </div>

                                <div className="ui-gpo-detail-row">
                                    <p className="ui-gpo-detail-label">Valor máximo por transação:</p>

                                    <p className="ui-gpo-detail-value">
                                        {formatAmount(
                                            itemSelected.gpo_max_amount_per_trx
                                        )}{" "}
                                        {itemSelected.gpo_max_amount_per_trx !== null
                                            ? "Kz"
                                            : ""}
                                    </p>
                                </div>

                            </div>
                        )}
                    </section>

                    <section className="ui-gpo-detail-section">
                        <div>
                            <p className="text-[15px] font-semibold leading-[22px] text-[#143163]">Conta de serviço e permissões</p>
                            <p className="mt-1 text-xs text-[#8998B1]">
                                As permissões apresentadas pertencem à conta selecionada.
                            </p>
                        </div>
                        <div className="ui-gpo-detail-divider" />

                        {serviceAccounts.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#D8E2F0] bg-[#F8FAFD] px-4 py-6 text-center">
                                <p className="text-sm font-medium text-[#143163]">Nenhuma conta de serviço configurada</p>
                                <p className="mt-1 text-xs text-[#8998B1]">As contas de serviço deste comerciante aparecerão aqui.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-[#DCE5F2] bg-white">
                                <div className="grid gap-3 border-b border-[#E6ECF4] bg-[#F7F9FC] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)] sm:items-end">
                                    <div>
                                        <p className="text-sm font-semibold text-[#143163]">Conta de serviço</p>
                                        <p className="mt-1 text-xs text-[#8998B1]">
                                            {serviceAccounts.length} {serviceAccounts.length === 1 ? "conta disponível" : "contas disponíveis"}
                                        </p>
                                    </div>
                                    <Select
                                        value={selectedServiceAccountId}
                                        onValueChange={setSelectedServiceAccountId}
                                    >
                                        <SelectTrigger aria-label="Conta de serviço" className="h-11 w-full border-[#CBD8E9] bg-white text-sm">
                                            <SelectValue placeholder="Selecione uma conta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceAccounts.map((account) => (
                                                <SelectItem key={account.id ?? account.name ?? "service-account"} value={account.id ?? ""}>
                                                    {account.name || "Conta de serviço"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 sm:p-5" aria-live="polite">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[#143163]">Permissões atribuídas</p>
                                            {selectedServiceAccount?.name && (
                                                <p className="mt-1 text-xs text-[#8998B1]">
                                                    Associadas a {selectedServiceAccount.name}
                                                </p>
                                            )}
                                        </div>
                                        <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-[#275DB3]">
                                            {assignedPermissionCount} {assignedPermissionCount === 1 ? "permissão" : "permissões"}
                                        </span>
                                    </div>

                                    {assignedPermissionGroups.length > 0 ? (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {assignedPermissionGroups.map((group) => (
                                                <div key={group.label} className="rounded-xl border border-[#E5EBF4] bg-white p-3.5">
                                                    <p className="mb-3 text-sm font-semibold text-[#143163]">{group.label}</p>
                                                    <ul className="flex flex-wrap gap-2">
                                                        {group.assignedPermissions.map((permission) => (
                                                            <li
                                                                key={permission.value}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2F7F4] px-2.5 py-1.5 text-xs font-medium text-[#28634D]"
                                                            >
                                                                <Check className="size-3.5" aria-hidden="true" />
                                                                {permission.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-[#D8E2F0] bg-[#F8FAFD] px-4 py-6 text-center">
                                            <p className="text-sm font-medium text-[#143163]">Sem permissões atribuídas</p>
                                            <p className="mt-1 text-xs text-[#8998B1]">Selecione outra conta para consultar as permissões associadas.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ==================== */}
                    {/* CONCLUÍDO */}
                    {/* ==================== */}

                </div>
                </div>

                <SheetFooter className="ui-detail-sheet-footer">
                    <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                        Concluído
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
