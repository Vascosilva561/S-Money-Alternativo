export type WebhookServiceType = "gpo" | "sector"

export type WebhookSubscriberType = "internal_payments" | "external_payments"

export interface Webhook {
  id: string | number
  client_id: string
  service_type: WebhookServiceType
  merchant_number: string
  subscriber_type: WebhookSubscriberType
  name: string
  url: string
  events: string[]
  token_prefix: string
  dynamic_auth_per_tx: boolean
  dynamic_auth_algorithm?: string | null
  dynamic_auth_digest: string
  is_active: boolean
  check_ssl: boolean
  created_at: string
  updated_at?: string
}

export interface WebhooksResponse {
  client_id?: string
  data: Webhook[]
  total: number
}
