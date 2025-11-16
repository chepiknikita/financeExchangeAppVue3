import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { WebSocketModule } from 'src/websocket/websocket.module';
import { UserModule } from 'src/user/user.module';
import { AssetModule } from 'src/asset/asset.module';
import { ExchangeModule } from 'src/exchange/exchange.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [WebSocketModule, UserModule, AssetModule, ExchangeModule],
})
export class OrderModule {}
