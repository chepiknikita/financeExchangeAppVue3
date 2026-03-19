import { isAxiosError } from "axios";
import { useNotifications } from "@/composables/useNotifications";

const { error } = useNotifications();

export function handleApiError(reason: unknown): void {
  let errorMessage = "Произошла неизвестная ошибка";

  if (isAxiosError(reason)) {
    if (reason.response) {
      errorMessage = reason.response.data?.message ?? "Нет сообщения";
      console.error("API Error Response:", {
        status: reason.response.status,
        data: reason.response.data,
        message: errorMessage,
      });
    } else if (reason.request) {
      errorMessage = "Сетевая ошибка - ответ не получен";
      console.error("Network Error:", reason.request);
    } else {
      errorMessage = reason.message;
      console.error("Error:", reason.message);
    }
  }
  error(errorMessage);
}
