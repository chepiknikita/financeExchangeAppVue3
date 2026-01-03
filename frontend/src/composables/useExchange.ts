import type { ExchangeInfo } from "@/api/intarfaces/exchange";
import { useWebSocket } from "@/composables/useWebSocket";

export default function useExchange() {
  const { subscribe } = useWebSocket();

  const updatedExchange = ref<ExchangeInfo | null>(null);

  subscribe(null, null, "exchange-status", (data) => {
    if (data?.spec?.args?.data) {
      updatedExchange.value = data.spec.args.data;
    }
  });

  return {
    updatedExchange,
  };
}
