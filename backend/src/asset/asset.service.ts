import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset, PriceHistory, UserAsset } from './entities/asset.entity';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Asset[]> {
    return await this.prisma.asset.findMany();
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
    return await this.prisma.priceHistory.findMany({
      where: { id },
      orderBy: { timestamp: 'desc' },
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

  async updateAssetPrice(assetId: number, updatedPrice: number): Promise<Asset> {
    // Обновляем текущую цену
    const updatedAsset = await this.prisma.asset.update({
      where: { id: assetId },
      data: { price: updatedPrice },
    });

    // Добавляем запись в историю
    await this.prisma.priceHistory.create({
      data: {
        assetId,
        price: updatedPrice,
      },
    });

    return updatedAsset;
  }



  async buyStock(userId: number, assetId: number, quantity: number): Promise<UserAsset> {
    const existing = await this.prisma.userAsset.findFirst({
      where: { userId, assetId },
    });
    
    // Todo: добавить вычет из глобального списка акции
    if (existing) {
      return this.prisma.userAsset.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      return this.prisma.userAsset.create({
        data: { userId, assetId, quantity },
      });
    }
  }

  async sellStock(userId: number, assetId: number, quantity: number): Promise<UserAsset | null> {
    const existing = await this.prisma.userAsset.findFirst({
      where: { userId, assetId },
    });

    if (!existing) return null;
    // Todo: добавить количество в глобальном списке акции
    const newQuantity = existing.quantity - quantity;
    if (newQuantity <= 0) {
      await this.prisma.userAsset.delete({ where: { id: existing.id } });
      return null;
    }

    return this.prisma.userAsset.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });
  }
}
