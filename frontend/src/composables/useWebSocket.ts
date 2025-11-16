import { ApiFactory } from "@/api";

export function useWebSocket() {
  const websocketService = ApiFactory.createWebSocketService();
  const unsubscribeCallbacks: (() => void)[] = [];

  const subscribe = (event: string, callback: (data: any) => void): void => {
    const unsubscribe = websocketService.subscribe(event, callback);
    unsubscribeCallbacks.push(unsubscribe);
  };

  const unsubscribeAll = (): void => {
    unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    unsubscribeCallbacks.length = 0;
  };

  // Автоматическая отписка при размонтировании компонента
  onUnmounted(() => {
    unsubscribeAll();
  });

  return {
    // Подписки
    subscribe,
    unsubscribeAll,

    // Специализированные подписки
    subscribeToAssets: websocketService.subscribeToAssets.bind(websocketService),
    subscribeToPriceHistory: websocketService.subscribeToPriceHistory.bind(websocketService),
    subscribeToAllOrders: websocketService.subscribeToAllOrders.bind(websocketService),
    subscribeToUserOrders: websocketService.subscribeToUserOrders.bind(websocketService),

    // Данные (readonly для безопасности)
    assets: readonly(websocketService.assets),
    exchangeStatus: readonly(websocketService.exchangeStatus),
    priceHistory: readonly(websocketService.priceHistory),
    recentOrders: readonly(websocketService.recentOrders),

    // Статус
    isConnected: readonly(websocketService.isConnected),
    connectionError: readonly(websocketService.connectionError),

    // Вспомогательные методы
    getAssetPrice: websocketService.getAssetPrice.bind(websocketService),
    getAssetPriceHistory:
      websocketService.getAssetPriceHistory.bind(websocketService),
  };
}
