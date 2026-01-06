import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WebSocketFacadeService } from './services/websocket-facade.service';
import { BroadcastService } from './services/broadcast.service';

@NestWebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
  transports: ['websocket', 'polling'],
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger = new Logger('WebSocketGateway');

  constructor(
    private webSocketFacade: WebSocketFacadeService,
    private broadcastService: BroadcastService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.broadcastService.setServer(server);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.webSocketFacade.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.webSocketFacade.handleDisconnect(client);
  }

  @SubscribeMessage('asset:subscribe')
  handleAssetsSubscribe(client: Socket, assetId: number) {
    this.webSocketFacade.handleSubscribe(client, 'assets', {
      type: 'asset',
      assetId,
    });
  }

  @SubscribeMessage('asset:unsubscribe')
  handleAssetsUnsubscribe(client: Socket, assetId: number[]) {
    this.webSocketFacade.handleUnsubscribe(client, 'assets', {
      type: 'asset',
      assetId,
    });
  }

  @SubscribeMessage('all-orders:subscribe')
  handleOrdersSubscribeAll(client: Socket) {
    this.webSocketFacade.handleSubscribe(client, 'orders', {
      type: 'all-orders',
    });
  }

  @SubscribeMessage('all-orders:unsubscribe')
  handleOrdersUnsubscribeAll(client: Socket) {
    this.webSocketFacade.handleUnsubscribe(client, 'orders', {
      type: 'all-orders',
    });
  }

  @SubscribeMessage('user-orders:subscribe')
  handleOrdersSubscribeUser(client: Socket, userId: number) {
    this.webSocketFacade.handleSubscribe(client, 'orders', {
      type: 'user-orders',
      userId,
    });
  }

  @SubscribeMessage('user-orders:unsubscribe')
  handleOrdersUnsubscribeUser(client: Socket, userId: number) {
    this.webSocketFacade.handleUnsubscribe(client, 'orders', {
      type: 'user-orders',
      userId,
    });
  }

  @SubscribeMessage('trading-session:subscribe')
  handleTradingSessionSubscribe(client: Socket) {
    this.webSocketFacade.handleSubscribe(client, 'trading-session', {
      type: 'trading-session',
    });
  }

  @SubscribeMessage('trading-session:unsubscribe')
  handleTradingSessionUnsubscribe(client: Socket) {
    this.webSocketFacade.handleUnsubscribe(client, 'trading-session', {
      type: 'trading-session',
    });
  }
}
