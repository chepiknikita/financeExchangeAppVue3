import {
  WebSocketGateway,
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger = new Logger('WebSocketGateway');

  constructor(
    private webSocketFacade: WebSocketFacadeService,
    private broadcastService: BroadcastService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.broadcastService.setServer(server);
    
    // Start background services
    this.startBackgroundBroadcasts();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.webSocketFacade.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.webSocketFacade.handleDisconnect(client);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { service: string; data: any }) {
    this.webSocketFacade.handleSubscribe(client, payload.service, payload.data);
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { service: string; data: any }) {
    this.webSocketFacade.handleUnsubscribe(client, payload.service, payload.data);
  }

  @SubscribeMessage('stocks:subscribe')
  handleStocksSubscribe(client: Socket, stockIds: number[]) {
    this.webSocketFacade.handleSubscribe(client, 'stocks', {
      type: 'stocks',
      stockIds,
    });
  }

  @SubscribeMessage('stocks:unsubscribe')
  handleStocksUnsubscribe(client: Socket, stockIds: number[]) {
    this.webSocketFacade.handleUnsubscribe(client, 'stocks', {
      type: 'stocks',
      stockIds,
    });
  }

  @SubscribeMessage('price-history:subscribe')
  handlePriceHistorySubscribe(client: Socket, stockId: number) {
    this.webSocketFacade.handleSubscribe(client, 'stocks', {
      type: 'price-history',
      stockIds: [stockId],
    });
  }

  @SubscribeMessage('price-history:unsubscribe')
  handlePriceHistoryUnsubscribe(client: Socket, stockId: number) {
    this.webSocketFacade.handleUnsubscribe(client, 'stocks', {
      type: 'price-history',
      stockIds: [stockId],
    });
  }

  @SubscribeMessage('orders:subscribe-all')
  handleOrdersSubscribeAll(client: Socket) {
    this.webSocketFacade.handleSubscribe(client, 'orders', {
      type: 'all-orders',
    });
  }

  @SubscribeMessage('orders:unsubscribe-all')
  handleOrdersUnsubscribeAll(client: Socket) {
    this.webSocketFacade.handleUnsubscribe(client, 'orders', {
      type: 'all-orders',
    });
  }

  @SubscribeMessage('orders:subscribe-user')
  handleOrdersSubscribeUser(client: Socket, userId: number) {
    this.webSocketFacade.handleSubscribe(client, 'orders', {
      type: 'user-orders',
      userId,
    });
  }

  @SubscribeMessage('orders:unsubscribe-user')
  handleOrdersUnsubscribeUser(client: Socket, userId: number) {
    this.webSocketFacade.handleUnsubscribe(client, 'orders', {
      type: 'user-orders',
      userId,
    });
  }

  private startBackgroundBroadcasts() {
    // This would be triggered by external services/events
    // For example, when stock prices update, orders are created, etc.
    this.logger.log('Background broadcast services started');
  }
}