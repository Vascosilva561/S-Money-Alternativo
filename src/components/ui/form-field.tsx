import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type FieldState = "default" | "error" | "success"

type FormFieldProps = {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  state?: FieldState
  className?: string
  children: React.ReactNode
}

/** Shared frame for labels, help text and the default/error/success states. */
function FormField({ label, required, hint, error, state = "default", className, children }: FormFieldProps) {
  const resolvedState = error ? "error" : state

  return (
    <div className={cn("ui-field", className)} data-state={resolvedState}>
      {label && <div className="ui-field-label-row"><span className="ui-field-label">{label}{required && <span className="ui-field-required" aria-hidden="true">*</span>}</span></div>}
      {children}
      {(error || hint) && <p className={cn("ui-field-message", error && "ui-field-message-error")}>{error && <AlertCircle aria-hidden="true" />}{error || hint}</p>}
    </div>
  )
}

type TextFieldProps = Omit<React.ComponentProps<typeof Input>, "aria-invalid"> & {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  state?: FieldState
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  containerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({ label, required, hint, error, state, startAdornment, endAdornment, containerClassName, className, type, ...props }, ref) => (
  <FormField label={label} required={required} hint={hint} error={error} state={state} className={containerClassName}>
    <div className="ui-control-wrap">
      {startAdornment && <span className="ui-control-adornment ui-control-adornment-start">{startAdornment}</span>}
      <Input ref={ref} type={type} aria-invalid={Boolean(error) || undefined} className={cn("ui-control", startAdornment && "ui-control-with-start", endAdornment && "ui-control-with-end", className)} {...props} />
      {endAdornment && <span className="ui-control-adornment ui-control-adornment-end">{endAdornment}</span>}
    </div>
  </FormField>
))
TextField.displayName = "TextField"

type TextAreaFieldProps = React.ComponentProps<"textarea"> & {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  state?: FieldState
  containerClassName?: string
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(({ label, required, hint, error, state, containerClassName, className, ...props }, ref) => (
  <FormField label={label} required={required} hint={hint} error={error} state={state} className={containerClassName}>
    <textarea ref={ref} aria-invalid={Boolean(error) || undefined} className={cn("ui-control ui-textarea", className)} {...props} />
  </FormField>
))
TextAreaField.displayName = "TextAreaField"

type NativeSelectFieldProps = React.ComponentProps<"select"> & {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  state?: FieldState
  containerClassName?: string
}

const NativeSelectField = React.forwardRef<HTMLSelectElement, NativeSelectFieldProps>(({ label, required, hint, error, state, containerClassName, className, children, ...props }, ref) => (
  <FormField label={label} required={required} hint={hint} error={error} state={state} className={containerClassName}>
    <div className="ui-control-wrap">
      <select ref={ref} aria-invalid={Boolean(error) || undefined} className={cn("ui-control ui-native-select", className)} {...props}>{children}</select>
    </div>
  </FormField>
))
NativeSelectField.displayName = "NativeSelectField"

function DateField(props: TextFieldProps) {
  // Date controls keep the browser's native picker affordance. An injected
  // decorative end icon would sit above that hit target and make the picker
  // feel unclickable.
  return <TextField {...props} type="date" endAdornment={undefined} />
}

export { DateField, FormField, NativeSelectField, TextAreaField, TextField }
