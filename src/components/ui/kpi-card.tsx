import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

export type KpiCardTone = "blue" | "purple" | "green" | "orange" | "cyan" | "slate"

type KpiCardProps = {
  label: string
  value: string
  helper?: string
  icon: LucideIcon
  tone: KpiCardTone
}

const tones: Record<KpiCardTone, { accent: string; iconBackground: string; iconColor: string }> = {
  blue: { accent: "bg-[#2678F2]", iconBackground: "bg-[#EEF6FF]", iconColor: "text-[#2678F2]" },
  purple: { accent: "bg-[#9B7BFF]", iconBackground: "bg-[#F4F1FF]", iconColor: "text-[#7956D8]" },
  green: { accent: "bg-[#25B76F]", iconBackground: "bg-[#ECFBF3]", iconColor: "text-[#159B5B]" },
  orange: { accent: "bg-[#EF8D2F]", iconBackground: "bg-[#FFF4E8]", iconColor: "text-[#D97917]" },
  cyan: { accent: "bg-[#17CFDA]", iconBackground: "bg-[#EAFBFC]", iconColor: "text-[#0D9CA5]" },
  slate: { accent: "bg-[#64748B]", iconBackground: "bg-[#F1F5F9]", iconColor: "text-[#475569]" },
}

export function KpiCard({ label, value, helper, icon: Icon, tone }: KpiCardProps) {
  const colors = tones[tone]

  return (
    <Card
      className="relative min-h-[128px] overflow-hidden rounded-xl border border-[#E7ECF3] bg-white p-4 shadow-[0_3px_12px_rgba(20,49,99,0.045)]"
      role="group"
      aria-label={label}
    >
      <span className={`absolute inset-y-3 left-0 w-[3px] rounded-full ${colors.accent}`} aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7D8CA6]">{label}</p>
          <p className="mt-2 break-words text-[21px] font-semibold leading-tight tracking-[-0.02em] text-[#18345F] tabular-nums">{value}</p>
        </div>

        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${colors.iconBackground} ${colors.iconColor}`} aria-hidden="true">
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </span>
      </div>

      {helper && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#8290A6]">
          <span className={`size-1.5 shrink-0 rounded-full ${colors.accent}`} aria-hidden="true" />
          <span>{helper}</span>
        </div>
      )}
    </Card>
  )
}
