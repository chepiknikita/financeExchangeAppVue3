import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset, PriceHistory, UserAsset } from './entities/asset.entity';
import { WebSocketFacadeService } from '../websocket/services/websocket-facade.service';

@Injectable()
export class AssetService {
  constructor(
    private prisma: PrismaService,
    private webSocketFacade: WebSocketFacadeService,
  ) {}

  async getAll(): Promise<Asset[]> {
    return await this.prisma.asset.findMany();
  }

  async getEntityById(id: number): Promise<Asset> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  async getById(id: number): Promise<Asset> {
    return await this.prisma.asset.findUnique({
      where: { id },
      include: {
        history: true,
      },
    });
  }

  async getAssetHistory(id: number): Promise<PriceHistory[]> {
    await this.getEntityById(id); // Check if asset exists

    return await this.prisma.priceHistory.findMany({
      where: { id },
      orderBy: { timestamp: 'asc' },
      take: 100, // Last 100 price points
    });
  }

  async getUserPortfolio(userId: number): Promise<UserAsset[]> {
    return await this.prisma.userAsset.findMany({
      where: { userId },
      include: {
        asset: true,
      },
    });
  }

  async updateAssetPrice(
    assetId: number,
    updatedPrice: number,
  ): Promise<Asset> {
    this.getEntityById(assetId);

    return this.prisma.$transaction(async (tx) => {
      // Обновляем текущую цену
      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: { price: updatedPrice },
      });

      // Добавляем запись в историю
      await tx.priceHistory.create({
        data: {
          assetId,
          price: updatedPrice,
        },
      });

      await this.webSocketFacade.broadcastAssetPriceUpdate(assetId, {
        assetId,
        price: updatedPrice,
        asset: updatedAsset,
        timestamp: new Date(),
      });

      return updatedAsset;
    });
  }

  async calculateProfitLoss(
    userId: number,
  ): Promise<{ [key: number]: number }> {
    const userAssets = await this.getUserPortfolio(userId);
    const profitLoss: { [key: number]: number } = {};

    for (const userAsset of userAssets) {
      const priceHistory = await this.prisma.priceHistory.findFirst({
        where: { assetId: userAsset.assetId },
        orderBy: { timestamp: 'asc' },
      });

      if (priceHistory) {
        const currentValue = userAsset.quantity * userAsset.asset.price;
        const initialValue = userAsset.quantity * priceHistory.price;
        profitLoss[userAsset.assetId] = currentValue - initialValue;
      }
    }

    return profitLoss;
  }

  async updateAssetPrices(): Promise<void> {
    const assets = await this.getAll();

    for (const asset of assets) {
      // Generate random price change between -5% and +5%
      const changePercent = (Math.random() * 10 - 5) / 100;
      const newPrice = Math.max(0.01, asset.price * (1 + changePercent));

      await this.updateAssetPrice(asset.id, parseFloat(newPrice.toFixed(2)));
    }
  }
}
