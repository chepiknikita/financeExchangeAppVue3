import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { TradingSessionModule } from './tradingSession/tradingSession.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  providers: [TradingSessionModule],
  imports: [
    PrismaModule,
    UserModule,
    AssetModule,
    TradingSessionModule,
    OrderModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
