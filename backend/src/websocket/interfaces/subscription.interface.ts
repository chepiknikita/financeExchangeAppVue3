export interface ISubscriptionManager {
  subscribe(clientId: string, channel: string, data?: any): void;
  unsubscribe(clientId: string, channel: string, data?: any): void;
  getSubscribers(channel: string, filter?: any): string[];
  removeClient(clientId: string): void;
}