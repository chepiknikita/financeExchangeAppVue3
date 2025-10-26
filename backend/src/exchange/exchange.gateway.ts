import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
@WebSocketGateway({ namespace: 'exchange', cors: true })
export default class ExchangeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    console.log(`Exchange. Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Exchange. Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('start')
  async handleStartExchange(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: только admin
  }

  @SubscribeMessage('end')
  async handleEndExchange(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: только admin
  }

  @SubscribeMessage('info')
  async getExchangeInfo(client: Socket, payload: { userId: number, assetId: number, quantity: number }) {
    // TODO: рассылка всем users состояния биржы
  }

  
}