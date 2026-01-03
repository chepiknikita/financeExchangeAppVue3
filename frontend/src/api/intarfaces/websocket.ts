interface WebSocketMessage {
  type: string;
  payload: any;
}

interface Subscription {
  event: string;
  callback: (data: any) => void;
  id: string;
}