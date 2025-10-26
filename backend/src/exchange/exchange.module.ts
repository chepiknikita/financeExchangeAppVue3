import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import ExchangeGateway from './exchange.gateway';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangeGateway],
})
export class ExchangeModule {}
