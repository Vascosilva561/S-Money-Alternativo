
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { api } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../utils/spinner";
import type { WebhookServiceType } from "@/types/webhookServiceType";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSelectedAccount } from "@/context/selectedAccountCntext";

type CreateWebhooksProps = {
    onClose: () => void;
    isOpen: boolean;
};

type ServicePurpose = {
    id: number,
    label: string,
    value: 'internal_payments' | 'external_payments'
}

type WebhookEventOption = {
    key: string;
    description: {
        en: string;
        pt: string;
    };
};

export interface CreateWebhookPayload {
    service_type: WebhookServiceType;
    subscriber_type: "external_payments";
    name: string;
    url: string;
    events: string[];
    token_prefix: string;
    dynamic_auth_per_tx: boolean;
    dynamic_auth_algorithm: string | null;
    dynamic_auth_secret_word: string | null;
    is_active: boolean;
    check_ssl: boolean;
    token_access: string;
}

const WEBHOOK_EVENTS: Record<WebhookServiceType, WebhookEventOption[]> = {
    gpo: [
        {
            key: "gpo-payment.refunded",
            description: {
                en: "Transaction refunded",
                pt: "Transação reembolsada",
            },
        },
        {
            key: "gpo-payment.accepted",
            description: {
                en: "Transaction accepted",
                pt: "Transação aceite",
            },
        },
        {
            key: "gpo-payment.rejected",
            description: {
                en: "Transaction rejected",
                pt: "Transação rejeitada",
            },
        },
    ],
    sector: [
        {
            key: "sector-payment.files",
            description: {
                en: "Event triggered when payment files are received",
                pt: "Evento acionado quando ficheiros de pagamentos são recebidos",
            },
        },
        {
            key: "sector-payment.realtime",
            description: {
                en: "Event triggered when a real-time payment occurs",
                pt: "Evento acionado quando acontece um pagamento em tempo real",
            },
        },
        {
            key: "sector-payment.reconciliated",
            description: {
                en: "Event triggered when a real-time payment is verified using a confirmation file",
                pt: "Evento acionado quando um pagamento em tempo real é verificado através de ficheiro",
            },
        },
    ],
};



const initialFormData = {
    service_type: "sector" as WebhookServiceType,
    subscriber_type: "",
    name: "",
    url: "",
    token_prefix: "bearer",
    dynamic_auth_per_tx: false,
    dynamic_auth_algorithm: "sha256",
    dynamic_auth_secret_word: "",
    is_active: true,
    check_ssl: true,
    auth_token: "",
};

