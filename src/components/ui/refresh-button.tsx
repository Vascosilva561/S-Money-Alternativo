import { RefreshCw } from "lucide-react"

type RefreshButtonProps = {
  onRefresh: () => void
  isLoading?: boolean
  className?: string
}

export function RefreshButton({ onRefresh, isLoading = false, className = "" }: RefreshButtonProps) {
  return (
    <button
      type="button"
      aria-label="Actualizar"
      title="Actualizar"
      disabled={isLoading}
      onClick={onRefresh}
      className={`ui-refresh-trigger ${className}`.trim()}
    >
      <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
    </button>
  )
}
