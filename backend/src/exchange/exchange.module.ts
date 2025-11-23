import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { AssetModule } from 'src/asset/asset.module';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService],
  imports: [WebSocketModule, AssetModule],
  exports: [ExchangeService],
})
export class ExchangeModule {}
