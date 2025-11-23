import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IWebSocketService } from '../interfaces/websocket.interface';
import { BroadcastService } from './broadcast.service';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class AssetSubscriptionService implements IWebSocketService {
  private readonly CHANNEL_ASSETS = 'assets';

  constructor(
    private subscriptionManager: SubscriptionManagerService,
    private broadcastService: BroadcastService,
  ) {}

  handleConnection(client: Socket): void {
    console.log(`Asset service: Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionManager.removeClient(client.id);
    console.log(`Asset service: Client ${client.id} disconnected`);
  }

  handleSubscribe(client: Socket, data: any): void {
    const { assetId } = data;
    if (assetId) {
      this.subscriptionManager.subscribe(
        client.id,
        `${this.CHANNEL_ASSETS}:${assetId}`,
      );
    } else {
      this.subscriptionManager.subscribe(client.id, this.CHANNEL_ASSETS);
    }
  }

  handleUnsubscribe(client: Socket, data: any): void {
    const { assetId } = data;
    if (assetId) {
      this.subscriptionManager.unsubscribe(
        client.id,
        `${this.CHANNEL_ASSETS}:${assetId}`,
      );
    } else {
      this.subscriptionManager.unsubscribe(client.id, this.CHANNEL_ASSETS);
    }
  }

  async broadcastAssetUpdate(assetId: number, assetData: any): Promise<void> {
    this.broadcastService.broadcastToChannel(
      `${this.CHANNEL_ASSETS}:${assetId}`,
      'asset-update',
      { assetId, ...assetData },
    );
  }

  async broadcastAssetsUpdate() {
    this.broadcastService.broadcastToAll('assets-update', {
      type: 'assets-update',
      timeStamp: new Date(),
    });
  }
}
