import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IWebSocketService } from '../interfaces/websocket.interface';
import { BroadcastService } from './broadcast.service';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class ExchangeSubscriptionService implements IWebSocketService {
  private readonly CHANNEL_EXCHANGE = 'exchange';

  constructor(
    private subscriptionManager: SubscriptionManagerService,
    private broadcastService: BroadcastService,
  ) {}

  handleConnection(client: Socket): void {
    // Auto-subscribe to exchange status
    this.subscriptionManager.subscribe(client.id, this.CHANNEL_EXCHANGE);
    console.log(`Exchange service: Client ${client.id} connected and subscribed to exchange`);
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionManager.unsubscribe(client.id, this.CHANNEL_EXCHANGE);
  }

  handleSubscribe(client: Socket, data: any): void {
    // Exchange has only one channel, so no specific handling needed
    console.log(`Exchange service: Client ${client.id} subscription request:`, data);
  }

  handleUnsubscribe(client: Socket, data: any): void {
    // Exchange has only one channel, so no specific handling needed
    console.log(`Exchange service: Client ${client.id} unsubscription request:`, data);
  }

  // Public API for broadcasting exchange updates
  async broadcastExchangeStatus(status: any): Promise<void> {
    this.broadcastService.broadcastToChannel(
      this.CHANNEL_EXCHANGE,
      'exchange-status',
      status
    );
  }

  async broadcastTradingStatus(isTrading: boolean): Promise<void> {
    this.broadcastService.broadcastToChannel(
      this.CHANNEL_EXCHANGE,
      'trading-status',
      { isTrading, timestamp: new Date() }
    );
  }
}