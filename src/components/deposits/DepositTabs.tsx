import type { ReactNode } from "react"
import { useSearchParams } from "react-router"

export type DepositTab = "referencia" | "gpo"

type DepositTabsProps = {
  reference: ReactNode
  gpo: ReactNode
}

const tabs: { id: DepositTab; label: string }[] = [
  { id: "referencia", label: "Depósitos por Referência" },
  { id: "gpo", label: "Depósitos por GPO" },
]

export default function DepositTabs({ reference, gpo }: DepositTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get("tab")
  const activeTab: DepositTab = requestedTab === "gpo" ? "gpo" : "referencia"

  const selectTab = (tab: DepositTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (tab === "referencia") next.delete("tab")
      else next.set("tab", tab)
      return next
    }, { replace: true })
  }

  return (
    <>
      <div role="tablist" aria-label="Tipos de depósito" className="ui-tabs ui-deposit-tabs flex" aria-orientation="horizontal">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              id={`deposit-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="deposit-tab-panel"
              onClick={() => selectTab(tab.id)}
              className={`grid h-11 flex-1 place-items-center rounded-t-lg border border-b-0 px-4 text-sm font-semibold text-[#143163] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-2 ${isSelected ? "border-t-4 border-[#48B9FF] bg-white" : "border-[#D7E2F2] bg-[#F8FAFC] hover:bg-[#F1F6FC]"}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        id="deposit-tab-panel"
        role="tabpanel"
        aria-labelledby={`deposit-tab-${activeTab}`}
        tabIndex={0}
        className="deposit-tabs-panel min-w-0 outline-none"
      >
        {activeTab === "referencia" ? reference : gpo}
      </div>
    </>
  )
}
