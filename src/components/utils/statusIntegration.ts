type StatusInfo = {
    label: string;
    color: string;
};

const STATUS_MAP: Record<string, StatusInfo> = {
    ENABLED: { label: "Operacional", color: "#16A34A" },
    ACTIVE: { label: "Operacional", color: "#16A34A" },
    DEGRADED: { label: "Degradado", color: "#E49500" },
    CRITICAL: { label: "Crítico", color: "#DC2626" },
    INACTIVE: { label: "Inactivo", color: "#7D8CA6" },
    
};

export function getStatusInfo(status: string | undefined): StatusInfo {
    return STATUS_MAP[status ?? ""] ?? { label: status ?? "—", color: "#7D8CA6" };
}