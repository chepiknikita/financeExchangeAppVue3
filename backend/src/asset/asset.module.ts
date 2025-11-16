import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [WebSocketModule],
  exports: [AssetService],
})
export class AssetModule {}
