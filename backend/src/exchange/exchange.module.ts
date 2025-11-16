import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService],
  imports: [AssetModule],
  exports: [ExchangeService],
})
export class ExchangeModule {}
