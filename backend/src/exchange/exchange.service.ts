import { Injectable, Logger } from '@nestjs/common';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetService } from 'src/asset/asset.service';
import { Cron } from '@nestjs/schedule';
import { WebSocketFacadeService } from 'src/websocket/services/websocket-facade.service';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  private isUpdatingClosingPrices = false;

  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
    private webSocketFacade: WebSocketFacadeService,
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
    updateExchangeDto.validateDates();
    const exchange = await this.getExchangeStatus();

    const updatedExchange = await this.prisma.exchange.update({
      where: { id: exchange.id },
      data: updateExchangeDto,
    });

    if (!updateExchangeDto.isTrading) {
      await this.updateClosingPrices();
    }

    await this.webSocketFacade.broadcastExchangeStatus(updatedExchange);
    return updatedExchange;
  }

  private async updateClosingPrices(): Promise<void> {
    if (this.isUpdatingClosingPrices) {
      this.logger.warn('⚠️ Обновление цен закрытия уже выполняется');
      return;
    }

    this.isUpdatingClosingPrices = true;

    try {
      await this.assetService.updateClosingPrices();
    } catch (error) {
      this.logger.error('❌ Ошибка при обновлении цен закрытия:', error);
    } finally {
      this.isUpdatingClosingPrices = false;
    }
  }

  @Cron('*/1 * * * *')
  async updateAssetPrices() {
    const exchange = await this.getExchangeStatus();
    if (exchange.isTrading) {
      await this.assetService.updateAssetPrices();
    }
  }
}
