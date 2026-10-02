import type { Role } from "@/components/permissions-profile/profiles"

const roles: Role[] = [
  "operacoes",
  "financeiro",
  "suporte",
  "compliance",
  "tecnologia",
  "admin",
  "superadmin",
]

export function normalizeRole(value?: string | null): Role | null {
  if (!value) return null
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_")

  const aliases: Record<string, Role> = {
    "super_admin": "superadmin",
    "super_administrador": "superadmin",
    "administracao": "admin",
    "administrador": "admin",
    "operacao": "operacoes",
  }
  const candidate = aliases[normalized] ?? normalized.replace(/_/g, "") as Role
  return roles.includes(candidate) ? candidate : null
}
