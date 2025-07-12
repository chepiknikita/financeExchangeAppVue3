import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { ExchangeModule } from './exchange/exchange.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PrismaModule, UserModule, AssetModule, ExchangeModule],
})
export class AppModule {}
