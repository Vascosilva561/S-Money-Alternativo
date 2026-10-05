import { useRef, type KeyboardEvent, type ReactNode } from "react"
import { useSearchParams } from "react-router"

export type PaymentTab = "servicos" | "referencia"

type PaymentsTabsProps = {
  services: ReactNode
  reference: ReactNode
}

const tabs: { id: PaymentTab; label: string }[] = [
  { id: "servicos", label: "Pagamento de serviços" },
  { id: "referencia", label: "Pagamentos por referência" },
]

export default function PaymentsTabs({ services, reference }: PaymentsTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeTab: PaymentTab = searchParams.get("tab") === "referencia" ? "referencia" : "servicos"

  const selectTab = (tab: PaymentTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (tab === "servicos") next.delete("tab")
      else next.set("tab", tab)
      return next
    }, { replace: true })
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = tabs.length - 1

    if (nextIndex === undefined) return

    event.preventDefault()
    selectTab(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  const panelId = "payments-tab-panel"

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Tipo de pagamento"
        aria-orientation="horizontal"
        className="ui-tabs ui-payment-tabs flex"
      >
        {tabs.map((tab, index) => {
          const isSelected = activeTab === tab.id

          return (
            <button
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element }}
              id={`payments-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={isSelected ? "border-t-4 border-[#48B9FF]" : ""}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`payments-tab-${activeTab}`}
        tabIndex={0}
        className="payment-tabs-panel min-w-0 outline-none"
      >
        {activeTab === "referencia" ? reference : services}
      </div>
    </div>
  )
}
