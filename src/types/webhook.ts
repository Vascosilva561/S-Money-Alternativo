// @/types/webhooks.ts

export interface Webhook {
  id: string | number
  name: string
  url: string
  events: string[] | number
  channels: string[] | number
  active: boolean
  verify_ssl: boolean
  created_at: string
}