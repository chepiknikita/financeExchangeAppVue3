import { ApiFactory } from "@/api";

export function useWebSocket() {
  const websocketService = ApiFactory.createWebSocketService();
  const unsubscribeCallbacks: (() => void)[] = [];
  const subscribers: Map<string, any> = new Map();
  type Event = "asset" | "exchange" | "order" | null;

  const subscribe = (
    event: Event,
    payload: any,
    channel: string,
    callback: (data: any) => void
  ): void => {
    if (event && !subscribers.has(event)) {
      subscribers.set(event, payload);
      websocketService.sendSubscription(`${event}:subscribe`, payload);
    }
    const unsubscribe = websocketService.subscribe(channel, callback);
    unsubscribeCallbacks.push(unsubscribe);
  };

  const unsubscribeAll = (): void => {
    Array.from(subscribers.entries()).forEach(([key, val]: [string, any]) => {
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
