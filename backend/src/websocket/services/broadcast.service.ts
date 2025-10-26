import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { IBroadcastService } from '../interfaces/broadcast.interface';
import { SubscriptionManagerService } from './subscription-manager.service';

@Injectable()
export class BroadcastService implements IBroadcastService {
  private server: Server;

  constructor(
    private subscriptionManager: SubscriptionManagerService,
  ) {}

  setServer(server: Server): void {
    this.server = server;
  }

  broadcastToChannel(channel: string, event: string, data: any): void {
    const subscribers = this.subscriptionManager.getSubscribers(channel);
    
    subscribers.forEach(clientId => {
      this.broadcastToClient(clientId, event, data);
    });
  }

  broadcastToClient(clientId: string, event: string, data: any): void {
    if (this.server) {
      this.server.to(clientId).emit(event, data);
    }
  }

  broadcastToAll(event: string, data: any): void {
    if (this.server) {
      this.server.emit(event, data);
    }
  }

  broadcastToFilteredChannel(
    channel: string, 
    event: string, 
    data: any, 
    filter: (sub: any) => boolean
  ): void {
    const subscribers = this.subscriptionManager.getSubscriptionsWithData(channel)
      .filter(filter)
      .map(sub => sub.clientId);

    subscribers.forEach(clientId => {
      this.broadcastToClient(clientId, event, data);
    });
  }
}