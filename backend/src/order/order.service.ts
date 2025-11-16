import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetService } from 'src/asset/asset.service';
import { ExchangeService } from 'src/exchange/exchange.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/creat-order.dto';
import { Order } from './entities/order.entity';
import { Asset } from 'generated/prisma';
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
    // Check if trading is allowed
    const exchange = await this.exchangeService.getExchangeStatus();
    if (!exchange.isTrading) {
      throw new BadRequestException('Trading is currently suspended');
    }

    const user = await this.userService.getById(createOrderDto.userId);
    const asset = await this.assetService.getById(createOrderDto.assetId);

    const order =
      createOrderDto.type === 'BUY'
        ? await this.handleBuyOrder(user, asset, createOrderDto.quantity)
        : await this.handleSellOrder(user, asset, createOrderDto.quantity);

    // Broadcast order creation
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
      throw new BadRequestException('Insufficient funds');
    }

    if (asset.availableQuantity < quantity) {
      throw new BadRequestException(
        `Not enough shares available. Only ${asset.availableQuantity} shares left`,
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

      await tx.asset.update({
        where: { id: asset.id },
        data: {
          availableQuantity: { decrement: quantity },
        },
      });

      await this.updateUserAsset(tx, user.id, asset.id, quantity);
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
      throw new BadRequestException('Insufficient asset quantity');
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

      await tx.asset.update({
        where: { id: asset.id },
        data: { availableQuantity: { increment: quantity } },
      });

      await this.updateUserAsset(tx, user.id, asset.id, -quantity);

      return order;
    });
  }

  private async updateUserAsset(
    tx: any,
    userId: number,
    assetId: number,
    quantity: number,
  ): Promise<void> {
    const existingUserAsset = await tx.userAsset.findUnique({
      where: {
        userId_assetId: {
          userId,
          assetId,
        },
      },
    });

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
          data: { quantity: newQuantity },
        });
      }
    } else if (quantity > 0) {
      await tx.userAsset.create({
        data: {
          userId,
          assetId,
          quantity,
        },
      });
    }
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
