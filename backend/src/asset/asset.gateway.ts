import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
@WebSocketGateway({ namespace: 'assets', cors: true })
export default class AssetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    console.log(`Assets. Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Assets. Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('buyStock')
  async handleBuyStock(client: Socket, payload: { userId: number; stockId: number; quantity: number }) {
    // try {
    //   // Проверяем достаточно ли средств у пользователя
    //   const user = await this.prisma.user.findUnique({
    //     where: { id: payload.userId },
    //     include: { stocks: true },
    //   });

    //   const stock = await this.prisma.stock.findUnique({
    //     where: { id: payload.stockId },
    //   });

    //   if (!stock || stock.availableShares < payload.quantity) {
    //     client.emit('error', 'Not enough shares available');
    //     return;
    //   }

    //   const totalCost = stock.price * payload.quantity;
    //   if (user.balance < totalCost) {
    //     client.emit('error', 'Insufficient funds');
    //     return;
    //   }

    //   // Выполняем транзакцию
    //   const [updatedUser, updatedStock, userStock] = await this.prisma.$transaction([
    //     this.prisma.user.update({
    //       where: { id: payload.userId },
    //       data: { balance: { decrement: totalCost } },
    //     }),
    //     this.prisma.stock.update({
    //       where: { id: payload.stockId },
    //       data: { availableShares: { decrement: payload.quantity } },
    //     }),
    //     this.prisma.userStock.upsert({
    //       where: { userId_stockId: { userId: payload.userId, stockId: payload.stockId } },
    //       update: { quantity: { increment: payload.quantity } },
    //       create: {
    //         userId: payload.userId,
    //         stockId: payload.stockId,
    //         quantity: payload.quantity,
    //       },
    //     }),
    //   ]);

      // Отправляем обновленные данные всем клиентам
    //   const updatedData = {
    //     user: updatedUser,
    //     stock: updatedStock,
    //     userStock,
    //   };

    //   this.server.emit('stockUpdated', updatedData);
    // } catch (error) {
    //   client.emit('error', error.message);
    // }
  }

  @SubscribeMessage('buyAsset')
  async handleBuyAsset(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: покупка акции
  }

  @SubscribeMessage('sellAsset')
  async handleSellAsset(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: продажа акции    
  }

  // @SubscribeMessage('sellAsset')
  // async handleSellAsset(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: продажа акции    
  // }
}