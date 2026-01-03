import { Injectable } from '@nestjs/common';
import { ISubscriptionManager } from '../interfaces/subscription.interface';

interface Subscription {
  clientId: string;
  data?: any;
  subscribedAt: Date;
}

@Injectable()
export class SubscriptionManagerService implements ISubscriptionManager {
  private subscriptions = new Map<string, Map<string, Subscription>>();

  subscribe(clientId: string, channel: string, data?: any): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Map());
    }

    const channelSubscriptions = this.subscriptions.get(channel)!;
    channelSubscriptions.set(clientId, {
      clientId,
      data,
      subscribedAt: new Date(),
    });
  }

  unsubscribe(clientId: string, channel: string, data?: any): void {
    const channelSubscriptions = this.subscriptions.get(channel);
    if (channelSubscriptions) {
      channelSubscriptions.delete(clientId);

      if (channelSubscriptions.size === 0) {
        this.subscriptions.delete(channel);
      }
    }
  }

  getSubscribers(
    channel: string,
    filter?: (sub: Subscription) => boolean,
  ): string[] {
    const channelSubscriptions = this.subscriptions.get(channel);
    if (!channelSubscriptions) return [];

    const subscribers = Array.from(channelSubscriptions.values());
    const filteredSubscribers = filter
      ? subscribers.filter(filter)
      : subscribers;

    return filteredSubscribers.map((sub) => sub.clientId);
  }

  removeClient(clientId: string): void {
    for (const [channel, channelSubscriptions] of this.subscriptions) {
      channelSubscriptions.delete(clientId);

      if (channelSubscriptions.size === 0) {
        this.subscriptions.delete(channel);
      }
    }
  }
}
