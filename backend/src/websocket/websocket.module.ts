import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketFacadeService } from './services/websocket-facade.service';
import { BroadcastService } from './services/broadcast.service';
import { TradingSessionSubscriptionService } from './services/trading-session-subscription.service';
import { OrderSubscriptionService } from './services/order-subscription.service';
import { AssetSubscriptionService } from './services/asset-subscription.service';
import { SubscriptionManagerService } from './services/subscription-manager.service';

@Module({
  providers: [
    WebSocketGateway,
    WebSocketFacadeService,
    SubscriptionManagerService,
    BroadcastService,
    AssetSubscriptionService,
    TradingSessionSubscriptionService,
    OrderSubscriptionService,
  ],
  exports: [WebSocketFacadeService, BroadcastService],
})
export class WebSocketModule {}
