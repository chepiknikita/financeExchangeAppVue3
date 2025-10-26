import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { ExchangeModule } from './exchange/exchange.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PrismaModule, UserModule, AssetModule, ExchangeModule, OrderModule],
})
export class AppModule {}
