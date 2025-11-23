import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IWebSocketService } from '../interfaces/websocket.interface';
import { BroadcastService } from './broadcast.service';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class OrderSubscriptionService implements IWebSocketService {
  private readonly CHANNEL_ORDERS_ALL = 'orders:all';
  private readonly CHANNEL_ORDERS_USER = 'orders:user';

  constructor(
    private subscriptionManager: SubscriptionManagerService,
    private broadcastService: BroadcastService,
  ) {}

  handleConnection(client: Socket): void {
    console.log(`Order service: Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionManager.removeClient(client.id);
  }

  handleSubscribe(client: Socket, data: any): void {
    const { type, userId } = data;

    switch (type) {
      case 'all-orders':
        this.handleAllOrdersSubscription(client);
        break;
      case 'user-orders':
        this.handleUserOrdersSubscription(client, userId);
        break;
      default:
        console.warn(`Unknown order subscription type: ${type}`);
    }
  }

  handleUnsubscribe(client: Socket, data: any): void {
    const { type, userId } = data;

    switch (type) {
      case 'all-orders':
        this.handleAllOrdersUnsubscription(client);
        break;
      case 'user-orders':
        this.handleUserOrdersUnsubscription(client, userId);
        break;
      default:
        console.warn(`Unknown order unsubscription type: ${type}`);
    }
  }

  private handleAllOrdersSubscription(client: Socket): void {
    this.subscriptionManager.subscribe(client.id, this.CHANNEL_ORDERS_ALL);
    console.log(`Client ${client.id} subscribed to all orders`);
  }

  private handleAllOrdersUnsubscription(client: Socket): void {
    this.subscriptionManager.unsubscribe(client.id, this.CHANNEL_ORDERS_ALL);
    console.log(`Client ${client.id} unsubscribed from all orders`);
  }

  private handleUserOrdersSubscription(client: Socket, userId: number): void {
    this.subscriptionManager.subscribe(
      client.id,
      `${this.CHANNEL_ORDERS_USER}:${userId}`,
    );
    console.log(`Client ${client.id} subscribed to user ${userId} orders`);
  }

  private handleUserOrdersUnsubscription(client: Socket, userId: number): void {
    this.subscriptionManager.unsubscribe(
      client.id,
      `${this.CHANNEL_ORDERS_USER}:${userId}`,
    );
    console.log(`Client ${client.id} unsubscribed from user ${userId} orders`);
  }

  async broadcastOrderCreated(order: any): Promise<void> {
    // Broadcast to all subscribers of all orders
    this.broadcastService.broadcastToChannel(
      this.CHANNEL_ORDERS_ALL,
      'order-created',
      order,
    );

    // Broadcast to specific user if they are subscribed
    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_ORDERS_USER}:${order.userId}`,
      'order-created',
      order,
    );
  }
}
