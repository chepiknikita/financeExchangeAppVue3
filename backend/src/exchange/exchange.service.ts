import { Injectable } from '@nestjs/common';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetService } from 'src/asset/asset.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ExchangeService {
  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
  ) {}

  async getExchangeStatus() {
    let exchange = await this.prisma.exchange.findFirst();

    if (!exchange) {
      exchange = await this.prisma.exchange.create({
        data: {
          start: new Date(),
          isTrading: false,
        },
      });
    }

    return exchange;
  }

  async updateExchangeStatus(updateExchangeDto: UpdateExchangeDto) {
    const exchange = await this.getExchangeStatus();

    return this.prisma.exchange.update({
      where: { id: exchange.id },
      data: updateExchangeDto,
    });
  }

  async startTrading() {
    return this.updateExchangeStatus({ isTrading: true });
  }

  async stopTrading() {
    return this.updateExchangeStatus({ isTrading: false });
  }

  @Cron('*/1 * * * *') // Every minute
  async updateStockPrices() {
    const exchange = await this.getExchangeStatus();

    if (exchange.isTrading) {
      await this.assetService.updateAssetPrices();
    }
  }
}
