import { useOutletContext } from "react-router"

export type UserContextAccount = {
  id?: string | number
  account_type?: string
  first_name?: string
  last_name?: string
  business_name?: string
  phone_number?: string
  email?: string
  bi_number?: string
  nif?: string
  level?: string | number
  level_up?: string | number | boolean
  balance?: string | number
  status?: string
  status_validate?: string
  user_document?: {
    province?: string
    city?: string
    nacionalidade?: string
    country?: string
    birthday?: string
    address?: string
  }
}

export function useUserContext() {
  return useOutletContext<UserContextAccount>()
}
