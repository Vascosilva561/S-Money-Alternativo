import { ExternalLink, FileText, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import EditFiles from "./submitFiles"

type Props = {
    biFront: string
    biBack: string
    selfie: string
    statusAccount: string
    idUser: string
    onClose: () => void
    nacionalidade: string
    typeAccount: string
    level_up: boolean
    userData: any
    setDadosUser: (value: any) => void
    editingDocuments: boolean
    onEditDocuments: () => void
    onCancelDocumentsEdit: () => void
}

type DocumentCardProps = {
    title: string
    url?: string | null
}

function DocumentCard({ title, url }: DocumentCardProps) {
    const imageDocument = Boolean(url && /\.(jpeg|jpg|gif|png|webp)(?:[?#].*)?$/i.test(url))

    return (
        <article className="overflow-hidden rounded-xl border border-[#E5EBF4] bg-white">
            <div className="grid min-h-44 place-items-center bg-[#F8FAFC] p-3">
                {url ? (
                    <a href={url} target="_blank" rel="noreferrer" aria-label={`Abrir ${title}`} className="grid h-full w-full place-items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                        {imageDocument ? (
                            <img src={url} alt={title} className="max-h-44 w-full rounded-lg object-contain" />
                        ) : (
                            <span className="flex flex-col items-center gap-2 text-sm font-medium text-[#143163]">
                                <FileText className="size-10 text-[#667085]" aria-hidden="true" />
                                Abrir documento
                            </span>
                        )}
                    </a>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-sm text-[#667085]">
                        <FileText className="size-10 text-[#98A2B3]" aria-hidden="true" />
                        Ficheiro não disponível
                    </div>
                )}
            </div>
            <div className="flex min-h-16 items-center justify-between gap-3 border-t border-[#E5EBF4] px-4 py-3">
                <h4 className="text-sm font-semibold capitalize text-[#143163]">{title}</h4>
                {url && <a href={url} target="_blank" rel="noreferrer" aria-label={`Abrir ${title} numa nova janela`} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#2678F2] transition hover:bg-[#E8F0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]">
                    <ExternalLink className="size-4" aria-hidden="true" />
                </a>}
            </div>
        </article>
    )
}

export default function DadosSubmetidos({ biFront, biBack, selfie, setDadosUser, idUser, onClose, nacionalidade, typeAccount, userData, editingDocuments, onEditDocuments, onCancelDocumentsEdit }: Props) {
    const clearInputs = () => undefined
    const isUser = typeAccount === "User"
    const documents = [
        {
            title: isUser ? nacionalidade === "Nacional" ? "Bilhete de identidade — frente" : "Cartão de residente" : "Documento de identificação fiscal",
            url: biFront,
        },
        {
            title: isUser ? nacionalidade === "Nacional" ? "Bilhete de identidade — verso" : "Passaporte" : "Alvará comercial",
            url: biBack,
        },
        ...(isUser ? [{ title: "Selfie", url: selfie }] : []),
    ]
    const hasDocuments = documents.some((document) => Boolean(document.url))

    if (editingDocuments) {
        return (
            <div className="ui-document-review space-y-4">
                <div className="border-b border-[#E5EBF4] pb-3">
                    <div>
                        <h3 className="text-sm font-semibold text-[#143163]">Editar documentos</h3>
                        <p className="mt-1 text-sm text-[#667085]">Substitua os ficheiros submetidos para esta conta.</p>
                    </div>
                </div>
                <EditFiles
                    typeAccount={typeAccount}
                    idUser={idUser}
                    otherData={userData}
                    onClose={onClose}
                    setDadosUser={setDadosUser}
                    clearInputs={clearInputs}
                    onCancel={onCancelDocumentsEdit}
                />
            </div>
        )
    }

    return (
        <div className="ui-document-review space-y-5">
            <section className="space-y-1 border-b border-[#E5EBF4] pb-3">
                <h3 className="text-sm font-semibold text-[#143163]">Documentos submetidos</h3>
                <p className="text-sm text-[#667085]">Abra um ficheiro para consultar o documento original.</p>
            </section>

            {hasDocuments ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {documents.filter((document) => Boolean(document.url)).map((document) => <DocumentCard key={document.title} title={document.title} url={document.url} />)}
                </div>
            ) : (
                <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-[#C9D8E9] bg-[#F8FAFC] px-5 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="size-9 text-[#8293AE]" aria-hidden="true" />
                        <p className="font-semibold text-[#143163]">Nenhum documento submetido</p>
                        <p className="max-w-sm text-sm text-[#667085]">Os documentos submetidos por esta conta aparecerão aqui.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <Button type="button" variant="brand" className="ui-modal-secondary-action h-10 rounded-lg" onClick={onEditDocuments}>
                    <Pencil aria-hidden="true" />
                    Editar documentos
                </Button>
            </div>
        </div>
    )
}