export default function CreateWebhooks({
    onClose,
    isOpen,
}: CreateWebhooksProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const { account: selectedAccount } = useSelectedAccount();

    const servicePurpose: ServicePurpose[] = [
        {
            id: 1,
            label: "Pagamentos Somoney",
            value: "internal_payments"
        },
        {
            id: 2,
            label: "Pagamentos de Serviços Externos",
            value: "external_payments"

        },
    ]
    const updateField = <K extends keyof typeof initialFormData>(
        field: K,
        value: (typeof initialFormData)[K]
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const resetInputs = () => {
        setFormData(initialFormData);
        setSelectedEvents([]);
    };

    const handleClose = () => {
        if (isLoading) return;
        resetInputs();
        onClose();
    };

    const handleServiceChange = (service: WebhookServiceType) => {
        setFormData((previous) => ({
            ...previous,
            service_type: service,
        }));
        setSelectedEvents([]);
    };

    const handleEventChange = (eventKey: string, checked: boolean) => {
        setSelectedEvents((previous) =>
            checked
                ? [...previous, eventKey]
                : previous.filter((event) => event !== eventKey)
        );
    };

    async function handleCreateWebhook(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!selectedEvents.length) {
            toast.error("Selecione pelo menos um evento.");
            return;
        }

        if (
            formData.dynamic_auth_per_tx &&
            !formData.dynamic_auth_secret_word.trim()
        ) {
            toast.error("Informe a chave secreta de autenticação.");
            return;
        }

        if(!selectedAccount?.id) {
            toast.error("Nenhuma conta selecionada.");
            return;
        }

        try {
            setIsLoading(true);

            const payload: CreateWebhookPayload = {
                service_type: formData.service_type,
                subscriber_type: "external_payments",
                name: formData.name.trim(),
                url: formData.url.trim(),
                events: selectedEvents,
                token_prefix: formData.token_prefix,
                dynamic_auth_per_tx: formData.dynamic_auth_per_tx,
                dynamic_auth_algorithm: formData.dynamic_auth_per_tx
                    ? formData.dynamic_auth_algorithm
                    : null,
                dynamic_auth_secret_word: formData.dynamic_auth_per_tx
                    ? formData.dynamic_auth_secret_word.trim()
                    : null,
                is_active: formData.is_active,
                check_ssl: formData.check_ssl,
                token_access: formData?.auth_token,
            };

            await api.post(`/front/merchants/${selectedAccount?.id}/webhooks/create`, payload);

            await queryClient.invalidateQueries({
                queryKey: ["ListaDeWebhooks"],
            });

            toast.success("Webhook criado com sucesso!");
            resetInputs();
            onClose();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const message =
                    error.response?.data?.error ??
                    error.response?.data?.message;

                toast.error(
                    typeof message === "string"
                        ? message
                        : "Não foi possível criar o webhook."
                );
            } else {
                toast.error("Ocorreu um erro ao criar o webhook.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const inputClass =
        "w-full p-2 rounded-[6px] ring-1 ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none text-[#143163] text-sm";

    const events = WEBHOOK_EVENTS[formData.service_type];

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
        >
            <SheetContent
                style={{ minWidth: "35%" }}
                className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none"
            >
                <div className="flex justify-between items-center w-full">
                    <SheetHeader className="text-[#143163] font-semibold text-lg p-0">
                        Adicionar Webhook
                    </SheetHeader>

                    <SheetClose
                        disabled={isLoading}
                        className="cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"
                    >
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>
                </div>

                <form
                    className="w-full flex flex-col text-sm space-y-5 py-10"
                    onSubmit={handleCreateWebhook}
                >
                    <div className="flex flex-col space-y-2">
                        <label className="text-[#143163] font-semibold">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(event) =>
                                updateField("name", event.target.value)
                            }
                            className={inputClass}
                            placeholder="Ex.: Webhook Pagamentos"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-[#143163] font-semibold">
                            URL do webhook
                        </label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(event) =>
                                updateField("url", event.target.value)
                            }
                            className={inputClass}
                            placeholder="https://exemplo.com/webhook"
                            pattern="https://.*"
                            title="Introduza um endereço HTTPS."
                            required
                        />
                        <p className="text-xs text-[#8998B1]">
                            Utilize um endereço HTTPS acessível pelo serviço.
                        </p>
                    </div>



                    <div className="flex flex-col gap-2">
                        <label className="text-[#143163] font-semibold">
                            Finalidade
                        </label>

                        <Select
                            value={formData.subscriber_type}
                            onValueChange={(value) =>
                                updateField(
                                    "subscriber_type",
                                    value as ServicePurpose["value"]
                                )
                            }
                        >
                            <SelectTrigger className={`${inputClass} w-full`}>
                                <SelectValue placeholder="Selecione a finalidade" />
                            </SelectTrigger>

                            <SelectContent>
                                {servicePurpose.map((purpose) => (
                                    <SelectItem
                                        key={purpose.id}
                                        value={purpose.value}
                                    >
                                        {purpose.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>




                    <div className="flex flex-col gap-2">
                        <label className="text-[#143163] font-semibold">
                            Tipo de serviço
                        </label>

                        <Select
                            value={formData.service_type}
                            onValueChange={(value) =>
                                handleServiceChange(value as WebhookServiceType)
                            }
                        >
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Selecione o tipo de serviço" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="sector">
                                    Pagamentos por Referência (Sector)
                                </SelectItem>

                                <SelectItem value="gpo">
                                    Pagamentos GPO
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[#143163] font-semibold">
                                Eventos
                            </label>
                            <span className="text-xs text-[#8998B1]">
                                {selectedEvents.length} selecionado(s)
                            </span>
                        </div>

                        <div className="border border-[#DCE4EF] rounded-md divide-y divide-[#E9EDF3]">
                            {events.map((event) => (
                                <label
                                    key={event.key}
                                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-[#F5F8FC]"
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-1 accent-[#143163]"
                                        checked={selectedEvents.includes(event.key)}
                                        onChange={(e) =>
                                            handleEventChange(
                                                event.key,
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="flex flex-col gap-1">
                                        <span className="font-medium text-[#143163]">
                                            {event.description.pt}
                                        </span>
                                        <span className="text-xs text-[#8998B1]">
                                            {event.key}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-[#143163]">
                                Verificar SSL
                            </p>
                            <p className="text-xs text-[#8998B1]">
                                Validar o certificado SSL do endereço.
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#143163]"
                            checked={formData.check_ssl}
                            onChange={(event) =>
                                updateField("check_ssl", event.target.checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-[#143163]">
                                Autenticação dinâmica por transação
                            </p>
                            <p className="text-xs text-[#8998B1]">
                                Ativa a geração de autenticação por transação.
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#143163]"
                            checked={formData.dynamic_auth_per_tx}
                            onChange={(event) =>
                                updateField(
                                    "dynamic_auth_per_tx",
                                    event.target.checked
                                )
                            }
                        />
                    </div>

                    {formData.dynamic_auth_per_tx && (
                        <>

                            <div className="flex flex-col gap-2">
                                <label className="text-[#143163] font-semibold">
                                    Algoritmo de autenticação
                                </label>

                                <Select
                                    value={formData.dynamic_auth_algorithm ?? ""}
                                    onValueChange={(value) =>
                                        updateField("dynamic_auth_algorithm", value)
                                    }
                                    required
                                >
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder="Selecione o algoritmo" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="sha256">
                                            SHA-256
                                        </SelectItem>

                                        <SelectItem value="sha512">
                                            SHA-512
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>


                            <div className="flex flex-col gap-2">
                                <label className="text-[#143163] font-semibold">
                                    Chave secreta de autenticação
                                </label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={formData.dynamic_auth_secret_word}
                                    onChange={(event) =>
                                        updateField(
                                            "dynamic_auth_secret_word",
                                            event.target.value
                                        )
                                    }
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </>
                    )}


                    <div className="flex flex-col gap-2">
                        <label className="text-[#143163] font-semibold">
                            Prefixo de autenticação
                        </label>

                        <Select
                            value={formData.token_prefix}
                            onValueChange={(value) =>
                                updateField("token_prefix", value)
                            }
                            required
                        >
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Selecione o prefixo" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="bearer">
                                    Bearer
                                </SelectItem>

                                <SelectItem value="token">
                                    Token
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="auth_token"
                            className="text-[#143163] font-semibold"
                        >
                            Token de Autenticação
                        </label>

                        <textarea
                            id="auth_token"
                            name="auth_token"
                            value={formData.auth_token}
                            onChange={(event) =>
                                updateField("auth_token", event.target.value)
                            }
                            placeholder="Introduza o token de autenticação..."
                            className="min-h-[120px] resize-y ring-1 ring-[#ADCBD0] focus:ring-1 focus:ring-[#7D8CA6] focus:outline-none rounded-[6px] p-2 text-[#143163] text-sm"
                        />

                        <p className="text-[12px] text-muted-foreground">
                            Introduza o token que será utilizado na autenticação do webhook.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-[#143163]">
                                Webhook ativo
                            </p>
                            <p className="text-xs text-[#8998B1]">
                                Permite ao serviço enviar notificações.
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#143163]"
                            checked={formData.is_active}
                            onChange={(event) =>
                                updateField("is_active", event.target.checked)
                            }
                        />
                    </div>


                    <div className="flex gap-3 pt-10">
                        <Button
                            type="button"
                            disabled={isLoading}
                            onClick={handleClose}
                            className="w-full bg-white text-[#143163] ring-1 ring-[#ADCBD0] hover:bg-[#F5F6FA]"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#EAF6F8] hover:bg-[#17CFDA] hover:ring-[#17CFDA] ring-1 ring-[#ADCBD0] text-[#143163] font-semibold"
                        >
                            {isLoading ? (
                                <Spinner
                                    color="#143163"
                                    width="5"
                                    height="5"
                                />
                            ) : (
                                "Adicionar"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
