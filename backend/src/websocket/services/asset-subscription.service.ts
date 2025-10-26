import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IWebSocketService } from '../interfaces/websocket.interface';
import { BroadcastService } from './broadcast.service';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class AssetSubscriptionService implements IWebSocketService {
  private readonly CHANNEL_ASSETS = 'assets';
  private readonly CHANNEL_PRICE_HISTORY = 'price-history';

  constructor(
    private subscriptionManager: SubscriptionManagerService,
    private broadcastService: BroadcastService,
  ) {}

  handleConnection(client: Socket): void {
    // Initialization logic for asset subscriptions
    console.log(`Asset service: Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionManager.removeClient(client.id);
    console.log(`Asset service: Client ${client.id} disconnected`);
  }

  handleSubscribe(client: Socket, data: any): void {
    const { type, assetIds } = data;

    switch (type) {
      case 'assets':
        this.handleAssetSubscription(client, assetIds);
        break;
      case 'price-history':
        this.handlePriceHistorySubscription(client, assetIds);
        break;
      default:
        console.warn(`Unknown subscription type: ${type}`);
    }
  }

  handleUnsubscribe(client: Socket, data: any): void {
    const { type, assetIds } = data;

    switch (type) {
      case 'assets':
        this.handleAssetUnsubscription(client, assetIds);
        break;
      case 'price-history':
        this.handlePriceHistoryUnsubscription(client, assetIds);
        break;
      default:
        console.warn(`Unknown unsubscription type: ${type}`);
    }
  }

  private handleAssetSubscription(client: Socket, assetIds: number[]): void {
    assetIds.forEach((assetId) => {
      this.subscriptionManager.subscribe(
        client.id,
        `${this.CHANNEL_ASSETS}:${assetId}`,
      );
    });

    console.log(`Client ${client.id} subscribed to assets:`, assetIds);
  }

  private handleAssetUnsubscription(client: Socket, assetIds: number[]): void {
    assetIds.forEach((assetId) => {
      this.subscriptionManager.unsubscribe(
        client.id,
        `${this.CHANNEL_ASSETS}:${assetId}`,
      );
    });

    console.log(`Client ${client.id} unsubscribed from assets:`, assetIds);
  }

  private handlePriceHistorySubscription(
    client: Socket,
    assetIds: number[],
  ): void {
    assetIds.forEach((assetId) => {
      this.subscriptionManager.subscribe(
        client.id,
        `${this.CHANNEL_PRICE_HISTORY}:${assetId}`,
      );
    });

    console.log(`Client ${client.id} subscribed to price history:`, assetIds);
  }

  private handlePriceHistoryUnsubscription(
    client: Socket,
    assetIds: number[],
  ): void {
    assetIds.forEach((assetId) => {
      this.subscriptionManager.unsubscribe(
        client.id,
        `${this.CHANNEL_PRICE_HISTORY}:${assetId}`,
      );
    });

    console.log(
      `Client ${client.id} unsubscribed from price history:`,
      assetIds,
    );
  }

  // Public API for other services to broadcast asset updates
  async broadcastAssetUpdate(assetId: number, assetkData: any): Promise<void> {
    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_ASSETS}:${assetId}`,
      'asset-update',
      { assetId, ...assetkData },
    );
  }

  async broadcastAssetPriceUpdate(
    assetId: number,
    priceData: any,
  ): Promise<void> {
    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_ASSETS}:${assetId}`,
      'asset-price-update',
      { assetId, ...priceData },
    );

    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_PRICE_HISTORY}:${assetId}`,
      'price-history-update',
      { assetId, ...priceData },
    );
  }

  async broadcastPriceHistoryUpdate(
    assetId: number,
    historyData: any,
  ): Promise<void> {
    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_PRICE_HISTORY}:${assetId}`,
      'price-history-batch-update',
      { assetId, ...historyData },
    );
  }
}
