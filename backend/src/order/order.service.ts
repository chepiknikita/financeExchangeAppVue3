import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetService } from 'src/asset/asset.service';
import { ExchangeService } from 'src/exchange/exchange.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/creat-order.dto';
import { Order } from './entities/order.entity';
import { Asset, UserAsset } from 'generated/prisma';
import { WebSocketFacadeService } from '../websocket/services/websocket-facade.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private assetService: AssetService,
    private exchangeService: ExchangeService,
    private webSocketFacade: WebSocketFacadeService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const exchange = await this.exchangeService.getExchangeStatus();
    if (!exchange.isTrading) {
      throw new BadRequestException('Торги остановлены');
    }

    const user = await this.userService.getById(createOrderDto.userId);
    const asset = await this.assetService.getById(createOrderDto.assetId);

    const order =
      createOrderDto.type === 'BUY'
        ? await this.handleBuyOrder(user, asset, createOrderDto.quantity)
        : await this.handleSellOrder(user, asset, createOrderDto.quantity);

    await this.webSocketFacade.broadcastOrderCreated({
      ...order,
      asset,
      user: { id: user.id, name: user.name },
      timestamp: new Date(),
    });

    return order;
  }

  private async handleBuyOrder(
    user: any,
    asset: Asset,
    quantity: number,
  ): Promise<Order> {
    const totalCost = asset.price * quantity;

    if (user.balance < totalCost) {
      throw new BadRequestException('Недостаточно средств');
    }

    if (asset.availableQuantity < quantity) {
      throw new BadRequestException(
        `Недопустимое количество для покупки. Осталось всего: ${asset.availableQuantity}`,
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          assetId: asset.id,
          type: 'BUY',
          quantity,
          price: asset.price,
          status: 'EXECUTED',
          executedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalCost } },
      });

      const updatedAsset = await tx.asset.update({
        where: { id: asset.id },
        data: {
          availableQuantity: { decrement: quantity },
        },
      });

      await this.updateUserAsset(tx, user.id, asset.id, quantity, updatedAsset.price, 'BUY');
      await this.broadcastAssetUpdateAfterOrder(asset.id, updatedAsset);

      return order;
    });
  }

  private async handleSellOrder(
    user: any,
    asset: Asset,
    quantity: number,
  ): Promise<Order> {
    const userAsset = await this.prisma.userAsset.findUnique({
      where: {
        userId_assetId: {
          userId: user.id,
          assetId: asset.id,
        },
      },
    });

    if (!userAsset || userAsset.quantity < quantity) {
      throw new BadRequestException('Недостаточное количество активов');
    }

    const totalValue = asset.price * quantity;

    return await this.prisma.$transaction(async (tx) => {
      const order = await this.prisma.order.create({
        data: {
          userId: user.id,
          assetId: asset.id,
          type: 'SELL',
          quantity,
          price: asset.price,
          status: 'EXECUTED',
          executedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: totalValue } },
      });

      const updatedAsset = await tx.asset.update({
        where: { id: asset.id },
        data: { availableQuantity: { increment: quantity } },
      });

      await this.updateUserAsset(tx, user.id, asset.id, -quantity, updatedAsset.price, 'SELL');
      await this.broadcastAssetUpdateAfterOrder(asset.id, updatedAsset);

      return order;
    });
  }

  private async updateUserAsset(
    tx: any,
    userId: number,
    assetId: number,
    quantity: number,
    buyPrice: number,
    status: 'BUY' | 'SELL',
  ): Promise<void> {
    const existingUserAsset: UserAsset = await tx.userAsset.findUnique({
      where: {
        userId_assetId: {
          userId,
          assetId,
        },
      },
    });

    const averageBuyPrice = this.getAverageBuyPrice(existingUserAsset, quantity, buyPrice, status);

    if (existingUserAsset) {
      const newQuantity = existingUserAsset.quantity + quantity;
      if (newQuantity === 0) {
        await tx.userAsset.delete({
          where: {
            userId_assetId: {
              userId,
              assetId,
            },
          },
        });
      } else {
        await tx.userAsset.update({
          where: {
            userId_assetId: {
              userId,
              assetId,
            },
          },
          data: {
            quantity: newQuantity,
            averageBuyPrice,
          },
        });
      }
    } else if (quantity > 0) {
      await tx.userAsset.create({
        data: {
          userId,
          assetId,
          quantity,
          averageBuyPrice,
        },
      });
    }
  }

  private getAverageBuyPrice(userAsset: UserAsset, quantity: number, buyPrice: number, status: 'BUY' | 'SELL'): number {
    let averageBuyPrice = userAsset.averageBuyPrice;

    if (status === 'BUY') {
      const currentTotalCost = userAsset.quantity * userAsset.averageBuyPrice;
      const totalValue = quantity + buyPrice;
      averageBuyPrice = (currentTotalCost + totalValue) / (userAsset.quantity + quantity);
    }
    return averageBuyPrice;
  }

  private broadcastAssetUpdateAfterOrder = async (assetId: number, asset: Asset) => {
    await this.webSocketFacade.broadcastAssetUpdate(assetId, {
      assetId,
      asset,
      timestamp: new Date(),
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { asset: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
