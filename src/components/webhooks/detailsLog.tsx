import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet";
import type { WebhookDeliveryLog } from "@/types/detailsLogsDeliveries";
import { Check, Clipboard, X } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    itemSelected: WebhookDeliveryLog | null;
};

function JsonBlock({
    title,
    data,
}: {
    title: string;
    data: Record<string, unknown>;
}) {
    const [copied, setCopied] = useState(false);
    const json = JSON.stringify(data ?? {}, null, 2);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar JSON:", error);
        }
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#143163]">
                    {title}
                </h3>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-md border border-[#DBDEE3] px-3 py-1.5 text-xs font-medium text-[#143163] transition hover:bg-[#F3F5F8]"
                >
                    {copied ? (
                        <>
                            <Check size={14} />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Clipboard size={14} />
                            Copiar JSON
                        </>
                    )}
                </button>
            </div>

            <pre className="max-h-[350px] overflow-auto rounded-lg border border-[#DBDEE3] bg-[#F7F8FA] p-4 text-xs leading-6 text-[#27364B] scrollbar-thin">
                <code>{json}</code>
            </pre>
        </section>
    );
}

export default function DetalisLogModal({
    onClose,
    isOpen,
    itemSelected,
}: Props) {
    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <SheetContent 
             style={{ minWidth: "35%" }}
            className="flex w-full flex-col overflow-y-auto px-6 pt-8 sm:max-w-3xl sm:px-10">
                <div className="flex items-center justify-between gap-4">
                    <SheetHeader className="p-0">
                        <h2 className="text-lg font-semibold text-[#143163]">
                            Detalhes da Resposta
                        </h2>
                    </SheetHeader>

                    <SheetClose
                        aria-label="Fechar detalhes"
                        className="rounded-md bg-[#DBDEE3] p-1.5 transition hover:bg-[#C5C9CE]"
                    >
                        <X size={20} className="text-[#143163]" />
                    </SheetClose>
                </div>

                {!itemSelected ? (
                    <div className="mt-8 rounded-lg border border-[#DBDEE3] p-6 text-center text-sm text-gray-500">
                        Nenhum detalhe selecionado.
                    </div>
                ) : (
                    <div className="mt-6 space-y-6">
                        <section className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">
                                Delivery ID
                            </p>

                            <div className="break-all rounded-lg border border-[#DBDEE3] bg-[#F7F8FA] p-3 font-mono text-sm text-[#143163]">
                                {itemSelected.delivery_id}
                            </div>
                        </section>

                        <div className="h-px bg-[#E5E7EB]" />

                        <JsonBlock
                            title="Requisição"
                            data={itemSelected.request}
                        />

                        <div className="h-px bg-[#E5E7EB]" />

                        <JsonBlock
                            title="Resposta"
                            data={itemSelected.response}
                        />

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-[#143163] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1C427E]"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}