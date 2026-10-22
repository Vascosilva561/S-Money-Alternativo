import { ChartBarDefault } from "@/components/dashboard/selectedAccountDash.tsx/chartsGPO"
import type { DashboardResponse } from "@/types/dashboardAccounteSelected"

type Props = {
  data?: DashboardResponse
  type: "referencia" | "gpo"
  startDate: string
  endDate: string
  isLoading: boolean
  isError: boolean
}

export function MerchantActivityChart({ data, type, startDate, endDate, isLoading, isError }: Props) {
  const source = type === "gpo" ? data?.gpo?.dados : data?.sector?.dados
  const chartsData = [...(source ?? [])]
    .filter((row) => row.date >= startDate && row.date.slice(0, 10) <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section className="bg-white rounded-lg text-sm shadow-[0px_0px_13px_0px_rgba(207,_215,_229,_0.67)]">
      <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE]">
        <div>
          <h3 className="font-bold text-xl text-[#143163]">Evolução dos pagamentos</h3>
          <p className="mt-1 text-[#627AA0]">Visão geral dos pagamentos</p>
        </div>
      </div>

      {isError ? (
        <p className="px-5 py-10 text-center text-sm text-[#6B7280]" role="status">
          Não foi possível carregar os pagamentos deste período.
        </p>
      ) : (
        <ChartBarDefault
          chartsData={chartsData}
          isLoading={isLoading}
          typePayment={type === "gpo" ? "GPO" : "REFERENCE"}
        />
      )}
    </section>
  )
}
