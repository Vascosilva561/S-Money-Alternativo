import levelBadgeBronze from "@/assets/level-badge-bronze.svg"
import levelBadgeOuro from "@/assets/level-badge-ouro.svg"
import levelBadgePrata from "@/assets/level-badge-prata.svg"
import levelBadgePlatina from "@/assets/level-badge-platina.svg"

const levelBadges = {
  "1": { label: "Bronze", src: levelBadgeBronze },
  "2": { label: "Prata", src: levelBadgePrata },
  "3": { label: "Ouro", src: levelBadgeOuro },
  "4": { label: "Platina", src: levelBadgePlatina },
} as const

function getLevelBadge(level: unknown) {
  return levelBadges[String(level ?? "") as keyof typeof levelBadges]
}

export function getLevelBadgeName(level: unknown) {
  return getLevelBadge(level)?.label
}

export function LevelBadgeIcon({
  level,
  className = "h-5 w-5 shrink-0",
}: {
  level?: unknown
  className?: string
}) {
  const badge = getLevelBadge(level)
  if (!badge) return null

  return <img src={badge.src} alt="" aria-hidden="true" className={`ui-level-badge-icon ${className}`} />
}

export function LevelBadge({ level }: { level?: unknown }) {
  const badge = getLevelBadge(level)

  if (!badge) {
    return <span>{level === null || level === undefined || level === "" ? "N/A" : String(level)}</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <LevelBadgeIcon level={level} />
      <span className="min-w-0 truncate" title={badge.label}>{badge.label}</span>
    </div>
  )
}
