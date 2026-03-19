export interface WebSocketMessage {
  type: string;
  payload: WebSocketPayload;
}

export interface Subscription {
  event: string;
  callback: (data: unknown) => void;
  id: string;
}

export type WebSocketPayload = number | Record<string, unknown> | null;
