import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IWebSocketService } from '../interfaces/websocket.interface';
import { BroadcastService } from './broadcast.service';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class TradingSessionSubscriptionService implements IWebSocketService {
  private readonly CHANNEL_TRADING_SESSION = 'trading-session';

  constructor(
    private subscriptionManager: SubscriptionManagerService,
    private broadcastService: BroadcastService,
  ) {}

  handleConnection(client: Socket): void {
    this.subscriptionManager.subscribe(client.id, this.CHANNEL_TRADING_SESSION);
    console.log(
      `Trading session service: Client ${client.id} connected and subscribed to tradingSession`,
    );
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionManager.unsubscribe(client.id, this.CHANNEL_TRADING_SESSION);
  }

  handleSubscribe(client: Socket, data: any): void {
    const { type } = data;
    if (type === 'trading-session') {
      this.subscriptionManager.subscribe(client.id, this.CHANNEL_TRADING_SESSION);
      console.log(
        `Trading session service: Client ${client.id} manually subscribed to trading session`,
      );
    }
  }

  handleUnsubscribe(client: Socket, data: any): void {
    const { type } = data;
    if (type === 'trading-session') {
      this.subscriptionManager.unsubscribe(client.id, this.CHANNEL_TRADING_SESSION);
      console.log(
        `Trading session service: Client ${client.id} unsubscribed from trading session`,
      );
    }
  }

  async broadcastTradingSessionStatus(status: any): Promise<void> {
    this.broadcastService.broadcastToChannel(
      this.CHANNEL_TRADING_SESSION,
      'trading-session-status',
      status,
    );
  }
}
