import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"

type FilterButtonProps = {
  onClick: () => void
  label: string
}

export function FilterButton({ onClick, label }: FilterButtonProps) {
  return (
    <Button
      type="button"
      variant="brand"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="ui-filter-trigger"
    >
      <Filter aria-hidden="true" />
    </Button>
  )
}
