import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,

} from "@/components/ui/sheet"
import { useEffect, useState } from "react"

import { getInitials } from "../utils/getInitials"
import { statusAccount } from "../utils/getColorStatusAccount"
import DadosSubmetidos from "./dadosSubmetidos"
import { statusUserColor } from "../utils/getSituacaoColor"
import { toast } from "sonner"
import { api } from "@/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CopyTextButton } from "@/components/ui/copy-text-button"
import { SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Eye, EyeOff, Hash, Link2, Trash2, Wallet, X } from "lucide-react"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetailsGestaoUsuario({ onClose, isOpen, itemSelected }: props) {

    const [mostraSaldo, setMostraSaldo] = useState(false)
    const [loadingReference, setLoadingReference] = useState(false)
    const [dadosUser, setDadosUser] = useState(true)  // estado do formulario, para dados do formulario ou submissao de documentos
    const [editingDocuments, setEditingDocuments] = useState(false)
    const queryClient = useQueryClient()
    const [loadingDeleteReference, setLoadingDeleteReference] = useState(false)
    const [confirmDeleteReference, setConfirmDeleteReference] = useState(false)

    const [loadingConsultingReference, setLoadingConsultingReference] = useState(false)
    const [hasReference, setHasReference] = useState(false)
    const [isIntegrator, setIsIntegrator] = useState<boolean>(itemSelected?.integration ?? false)

    const updateIntegrationMutation = useMutation({
        mutationFn: async (action: "enable" | "disable") => {
            if (!itemSelected?.id) throw new Error("ID da conta não encontrado")

            await api.put(`front/merchant/${itemSelected.id}/integration_${action}`)
            return action
        },
        onSuccess: (action) => {
            setIsIntegrator(action === "enable")
            queryClient.invalidateQueries({ queryKey: ["listaDeContas"] })
            toast.success("Integração actualizada com sucesso!")
        },
        onError: (error) => {
            console.error(error)
            toast.error("Erro ao actualizar a integração!")
        },
    })

    const handleIntegrationToggle = () => {
        if (!itemSelected?.id) {
            toast.error("Não foi possível aceder à conta seleccionada.")
            return
        }

        updateIntegrationMutation.mutate(isIntegrator ? "disable" : "enable")
    }

    const gerarReferencia = async () => {

        if (!itemSelected?.id) return toast.error("Não foi possivel acessar os detalhes do utilizador!");

        try {
            setLoadingReference(true)
            await api.put(`front/payment_reference/${itemSelected?.id}/gerar_referencia`)
            toast.success("Referência gerada com sucesso!")
            queryClient.invalidateQueries({
                queryKey: ['listaDeContas'],
                //exact: true,
            })


        } catch (error) {
            console.log(error)
            toast.error("Erro ao gerar referência!")
        } finally {
            setLoadingReference(false)
        }
    }
    const consultarReferencia = async () => {

        if (!itemSelected?.id) return toast.error("Não foi possivel acessar os detalhes do utilizador!");

        try {
            setLoadingConsultingReference(true)
            const res = await api.get(`front/payment_reference/${itemSelected?.id}/verificar_referencia`)
            setHasReference(true)
            console.log(res?.data, hasReference)
            queryClient.invalidateQueries({
                queryKey: ['listaDeContas'],
            })

        } catch (error) {
            console.log(error)
            setHasReference(false)

        } finally {
            setLoadingConsultingReference(false)
        }
    }
    const eliminarReferencia = async () => {

        if (!itemSelected?.id) return toast.error("Não foi possivel acessar os detalhes do utilizador!");

        try {
            setLoadingDeleteReference(true)
            await api.delete(`front/payment_reference/${itemSelected?.id}/delete_referencia`)
            toast.success("Referência eliminada com sucesso!")
            setHasReference(false)
            setConfirmDeleteReference(false)
            queryClient.invalidateQueries({
                queryKey: ['listaDeContas'],
            })

        } catch (error) {
            console.log(error)
            toast.error("Erro ao eliminar referência!")
        } finally {
            setLoadingDeleteReference(false)
        }
    }

    useEffect(() => {
        if (!itemSelected?.id) return console.log("Não foi possivel acessar os detalhes do utilizador!");
        consultarReferencia()
    }, [itemSelected])

    useEffect(() => {
        setIsIntegrator(itemSelected?.integration ?? false)
    }, [itemSelected?.id, itemSelected?.integration])

    useEffect(() => {
        setDadosUser(true)
        setEditingDocuments(false)
        setConfirmDeleteReference(false)
    }, [isOpen, itemSelected?.id])


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent className="ui-detail-sheet ui-detail-sheet--structured w-full">
                    <div className="ui-detail-sheet-header flex items-start justify-between gap-4 w-full">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                            <SheetTitle className="text-lg font-semibold text-[#143163]">Detalhes da conta</SheetTitle>
                            <SheetDescription>Dados e documentos da conta seleccionada.</SheetDescription>
                        </SheetHeader>
                        <SheetClose aria-label="Fechar detalhes" className="cursor-pointer rounded bg-[#DBDEE3] transition duration-300 hover:bg-[#C5C9CE]">
                            <X className="size-4" aria-hidden="true" />
                        </SheetClose>
                    </div>

                    <div>
                        <div className="ui-modal-tabs" role="tablist" aria-label="Detalhes da conta">
                            <button
                                type="button"
                                role="tab"
                                id="account-user-tab"
                                aria-controls="account-detail-panel"
                                aria-selected={dadosUser}
                                onClick={() => {
                                    setDadosUser(true)
                                    setEditingDocuments(false)
                                }}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t cursor-pointer ${dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"} border-[#48B9FF] text-[14px] p-2 ring-1 ring-[#A9B8CF]`}>Detalhes do utilizador</button>
                            <button
                                type="button"
                                role="tab"
                                id="account-documents-tab"
                                aria-controls="account-detail-panel"
                                aria-selected={!dadosUser}
                                onClick={() => setDadosUser(false)}
                                className={`grid place-items-center text-[#143163] font-semibold rounded-t cursor-pointer ${!dadosUser ? "border-t-4 h-[50px]" : "h-[45px] mt-1.5"} border-[#48B9FF] text-[14px] p-2 ring-1 ring-[#A9B8CF]`}>Documentos Submetidos</button>

                        </div>
                    </div>

                    <div id="account-detail-panel" role="tabpanel" aria-labelledby={dadosUser ? "account-user-tab" : "account-documents-tab"} tabIndex={0} className="ui-detail-sheet-body ui-account-detail-body">
                    {dadosUser ? <div className="ui-account-detail-content space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="grid size-12 shrink-0 place-items-center rounded-full border border-[#D7E2F2] bg-[#F8FAFC] text-sm font-semibold text-[#143163]">
                                    {getInitials(itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`)}
                                </div>
                                <div className="min-w-0">
                                    <p className="break-words font-semibold text-[#143163]">{itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`}</p>
                                    <p className="mt-0.5 text-sm text-[#667085]">{itemSelected?.account_type === "User" ? "Conta Particular" : "Conta Empresa"}</p>
                                </div>
                            </div>
                            <div className="flex min-h-16 items-center gap-2 p-2">
                                <Wallet className="size-7 shrink-0 text-[#143163]" aria-hidden="true" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[#667085]">Saldo em conta</p>
                                    <p className="break-words font-semibold text-[#143163]">
                                        {mostraSaldo ? itemSelected?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "******"} Kz
                                    </p>
                                </div>
                                <button type="button" aria-label={mostraSaldo ? "Ocultar saldo" : "Mostrar saldo"} onClick={() => setMostraSaldo((visible) => !visible)} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#143163] transition hover:bg-[#F1F5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">{mostraSaldo ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}</button>
                            </div>
                        </div>
                        <p className="text-[#143163] font-semibold pt-2">Informações do utilizador</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full" />
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>{itemSelected?.account_type === "User" ? "Utilizador:" : "Empresa"}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5 font-semibold">{itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : `${itemSelected?.business_name}`}</p>
                                        <CopyTextButton value={itemSelected?.account_type === "User" ? `${itemSelected?.first_name} ${itemSelected?.last_name}` : itemSelected?.business_name} label={itemSelected?.account_type === "User" ? "utilizador" : "empresa"} />
                                    </div>
                                </div>
                                {itemSelected?.account_type !== "User" && <div className="w-full flex justify-between items-center">
                                    <p>Short Name:</p>
                                    <p className="h-5">{itemSelected?.short_name || 'N/A'}</p>
                                </div>}
                                {itemSelected?.account_type !== "User" && <div className="w-full flex justify-between items-center">
                                    <p>{"Comerciante: "}</p>
                                    <p className="h-5">
                                        {itemSelected?.merchant_payment_number || "N/A"}
                                    </p>
                                </div>}
                                {itemSelected?.account_type === "User" && <div className="w-full flex justify-between items-center">
                                    <p>Data de nascimento:</p>
                                    <p className="h-5">{itemSelected?.user_document?.birthday || "N/A"}</p>
                                </div>}
                                {itemSelected?.account_type !== "User" &&
                                    <div className="w-full flex justify-between items-center">
                                        <p>Email:</p>
                                        <div className="flex items-center justify-end gap-1">
                                            <p className="h-5">{itemSelected?.email ?? "N/A"}</p>
                                            <CopyTextButton value={itemSelected?.email} label="email" />
                                        </div>
                                    </div>}
                                <div className="w-full flex justify-between items-center">
                                    <p>Número de Telemóvel:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5">{itemSelected?.phone_number ?? 'N/A'}</p>
                                        <CopyTextButton value={itemSelected?.phone_number} label="telefone" />
                                    </div>
                                </div>
                                {itemSelected?.account_type === "User" &&
                                    <div className="w-full flex justify-between items-center">
                                        <p>Nacionalidade:</p>
                                        <p className="h-5">{itemSelected?.country ? (itemSelected?.country === "Angola" ? "Angolana" : "Estrangeira") : "N/A"}</p>
                                    </div>}
                                {itemSelected?.account_type === "User" ? <div className="w-full flex justify-between items-center">
                                    <p>Documento de identificação:</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="h-5">{itemSelected?.bi_number || itemSelected?.nif}</p>
                                        <CopyTextButton value={itemSelected?.bi_number || itemSelected?.nif} label="documento de identificação" />
                                    </div>
                                </div> :
                                    <div className="w-full flex justify-between items-center">
                                        <p>NIF</p>
                                        <div className="flex items-center justify-end gap-1">
                                            <p className="h-5">{itemSelected?.nif ?? 'N/A'}</p>
                                            <CopyTextButton value={itemSelected?.nif} label="NIF" />
                                        </div>
                                    </div>
                                }
                                {itemSelected?.account_type === "User" &&
                                    <div className="w-full flex justify-between items-center">
                                        <p>País:</p>
                                        <p className="h-5">{itemSelected?.user_document?.country || itemSelected?.country || 'N/A'}</p>
                                    </div>}
                                <div className="w-full flex justify-between items-center">
                                    <p>Província:</p>
                                    <p className="h-5">{itemSelected?.user_document?.province || itemSelected?.province || 'N/A'}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Município:</p>
                                    <p className="h-5">{itemSelected?.user_document?.city || itemSelected?.city || 'N/A'}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>{itemSelected?.account_type === "User" ? "Morada:" : "Endereço da Sede:"}</p>
                                    <p className="h-5">{itemSelected?.user_document?.address || itemSelected?.address || 'N/A'}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p className="w-full">Situação do utilizador:</p>
                                    <p className="w-full flex justify-end "><span className={`ui-status-tag ${statusUserColor(itemSelected?.status)}`}>
                                        {itemSelected?.status === "Active" ? "Activo" : "Inactivo"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-[#143163] font-semibold pt-2">Informações da conta</p>
                        <div className="ring-[0.5px] ring-[#A9B8CF] w-full" />
                        <div className="w-full">
                            <div className="text-sm text-[#143163] space-y-1">
                                <div className="w-full flex justify-between items-center">
                                    <p>Data de Criação:</p>
                                    <p>{itemSelected?.created_at ? new Date(itemSelected.created_at).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : ''}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Nível da Conta:</p>
                                    <div className="ui-account-level-value flex items-center justify-end gap-1">
                                        <LevelBadgeIcon level={itemSelected?.level} className="h-4 w-4 shrink-0" />
                                        <span>{getLevelBadgeName(itemSelected?.level) ?? `Nível ${itemSelected?.level ?? "N/A"}`}</span>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Data da Última Actualização:</p>
                                    <p>{itemSelected?.updated_at ? new Date(itemSelected.updated_at).toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : ''}</p>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <p>Estado da Conta:</p>
                                    <p className="w-full flex justify-end"><span className={`ui-status-tag ${statusAccount(itemSelected?.status_validate)}`}>
                                        {itemSelected?.status_validate || "N/A"}</span></p>
                                </div>
                                {(itemSelected?.status_validate === "Validado" || itemSelected?.status_validate === "Rejeitado") && <div className="w-full flex justify-between items-center">
                                    <p>Responsável pela validação:</p>
                                    <p>{itemSelected?.responsavel || "N/A"}</p>
                                </div>}
                                {itemSelected?.status_validate === "Rejeitado" && <div className="w-full flex justify-between items-center">
                                    <p>Motivo:</p>
                                    <p>{itemSelected?.motivo || "N/A"}</p>
                                </div>}
                            </div>
                        </div>
                        {loadingConsultingReference ? (
                            <div className="rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4 shadow-[0_1px_2px_rgba(20,49,99,0.04)]">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
                                        <Hash className="size-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#143163]">Referência de pagamento</p>
                                        <p className="mt-1 text-sm text-[#667085]">A verificar a referência desta conta.</p>
                                    </div>
                                    <div className="h-9 w-28 shrink-0 animate-pulse rounded-lg bg-[#E5EBF4]" />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4 shadow-[0_1px_2px_rgba(20,49,99,0.04)]">
                                <div className="flex items-start gap-3">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
                                        <Hash className="size-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#143163]">Referência de pagamento</p>
                                                <p className="mt-1 text-sm leading-5 text-[#667085]">
                                                    {hasReference && itemSelected?.nro_reference
                                                        ? "Esta referência está associada a esta conta."
                                                        : "Gere uma referência de pagamento para esta conta."}
                                                </p>
                                            </div>
                                            {hasReference && itemSelected?.nro_reference ? (
                                                !confirmDeleteReference && <Button
                                                    type="button"
                                                    disabled={loadingDeleteReference || loadingReference}
                                                    onClick={() => setConfirmDeleteReference(true)}
                                                    className="ui-reference-delete-action h-9 shrink-0 rounded-lg"
                                                    variant="outline"
                                                >
                                                    <Trash2 className="size-4" aria-hidden="true" />
                                                    Eliminar referência
                                                </Button>
                                            ) : (
                                                <Button
                                                    disabled={loadingReference}
                                                    onClick={gerarReferencia}
                                                    className="h-9 shrink-0 rounded-lg"
                                                    variant="brand"
                                                >
                                                    {loadingReference ? "A processar..." : "Gerar referência"}
                                                </Button>
                                            )}
                                        </div>
                                        {confirmDeleteReference && hasReference && itemSelected?.nro_reference && (
                                            <div role="group" aria-label="Confirmar eliminação da referência" className="mt-4 flex flex-col gap-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#912018]">Eliminar referência?</p>
                                                    <p className="mt-1 text-xs text-[#667085]">Esta ação não pode ser desfeita.</p>
                                                </div>
                                                <div className="flex shrink-0 justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-9 rounded-lg"
                                                        onClick={() => setConfirmDeleteReference(false)}
                                                        disabled={loadingDeleteReference}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="ui-reference-delete-action h-9 rounded-lg"
                                                        onClick={eliminarReferencia}
                                                        disabled={loadingDeleteReference || loadingReference}
                                                    >
                                                        {loadingDeleteReference ? "A eliminar..." : <><Trash2 className="size-4" aria-hidden="true" />Eliminar</>}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {hasReference && itemSelected?.nro_reference && (
                                            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#E3EAF4] bg-white px-3 py-2.5">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-[#667085]">Número da referência</p>
                                                    <p className="mt-0.5 break-all text-sm font-semibold text-[#143163]">{itemSelected.nro_reference}</p>
                                                </div>
                                                <CopyTextButton value={String(itemSelected.nro_reference)} label="referência de pagamento" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {itemSelected?.account_type === "Merchant" && (
                            <div className="rounded-xl border border-[#D7E2F2] bg-[#F8FAFC] p-4 shadow-[0_1px_2px_rgba(20,49,99,0.04)]">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EAF6F8] text-[#143163]">
                                        <Link2 className="size-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#143163]">Integração</p>
                                        <p className="mt-1 text-sm leading-5 text-[#667085]">Permite à empresa utilizar a integração com a plataforma.</p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={isIntegrator}
                                        aria-label={`Integração ${isIntegrator ? "activa" : "inactiva"}`}
                                        onClick={handleIntegrationToggle}
                                        disabled={updateIntegrationMutation.isPending}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${isIntegrator ? "bg-[#22C55E]" : "bg-[#D1D5DB]"}`}
                                    >
                                        <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${isIntegrator ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div> : <DadosSubmetidos
                        level_up={itemSelected?.level_up}
                        typeAccount={itemSelected?.account_type}
                        onClose={onClose}
                        idUser={itemSelected?.id}
                        statusAccount={itemSelected?.status_validate}
                        biBack={itemSelected?.user_document?.biBackFile}
                        biFront={itemSelected?.user_document?.biFrontFile}
                        selfie={itemSelected?.user_document?.selfieFile}
                        nacionalidade={itemSelected?.user_document?.nacionalidade}
                        userData={itemSelected}
                        setDadosUser={setDadosUser}
                        editingDocuments={editingDocuments}
                        onEditDocuments={() => setEditingDocuments(true)}
                        onCancelDocumentsEdit={() => setEditingDocuments(false)}

                    />}
                    </div>
                    {(dadosUser || !editingDocuments) && <div className={`ui-detail-sheet-footer ${dadosUser ? "ui-account-detail-footer" : ""}`}>
                        <Button onClick={onClose} className="ui-detail-sheet-primary-action w-full" type="button" variant="brand">
                            Concluído
                        </Button>
                    </div>}
                </SheetContent>

            </Sheet>
        </>
    )
}
