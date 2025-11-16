import { forwardRef, Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketFacadeService } from './services/websocket-facade.service';
import { BroadcastService } from './services/broadcast.service';
import { ExchangeSubscriptionService } from './services/exchange-subscription.service';
import { OrderSubscriptionService } from './services/order-subscription.service';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { OrderModule } from 'src/order/order.module';
import { AssetModule } from 'src/asset/asset.module';
import { AssetSubscriptionService } from './services/asset-subscription.service';
import { SubscriptionManagerService } from './services/subscription-manager.service';

@Module({
  // imports: [
  //   forwardRef(() => AssetModule),
  //   forwardRef(() => ExchangeModule),
  //   forwardRef(() => OrderModule),
  // ],
  providers: [
    WebSocketGateway,
    WebSocketFacadeService,
    SubscriptionManagerService,
    BroadcastService,
    AssetSubscriptionService,
    ExchangeSubscriptionService,
    OrderSubscriptionService,
  ],
  exports: [
    WebSocketFacadeService,
    BroadcastService,
  ],
})
export class WebSocketModule {}