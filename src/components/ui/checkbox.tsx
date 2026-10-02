import { Check, Minus } from "lucide-react"

type CheckboxProps = {
  checked: boolean
  indeterminate?: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel?: string
  disabled?: boolean
}

export function Checkbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  ariaLabel,
  disabled = false,
}: CheckboxProps) {
  const isActive = checked || indeterminate

  return (
    <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        aria-label={ariaLabel}
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid size-5 place-items-center rounded-md border transition-colors ${
          isActive
            ? "border-[#2678F2] bg-[#2678F2] text-white shadow-sm"
            : "border-[#C9D8E9] bg-white text-transparent hover:border-[#8FB9F5] hover:bg-[#F5F9FF]"
        } peer-focus-visible:ring-2 peer-focus-visible:ring-[#48B9FF] peer-focus-visible:ring-offset-1 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {indeterminate ? (
          <Minus className="size-3.5" strokeWidth={2.5} />
        ) : checked ? (
          <Check className="size-3.5" strokeWidth={2.5} />
        ) : null}
      </span>
    </span>
  )
}
