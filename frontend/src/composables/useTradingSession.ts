import { ApiFactory } from "@/api";
import { TradingSession } from "@/entities/TradingSession";
import { useWebSocket } from "./useWebSocket";
import { useNotifications } from "./useNotifications";

export default function useTradingSession() {
  const tradingSessionService = ApiFactory.createTradingSessionService();
  const { subscribe } = useWebSocket();
  const { info } = useNotifications();
  const session = ref<TradingSession | null>(null);

  function initSubscription() {
    subscribe("trading-session", {}, "trading-session-status", (data) => {
      console.log("Прослушивание канала - trading-session-status", data);
      if (data) {
        session.value?.update(data);
        info(
          `Торги ${data.isTrading ? "запущены" : "остановлены"}`,
          "Информация"
        );
      }
    });
  }

  async function loadTradingSession() {
    const loadedSession = await tradingSessionService.getStatus();
    if (loadedSession) {
      session.value = new TradingSession(loadedSession);
    }
    initSubscription();
  }

  async function updateStatus(timestamp: {
    date: number[];
    isTrading: boolean;
  }) {
    await tradingSessionService.updateStatus(
      TradingSession.fromTimestampObject(timestamp)
    );
  }

  return {
    session,
    loadTradingSession,
    updateStatus,
  };
}
