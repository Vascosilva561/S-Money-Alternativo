import { CircleX } from "lucide-react"

type ClearFiltersButtonProps = {
  onClick: () => void
}

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  return (
    <button
      type="button"
      aria-label="Limpar filtros"
      title="Limpar filtros"
      onClick={onClick}
      className="ui-clear-filter-button"
    >
      <CircleX aria-hidden="true" />
      <span>Limpar filtros</span>
    </button>
  )
}
