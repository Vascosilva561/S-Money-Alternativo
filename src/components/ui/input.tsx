import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const fallbackPlaceholder = type === "date" || type === "datetime-local"
    ? "dd/mm/aaaa"
    : type === "email"
      ? "Digite o email"
      : type === "password"
        ? "Palavra-passe"
        : type === "search"
          ? "Pesquisar..."
          : type === "tel"
            ? "Digite o número"
            : type === "number"
              ? "Digite um valor"
              : "Digite..."

  return (
    <input
      type={type}
      placeholder={props.placeholder ?? fallbackPlaceholder}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-10 w-full min-w-0 rounded-lg border border-[#C9D8E9] bg-white px-3 py-2 text-sm shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#48B9FF] focus-visible:ring-[#48B9FF]/15 focus-visible:ring-4",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
