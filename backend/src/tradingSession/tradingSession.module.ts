import { Module } from '@nestjs/common';
import { TradingSessionService } from './tradingSession.service';
import { TradingSessionController } from './tradingSession.controller';
import { AssetModule } from 'src/asset/asset.module';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [TradingSessionController],
  providers: [TradingSessionService],
  imports: [WebSocketModule, AssetModule],
  exports: [TradingSessionService],
})
export class TradingSessionModule {}
