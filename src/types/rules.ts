export type AccountRuleType = "User" | "Merchant"

export interface Rule {
  id?: string | number
  account_type: AccountRuleType | string
  rule_type: number | string | null
  transaction_rules: number | string | null
  per_day: number | string | null
  per_mounth: number | string | null
  found_total: number | string | null
}

export interface RulesResponse {
  rules?: Rule[]
  total?: number | string
  total_pages?: number
}
