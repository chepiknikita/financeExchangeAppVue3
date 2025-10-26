export interface IBroadcastService {
  broadcastToChannel(channel: string, event: string, data: any): void;
  broadcastToClient(clientId: string, event: string, data: any): void;
  broadcastToAll(event: string, data: any): void;
}