import { ApiFactory } from "@/api";
import type { WebSocketPayload } from "@/api/interfaces/websocket";

export function useWebSocket() {
  const websocketService = ApiFactory.createWebSocketService();
  const unsubscribeCallbacks: (() => void)[] = [];
  const subscribers: Map<string, WebSocketPayload> = new Map();
  type Event = "asset" | "trading-session" | "order" | null;

  const subscribe = (
    event: Event,
    payload: WebSocketPayload,
    channel: string,
    callback: (data: unknown) => void
  ): void => {
    if (event && !subscribers.has(event)) {
      subscribers.set(event, payload);
      websocketService.sendSubscription(`${event}:subscribe`, payload);
    }
    const unsubscribe = websocketService.subscribe(channel, callback);
    unsubscribeCallbacks.push(unsubscribe);
  };

  const unsubscribeAll = (): void => {
    Array.from(subscribers.entries()).forEach(([key, val]: [string, WebSocketPayload]) => {
      websocketService.sendSubscription(`${key}:unsubscribe`, val);
    });
    unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    unsubscribeCallbacks.length = 0;
  };

  onUnmounted(() => {
    unsubscribeAll();
  });

  return {
    subscribe,
    unsubscribeAll,
    isConnected: readonly(websocketService.isConnected),
    connectionError: readonly(websocketService.connectionError),
  };
}
