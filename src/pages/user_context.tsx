import { api } from "@/api"
import { Spinner } from "@/components/utils/spinner"
import { CircleUserRound, Eye, EyeOff, FileText, Phone, ShieldAlert, ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react"
import { Navigate, Outlet, useLocation, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useUserContext, type UserContextAccount } from "@/pages/user_context_types"
import { statusAccount } from "@/components/utils/getColorStatusAccount"
import { statusUserColor } from "@/components/utils/getSituacaoColor"
import { getLevelBadgeName, LevelBadgeIcon } from "@/components/gestaoDeContas/level-badge"
import { formatCurrency } from "@/components/utils/formmat"

type UserContextLocationState = {
  user?: UserContextAccount
  returnTo?: string
}

function unwrapUser(data: unknown): UserContextAccount | undefined {
  if (!data || typeof data !== "object") return undefined

  const response = data as { dados?: unknown }
  const value = response.dados ?? data
  if (Array.isArray(value)) return value[0] as UserContextAccount | undefined
  return value as UserContextAccount
}

function getDisplayName(user?: UserContextAccount) {
  if (!user) return "Utilizador"
  if (user.account_type === "Merchant" || user.business_name) {
    return user.business_name || "Empresa sem designação"
  }

  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "Utilizador sem nome"
}

function getAccountLabel(user?: UserContextAccount) {
  return user?.account_type === "Merchant" || user?.business_name ? "Empresa" : "Particular"
}

function getStatusLabel(user?: UserContextAccount) {
  return user?.status_validate || "Por validar"
}

function getUserSituationLabel(user?: UserContextAccount) {
  const status = user?.status?.trim()
  if (!status) return "N/A"

  const normalizedStatus = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")

  if (["active", "activo", "activa", "enabled", "ativo", "ativa"].includes(normalizedStatus)) return "Activo"
  if (normalizedStatus.includes("inactiv") || normalizedStatus.includes("inativ")) return "Inactivo"
  if (normalizedStatus.includes("desactiv") || normalizedStatus.includes("desativ") || normalizedStatus === "disabled") return "Desactivado"
  if (normalizedStatus.includes("blocked") || normalizedStatus.includes("bloque")) return "Bloqueado"
  if (normalizedStatus.includes("suspend")) return "Suspenso"

  return status
}

function getLevelLabel(user?: UserContextAccount) {
  if (user?.level !== undefined && user.level !== null && String(user.level).length > 0) {
    return getLevelBadgeName(user.level) ?? `Nível ${user.level}`
  }
  if (user?.level_up !== undefined && user.level_up !== null) {
    if (typeof user.level_up === "boolean") return user.level_up ? "Nível superior" : "Nível base"
    return getLevelBadgeName(user.level_up) ?? `Nível ${user.level_up}`
  }
  return "Nível não definido"
}

function getStatusClasses(status: string) {
  return statusAccount(status) ?? "bg-[#F2F4F7] text-[#536176]"
}

function getStatusIcon(status: string) {
  const normalizedStatus = status.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  if (normalizedStatus.includes("nao valid") || normalizedStatus.includes("not valid") || normalizedStatus.includes("invalid")) return ShieldQuestion
  if (normalizedStatus.includes("valid")) return ShieldCheck
  if (normalizedStatus.includes("reject") || normalizedStatus.includes("rejeit")) return ShieldX
  if (normalizedStatus.includes("pend") || normalizedStatus === "pending") return ShieldAlert
  return ShieldQuestion
}

function isKnownStatus(status: string) {
  const normalizedStatus = status.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return ["validado", "validated", "pendente", "pending", "por validar", "nao validado", "not validated", "invalid", "rejeitado", "rejected", "approved", "accepted", "denied"].includes(normalizedStatus)
}

export function UserContextLayout() {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const navigationState = (location.state as UserContextLocationState | null) ?? null
  const [contextUser, setContextUser] = useState<{ userId: string; user: UserContextAccount } | null>(() =>
    navigationState?.user && userId ? { userId, user: navigationState.user } : null,
  )
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)

  useEffect(() => {
    setIsBalanceVisible(false)
  }, [userId])

  useEffect(() => {
    if (navigationState?.user && userId) {
      setContextUser({ userId, user: navigationState.user })
    }
  }, [navigationState?.user, userId])

  // Keep the account received when entering the context as a fallback for
  // contextual navigation that does not carry location.state forward.
  const selectedUser = navigationState?.user
    ?? (contextUser?.userId === userId ? contextUser?.user : undefined)
  const accountType = selectedUser?.account_type === "Merchant" || selectedUser?.business_name ? "merchants" : "users"

  const userQuery = useQuery({
    queryKey: ["user-context", userId, accountType],
    enabled: Boolean(userId && !selectedUser),
    queryFn: async () => {
      const { data } = await api.get(`/front/${accountType}/${userId}`)
      return unwrapUser(data)
    },
  })

  const user = selectedUser ?? userQuery.data
  const displayName = getDisplayName(user)
  const status = getStatusLabel(user)
  const hasKnownStatus = isKnownStatus(status)
  const displayedStatus = hasKnownStatus ? status : "N/A"
  const StatusIcon = getStatusIcon(status)

  if (!userId) return <Navigate to="/gestao-de-utilizadores" replace />

  if (userQuery.isPending && !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center gap-3 text-[#143163]">
        <Spinner color="#143163" width="36" height="36" />
        <span>A carregar o contexto do utilizador...</span>
      </div>
    )
  }

  return (
    <div className="ui-context-layout flex w-full min-w-0 flex-col gap-5">
      <section className="rounded-xl border border-[#E2E6ED] bg-white shadow-[0px_2px_10px_rgba(20,49,99,0.06)]">
        {userQuery.isError && (
          <div className="border-b border-[#EBECEF] px-5 py-4">
            <span className="text-xs text-[#946200]">Alguns dados podem não estar disponíveis.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 px-5 py-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#EAF6F8] text-lg font-bold text-[#143163]">
            {user ? (
              getDisplayName(user).split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
            ) : (
              <CircleUserRound className="h-7 w-7" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-[220px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#143163]">{displayName}</h1>
              <span className="rounded-full bg-[#EEF1F6] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
                {getAccountLabel(user)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-[#143163]">Saldo disponível:</span>
              <span className="font-medium tabular-nums text-[#4B5563]">
                {isBalanceVisible ? formatCurrency(user?.balance) : "•••••• Kz"}
              </span>
              <button
                type="button"
                aria-label={isBalanceVisible ? "Ocultar saldo disponível" : "Mostrar saldo disponível"}
                aria-pressed={isBalanceVisible}
                onClick={() => setIsBalanceVisible((visible) => !visible)}
                className="grid size-7 shrink-0 place-items-center rounded-md text-[#143163] transition-colors hover:bg-[#F1F5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF] focus-visible:ring-offset-1"
              >
                {isBalanceVisible
                  ? <EyeOff className="size-4" aria-hidden="true" />
                  : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#4B5563]">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#143163]" aria-hidden="true" />
              <span><strong className="font-semibold text-[#143163]">Telefone:</strong> {user?.phone_number || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#143163]" aria-hidden="true" />
              <span><strong className="font-semibold text-[#143163]">Documento de identificação:</strong> {user?.bi_number || user?.nif || "—"}</span>
            </div>
            <span className={`ui-status-tag inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${hasKnownStatus ? getStatusClasses(status) : "bg-[#F2F4F7] text-[#667085]"}`}>
              <StatusIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {displayedStatus}
            </span>
            <span
              className={`ui-status-tag shrink-0 ${statusUserColor(user?.status) ?? "bg-[#F2F4F7] text-[#536176]"}`}
              aria-label={`Situação do utilizador: ${getUserSituationLabel(user)}`}
              title={`Situação do utilizador: ${getUserSituationLabel(user)}`}
            >
              {getUserSituationLabel(user)}
            </span>
            <div className="flex items-center gap-2">
              <LevelBadgeIcon
                level={user?.level ?? (typeof user?.level_up === "boolean" ? undefined : user?.level_up)}
                className="h-4 w-4 shrink-0"
              />
              <span><strong className="font-semibold text-[#143163]">{getLevelLabel(user)}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <Outlet context={user ?? { id: userId, account_type: accountType === "merchants" ? "Merchant" : "User" }} />
    </div>
  )
}

type UserContextSectionProps = {
  title: string
  description: string
}

export function UserContextSection({ title, description }: UserContextSectionProps) {
  const user = useUserContext()

  return (
    <section className="rounded-xl border border-[#E2E6ED] bg-white p-6 shadow-[0px_2px_10px_rgba(20,49,99,0.06)]">
      <h2 className="text-lg font-bold text-[#143163]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p>
      <p className="mt-5 rounded-lg bg-[#F6F8FB] px-4 py-3 text-sm text-[#4B5563]">
        Esta área está associada ao utilizador <strong className="font-semibold text-[#143163]">{getDisplayName(user)}</strong> e respeitará as permissões do perfil autenticado.
      </p>
    </section>
  )
}
