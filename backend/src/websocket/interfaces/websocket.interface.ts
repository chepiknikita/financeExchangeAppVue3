import { Socket } from 'socket.io';

export interface IWebSocketService {
  handleConnection(client: Socket): void;
  handleDisconnect(client: Socket): void;
  handleSubscribe(client: Socket, data: any): void;
  handleUnsubscribe(client: Socket, data: any): void;
}