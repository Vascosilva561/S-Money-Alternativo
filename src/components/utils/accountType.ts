import { ROLE_LABELS } from "@/components/permissions-profile/profiles"
import { normalizeRole } from "@/components/utils/normalizeRole"

export function getAccountTypeLabel(accountType?: string | null): string {
  if (!accountType) return "—"
  const role = normalizeRole(accountType)
  if (role === "admin") return "Administrador"
  if (role === "superadmin") return "Super administrador"
  return role ? ROLE_LABELS[role] : accountType
}
