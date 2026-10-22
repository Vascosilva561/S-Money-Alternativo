export type WebhookDeliveryStatus = "SUCCESS" | "FAILED" | string

export interface WebhookDeliveryPayload {
  [key: string]: unknown
}

export interface WebhookDeliverySubscriber {
  ID: number
  ClientID: string
  ServiceType: string
  MerchantNumber: string
  SubscriberType: string
  Name: string
  URL: string
  Events: string[]
  AuthToken: string
  TokenPrefix: string
  DynamicAuthPerTx: boolean
  DynamicAuthSecretWord: string | null
  DynamicAuthAlgorithm: string | null
  DynamicAuthDigest: string
  IsActive: boolean
  CheckSSL: boolean
  CreatedAt: string
  UpdatedAt: string
}

export interface WebhookDelivery {
  id: number | string
  client_id: string
  merchant_number: string
  status: WebhookDeliveryStatus
  hook: string
  service: string
  subscriber: WebhookDeliverySubscriber
  occurred_at: string
  retries: number
  next_call: number | null
  is_replay: boolean
  payload: WebhookDeliveryPayload
  created_at: string
  updated_at: string
  lease_until: number
}

export interface WebhookDeliveriesResponse {
  data: WebhookDelivery[]
  total: number
}

export interface WebhookDeliveryLog {
  delivery_id: string
  status_code: number
  response: Record<string, unknown>
  request: Record<string, unknown>
  created_at: string
}

export interface WebhookDeliveryDetailsResponse {
  delivery: WebhookDelivery
  logs: WebhookDeliveryLog[]
}
