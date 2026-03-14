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

  async getById(id: number): Promise<Asset | null> {
    return await this.prisma.asset.findUnique({
      where: { id },
      include: {
        history: true,
      },
    });
  }

  async getAssetHistory(assetId: number): Promise<PriceHistory[]> {
    await this.getEntityById(assetId);

    return await this.prisma.priceHistory.findMany({
      where: { assetId },
      orderBy: { timestamp: 'desc' },
      take: 100,
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
    await this.getEntityById(assetId);

    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: { price: updatedPrice },
      });

      const priceHistory = await tx.priceHistory.create({
        data: {
          assetId,
          price: updatedPrice,
        },
      });

      await this.webSocketFacade.broadcastAssetUpdate(assetId, {
        assetId,
        asset: updatedAsset,
        price: priceHistory,
        timestamp: new Date(),
      });

      return updatedAsset;
    });
  }

  async updateAssetPrices(): Promise<void> {
    const assets = await this.getAll();
    const tradingSession = await this.prisma.tradingSession.findFirst();

    if (!tradingSession?.isTrading) return;

    for (const asset of assets) {
      const changePercent = (Math.random() * 10 - 5) / 100;
      const newPrice = parseFloat(Math.max(0.01, asset.price * (1 + changePercent)).toFixed(2));

      await this.prisma.$transaction(async (tx) => {
        const updatedAsset = await tx.asset.update({
          where: { id: asset.id },
          data: { price: newPrice },
        });
        const priceHistory = await tx.priceHistory.create({
          data: { assetId: asset.id, price: newPrice },
        });
        await this.webSocketFacade.broadcastAssetUpdate(asset.id, {
          assetId: asset.id,
          asset: updatedAsset,
          price: priceHistory,
          timestamp: new Date(),
        });
      });
    }
    await this.webSocketFacade.broadcastAssetsUpdate();
  }

  async updateClosingPrices(): Promise<void> {
    const assets = await this.prisma.asset.findMany();

    for (const asset of assets) {
      await this.prisma.asset.update({
        where: { id: asset.id },
        data: { closingPrice: asset.price },
      });
    }
    await this.webSocketFacade.broadcastAssetsUpdate();
  }

  async updateAssetClosingPrice(assetId: number): Promise<void> {
    const asset = await this.getEntityById(assetId);
    await this.prisma.asset.update({
      where: { id: assetId },
      data: { closingPrice: asset.price },
    });
  }
}
