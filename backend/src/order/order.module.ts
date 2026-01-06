import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { WebSocketModule } from 'src/websocket/websocket.module';
import { UserModule } from 'src/user/user.module';
import { AssetModule } from 'src/asset/asset.module';
import { TradingSessionModule } from 'src/tradingSession/tradingSession.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [WebSocketModule, UserModule, AssetModule, TradingSessionModule],
})
export class OrderModule {}
