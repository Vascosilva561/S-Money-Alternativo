export type StatusPresentation = {
    label: string
    className: string
}

export function normalizeGpoStatus(status: string | null | undefined): "ACTIVE" | "INACTIVE" | null {
    const normalizedStatus = status?.trim().toUpperCase()

    if (normalizedStatus === "ACTIVE" || normalizedStatus === "INACTIVE") {
        return normalizedStatus
    }

    return null
}

export function isGpoConfigured(
    minAmount: number | null | undefined,
    maxAmount: number | null | undefined,
) {
    return minAmount != null && maxAmount != null
}

export function getGpoConfigurationPresentation(status: string | null | undefined): StatusPresentation {
    const normalizedStatus = normalizeGpoStatus(status)

    if (normalizedStatus === "ACTIVE") {
        return {
            label: "Activa",
            className: "bg-[#DEF7EC] text-[#03543F]",
        }
    }

    if (normalizedStatus === "INACTIVE") {
        return {
            label: "Inactiva",
            className: "bg-[#FDE8E8] text-[#9B1C1C]",
        }
    }

    return {
        label: "—",
        className: "bg-[#F3F4F6] text-[#374151]",
    }
}

export function getStatusPresentation(status: string | null | undefined): StatusPresentation {
    const normalizedStatus = status?.trim().toUpperCase()

    if (normalizedStatus === "ACTIVE") {
        return {
            label: "Activa",
            className: "bg-[#DEF7EC] text-[#03543F]",
        }
    }

    if (normalizedStatus === "INACTIVE") {
        return {
            label: "Inactiva",
            className: "bg-[#FDE8E8] text-[#9B1C1C]",
        }
    }

    return {
        label: "Não configurado",
        className: "bg-[#F3F4F6] text-[#374151]",
    }
}
