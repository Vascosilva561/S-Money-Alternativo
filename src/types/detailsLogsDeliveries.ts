import type { WebhookDelivery } from "./logsDeliveriesWebhooks";


export interface WebhookDeliveryLog {
  delivery_id: string;
  status_code: number;
  response: Record<string, unknown>;
  request: Record<string, unknown>;
  created_at: string;
}

export interface WebhookDeliveryDetailsResponse {
  delivery: WebhookDelivery;
  logs: WebhookDeliveryLog[];
}
