import { useWebSocket } from "@/composables/useWebSocket";
import type TradingSession from "@/entities/TradingSession";

export default function useTradingSession() {
  const { subscribe } = useWebSocket();

  const updatedTradingSession = ref<TradingSession | null>(null);

  subscribe(null, null, "trading-session-status", (data) => {
    if (data?.spec?.args?.data) {
      updatedTradingSession.value = data.spec.args.data;
    }
  });

  return {
    updatedTradingSession,
  };
}
