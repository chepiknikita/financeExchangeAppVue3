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

    const order = createOrderDto.type === 'BUY'
       ? await this.handleBuyOrder(user, asset, createOrderDto.quantity)
       : await this.handleSellOrder(user, asset, createOrderDto.quantity);

    // Broadcast order creation
    await this.webSocketFacade.broadcastOrderCreated({
      ...order,
      asset,
      user: { id: user.id, name: user.name },
      timestamp: new Date(),
    });
  }

  private async handleBuyOrder(user: any, asset: Asset, quantity: number): Promise<Order> {
    const totalCost = asset.price * quantity;

    if (user.balance < totalCost) {
      throw new BadRequestException('Insufficient funds');
    }

    // Create order
    const order = await this.prisma.order.create({
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

    // Update user balance
    await this.userService.updateBalance(user.id, -totalCost);

    // Update user assets
    await this.updateUserAsset(user.id, asset.id, quantity);

    return order;
  }

  private async handleSellOrder(user: any, asset: Asset, quantity: number): Promise<Order> {
    const userStock = await this.prisma.userAsset.findUnique({
      where: {
        userId_assetId: {
          userId: user.id,
          stockId: asset.id,
        },
      },
    });

    if (!userStock || userStock.quantity < quantity) {
      throw new BadRequestException('Insufficient stock quantity');
    }

    const totalValue = asset.price * quantity;

    // Create order
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

    // Update user balance
    await this.userService.updateBalance(user.id, totalValue);

    // Update user assets
    await this.updateUserAsset(user.id, asset.id, -quantity);

    return order;
  }

  private async updateUserAsset(userId: number, assetId: number, quantity: number): Promise<void> {
    const existingUserAsset = await this.prisma.userAsset.findUnique({
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
        await this.prisma.userAsset.delete({
          where: {
            userId_assetId: {
              userId,
              assetId,
            },
          },
        });
      } else {
        await this.prisma.userAsset.update({
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
      await this.prisma.userAsset.create({
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
      include: { stock: true },
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
