import { io, Socket } from "socket.io-client";
import { ref } from "vue";
import type { Subscription, WebSocketMessage, WebSocketPayload } from "@/api/interfaces/websocket";

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
      transports: ["websocket"],
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

    this.socket.onAny((event: string, data: unknown) => {
      this.notifySubscribers(event, data);
    });
  }

  private notifySubscribers(event: string, data: unknown) {
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
  public subscribe(event: string, callback: (data: unknown) => void): () => void {
    const subscriptionId = (++this.subscriptionIdCounter).toString();
    const subscription: Subscription = { event, callback, id: subscriptionId };

    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }

    this.subscriptions.get(event)!.push(subscription);
    console.log(`📝 Subscribed to ${event}, ID: ${subscriptionId}`);

    return () => {
      this.unsubscribe(event, subscriptionId);
    };
  }

  /**
   * Отписаться от события
   */
  public unsubscribe(event: string, subscriptionId: string): void {
    const subs = this.subscriptions.get(event);
    if (subs) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);
      if (index > -1) {
        subs.splice(index, 1);
        console.log(`🗑️ Unsubscribed from ${event}, ID: ${subscriptionId}`);
      }

      if (subs.length === 0) {
        this.subscriptions.delete(event);
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
    }
  }

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

  public sendSubscription(event: string, payload: WebSocketPayload = {}): void {
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
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    console.log(
      `🔄 Обработка очереди сообщений: ${this.messageQueue.length} сообщений`
    );

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendSubscription(message.type, message.payload);
      }
    }
  }
}
