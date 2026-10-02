export type Role =
  | "operacoes"
  | "financeiro"
  | "suporte"
  | "compliance"
  | "tecnologia"
  | "admin"
  | "superadmin"

export const ROLE_LABELS: Record<Role, string> = {
  operacoes: "Operações",
  financeiro: "Financeiro",
  suporte: "Suporte",
  compliance: "Compliance",
  tecnologia: "Tecnologia",
  admin: "Administração",
  superadmin: "Super admin",
}
