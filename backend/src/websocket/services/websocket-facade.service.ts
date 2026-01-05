import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AssetSubscriptionService } from './asset-subscription.service';
import { TradingSessionSubscriptionService } from './trading-session-subscription.service';
import { OrderSubscriptionService } from './order-subscription.service';

@Injectable()
export class WebSocketFacadeService implements OnModuleInit {
  private services: Map<string, any> = new Map();

  constructor(
    private assetSubscriptionService: AssetSubscriptionService,
    private tradingSessionSubscriptionService: TradingSessionSubscriptionService,
    private orderSubscriptionService: OrderSubscriptionService,
  ) {}

  onModuleInit() {
    this.services.set('assets', this.assetSubscriptionService);
    this.services.set('tradingSession', this.tradingSessionSubscriptionService);
    this.services.set('orders', this.orderSubscriptionService);
  }

  handleConnection(client: Socket): void {
    this.services.forEach((service) => {
      service.handleConnection(client);
    });
  }

  handleDisconnect(client: Socket): void {
    this.services.forEach((service) => {
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

  async broadcastAssetUpdate(assetId: number, priceData: any): Promise<void> {
    await this.assetSubscriptionService.broadcastAssetUpdate(
      assetId,
      priceData,
    );
  }

  async broadcastAssetsUpdate(): Promise<void> {
    await this.assetSubscriptionService.broadcastAssetsUpdate();
  }

  async broadcastTradingSessionStatus(status: any): Promise<void> {
    await this.tradingSessionSubscriptionService.broadcastTradingSessionStatus(status);
  }

  async broadcastOrderCreated(order: any): Promise<void> {
    await this.orderSubscriptionService.broadcastOrderCreated(order);
  }
}
