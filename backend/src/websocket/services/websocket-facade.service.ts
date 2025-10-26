import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AssetSubscriptionService } from './asset-subscription.service';
import { ExchangeSubscriptionService } from './exchange-subscription.service';
import { OrderSubscriptionService } from './order-subscription.service';
// import { BroadcastService } from './broadcast.service';

@Injectable()
export class WebSocketFacadeService implements OnModuleInit {
  private services: Map<string, any> = new Map();

  constructor(
    private assetSubscriptionService: AssetSubscriptionService,
    private exchangeSubscriptionService: ExchangeSubscriptionService,
    private orderSubscriptionService: OrderSubscriptionService,
    // private broadcastService: BroadcastService, TODO для чего
  ) {}

  onModuleInit() {
    // Register all services
    this.services.set('assets', this.assetSubscriptionService);
    this.services.set('exchange', this.exchangeSubscriptionService);
    this.services.set('orders', this.orderSubscriptionService);
  }

  handleConnection(client: Socket): void {
    // Notify all services about new connection
    this.services.forEach(service => {
      service.handleConnection(client);
    });
  }

  handleDisconnect(client: Socket): void {
    // Notify all services about disconnection
    this.services.forEach(service => {
      service.handleDisconnect(client);
    });
  }

  handleSubscribe(client: Socket, serviceName: string, data: any): void {
    const service = this.services.get(serviceName);
    if (service) {
      service.handleSubscribe(client, data);
    } else {
      console.warn(`Unknown WebSocket service: ${serviceName}`);
    }
  }

  handleUnsubscribe(client: Socket, serviceName: string, data: any): void {
    const service = this.services.get(serviceName);
    if (service) {
      service.handleUnsubscribe(client, data);
    } else {
      console.warn(`Unknown WebSocket service: ${serviceName}`);
    }
  }

  // Public API for broadcasting - delegate to specific services
  async broadcastAssetkUpdate(assetId: number, stockData: any): Promise<void> {
    await this.assetSubscriptionService.broadcastAssetUpdate(assetId, stockData);
  }

  async broadcastAssetPriceUpdate(assetId: number, priceData: any): Promise<void> {
    await this.assetSubscriptionService.broadcastAssetPriceUpdate(assetId, priceData);
  }

  async broadcastExchangeStatus(status: any): Promise<void> {
    await this.exchangeSubscriptionService.broadcastExchangeStatus(status);
  }

  async broadcastOrderCreated(order: any): Promise<void> {
    await this.orderSubscriptionService.broadcastOrderCreated(order);
  }
}