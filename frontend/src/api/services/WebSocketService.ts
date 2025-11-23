import { io, Socket } from "socket.io-client";
import { ref } from "vue";

const SOCKET_URL =
  import.meta.env.VITE_SERVER_SOCKET_URL || "http://localhost:8082/ws";

export class WebSocketService {
  private static instance: WebSocketService;

  private socket: Socket | null = null;
  private subscriptions: Map<string, Subscription[]> = new Map();
  private subscriptionIdCounter = 0;

  public isConnected = ref(false);
  public connectionError = ref<string | null>(null);
  private messageQueue: WebSocketMessage[] = [];

  // public assets = ref(new Map<number, any>());
  // public exchangeStatus = ref<any>(null);
  // public priceHistory = ref(new Map<number, any[]>());
  // public recentOrders = ref<any[]>([]);

  private constructor() {
    this.init();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private init() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    this.connect();
  }

  private connect() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      this.isConnected.value = true;
      this.connectionError.value = null;

      this.processMessageQueue();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      this.isConnected.value = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("💥 WebSocket connection error:", error);
      this.connectionError.value = error.message;
      this.isConnected.value = false;
    });

    this.socket.onAny((event: string, data: any) => {
      this.handleEvent(event, data);
    });
  }

  private handleEvent(event: string, data: any) {
    // switch (event) {
    //   case "exchange-status":
    //     this.exchangeStatus.value = data;
    //     break;
    //   case "asset-update":
    //     this.assets.value.set(data.assetId, data.asset);
    //     break;
    //   case "asset-price-update":
    //     this.updateAssetPrice(data.assetId, data.newPrice);
    //     break;
    //   case "order-created":
    //     this.addRecentOrder(data);
    //     break;
    //   default:
    //     break;
    // }

    this.notifySubscribers(event, data);
  }

  // private updateAssetPrice(assetId: number, newPrice: number) {
  //   const asset = this.assets.value.get(assetId);
  //   if (asset) {
  //     asset.currentPrice = newPrice;
  //     this.assets.value.set(assetId, { ...asset });
  //   }
  // }

  // private addRecentOrder(order: any) {
  //   this.recentOrders.value.unshift(order);
  //   if (this.recentOrders.value.length > 20) {
  //     this.recentOrders.value = this.recentOrders.value.slice(0, 20);
  //   }
  // }

  // private restoreSubscriptions() {
  //   this.subscriptions.forEach((subs, event) => {
  //     if (this.isSubscriptionEvent(event)) {
  //       this.sendSubscription(event, "subscribe");
  //     }
  //   });
  // }

  // private isSubscriptionEvent(event: string): boolean {
  //   return (
  //     event.startsWith("assets:") ||
  //     event.startsWith("orders:")
  //   );
  // }

  private notifySubscribers(event: string, data: any) {
    const subs = this.subscriptions.get(event) || [];
    subs.forEach((subscription) => {
      try {
        subscription.callback(data);
      } catch (error) {
        console.error(`Error in subscription handler for ${event}:`, error);
      }
    });
  }

  /**
   * Подписаться на событие
   * @returns Функция для отписки
   */
  public subscribe(event: string, callback: (data: any) => void): () => void {
    const subscriptionId = (++this.subscriptionIdCounter).toString();
    const subscription: Subscription = { event, callback, id: subscriptionId };

    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }

    this.subscriptions.get(event)!.push(subscription);

    // Автоматически отправляем запрос на подписку если это специальное событие
    // if (this.isSubscriptionEvent(event)) {
    //   this.sendSubscription(event, "subscribe");
    // }

    console.log(`📝 Subscribed to ${event}, ID: ${subscriptionId}`);

    // Возвращаем функцию для отписки
    return () => {
      this.unsubscribe(event, subscriptionId);
    };
  }

  /**
   * Отписаться от события
   */
  public unsubscribe(event: string, subscriptionId: string): void {
    const subs = this.subscriptions.get(event);
    console.log('UNSUBS');
    if (subs) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);
      if (index > -1) {
        subs.splice(index, 1);
        console.log(`🗑️ Unsubscribed from ${event}, ID: ${subscriptionId}`);
      }

      if (subs.length === 0) {
        this.subscriptions.delete(event);
        // Отправляем запрос на отписку если это специальное событие
        // if (this.isSubscriptionEvent(event)) {
        //   this.sendSubscription(event, "unsubscribe");
        // }
      }
    }
  }

  /**
   * Отписаться от всех событий определенного типа
   */
  public unsubscribeAll(event: string): void {
    const subs = this.subscriptions.get(event);
    if (subs) {
      console.log(
        `🗑️ Unsubscribed all from ${event} (${subs.length} subscriptions)`
      );
      this.subscriptions.delete(event);

      // if (this.isSubscriptionEvent(event)) {
      //   this.sendSubscription(event, "unsubscribe");
      // }
    }
  }

  // /**
  //  * Подписаться на обновления акций
  //  * @returns Функция для отписки
  //  */
  // public subscribeToAssets(assetIds: number[]): () => void {
  //   const event = "assets:subscribe";
  //   this.socket?.emit(event, assetIds);

  //   // Создаем подписку на обновления этих акций
  //   return this.subscribe("asset-update", (data) => {
  //     if (assetIds.includes(data.assetId)) {
  //       // Данные уже автоматически обновляются в assets Map
  //     }
  //   });
  // }

  // /**
  //  * Подписаться на историю цен акции
  //  * @returns Функция для отписки
  //  */
  // public subscribeTo(assetId: number): () => void {
  //   const event = "price-history:subscribe";
  //   this.socket?.emit(event, assetId);

  //   return this.subscribe("price-history-update", (data) => {
  //     if (data.assetId === assetId) {
  //       // Данные уже автоматически обновляются в priceHistory Map
  //     }
  //   });
  // }

  // /**
  //  * Подписаться на все ордера
  //  * @returns Функция для отписки
  //  */
  // public subscribeToAllOrders(): () => void {
  //   const event = "orders:subscribe-all";
  //   this.socket?.emit(event);

  //   return this.subscribe("order-created", (data) => {
  //     // Данные уже автоматически добавляются в recentOrders
  //   });
  // }

  // /**
  //  * Подписаться на ордера пользователя
  //  * @returns Функция для отписки
  //  */
  // public subscribeToUserOrders(userId: number): () => void {
  //   const event = "orders:subscribe-user";
  //   this.socket?.emit(event, userId);

  //   return this.subscribe("order-created", (data) => {
  //     if (data.userId === userId) {
  //       // Данные уже автоматически добавляются в recentOrders
  //     }
  //   });
  // }

  // /**
  //  * Получить текущую цену акции
  //  */
  // public getAssetPrice(assetId: number): number | null {
  //   return this.assets.value.get(assetId)?.currentPrice || null;
  // }

  // /**
  //  * Получить историю цен акции
  //  */
  // public getAssetPriceHistory(assetId: number): any[] {
  //   return this.priceHistory.value.get(assetId) || [];
  // }

  /**
   * Отключиться от WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.subscriptions.clear();
    this.isConnected.value = false;
  }

  public sendSubscription(event: string, payload: any = {}): void {
    const message = {
      type: event,
      payload,
    };

    if (!this.socket || !this.isConnected.value) {
      console.log(`📨 Сообщение в очередь (не подключен): ${event}`, payload);
      this.messageQueue.push(message);
      return;
    }

     try {
      console.log(`📤 Отправка сообщения: ${event}`, payload);
      this.socket.emit(event, payload);
    } catch (error) {
      console.error(`❌ Ошибка отправки сообщения ${event}:`, error);
      // Добавляем в очередь для повторной отправки
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    console.log(`🔄 Обработка очереди сообщений: ${this.messageQueue.length} сообщений`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message.type, message.payload);
      }
    }
  }
}
