import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UpdateTradingSessionDto } from './dto/update-trading-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetService } from 'src/asset/asset.service';
import { Cron } from '@nestjs/schedule';
import { WebSocketFacadeService } from 'src/websocket/services/websocket-facade.service';

@Injectable()
export class TradingSessionService {
  private readonly logger = new Logger(TradingSessionService.name);
  private isUpdatingClosingPrices = false;

  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
    private webSocketFacade: WebSocketFacadeService,
  ) {}

  async getStatus() {
    let tradingSession = await this.prisma.tradingSession.findFirst();

    if (!tradingSession) {
      tradingSession = await this.prisma.tradingSession.create({
        data: {
          start: new Date(),
          isTrading: false,
        },
      });
    }
    return tradingSession;
  }

  async updateStatus(updateTradingSessionDto: UpdateTradingSessionDto) {
    this.validateDates(updateTradingSessionDto);
    const tradingSession = await this.getStatus();

    const updatedTradingSession = await this.prisma.tradingSession.update({
      where: { id: tradingSession.id },
      data: updateTradingSessionDto,
    });

    if (!updateTradingSessionDto.isTrading) {
      await this.updateClosingPrices();
    }

    await this.webSocketFacade.broadcastTradingSessionStatus(updatedTradingSession);
    return updatedTradingSession;
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
    const tradingSession = await this.getStatus();
    if (tradingSession.isTrading) {
      await this.assetService.updateAssetPrices();
    }
  }

  private validateDates(dto: UpdateTradingSessionDto) {
    const now = new Date();

    if (dto.end && new Date(dto.end) < now) {
      throw new BadRequestException(
        'Дата окончания (end) не может быть в прошлом',
      );
    }

    if (dto.start && dto.end && new Date(dto.start) > new Date(dto.end)) {
      throw new BadRequestException(
        'Дата начала (start) не может быть позже даты окончания (end)',
      );
    }
  }
}
