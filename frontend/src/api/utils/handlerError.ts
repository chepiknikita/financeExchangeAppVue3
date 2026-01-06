import { useNotifications } from "@/composables/useNotifications";

const { error } = useNotifications();

export function handleApiError(reason: unknown): void {
  let errorMessage = "Произошла неизвестная ошибка";

  if (reason && typeof reason === "object") {
    const err = reason as any;

    if (err.response) {
      errorMessage = err.response.data.message;
      console.error("API Error Response:", {
        status: err.response.status,
        data: err.response.data,
        message: err.response.data?.message || "Нет сообщения",
      });
    } else if (err.request) {
      errorMessage = "Сетевая ошибка - ответ не получен";
      console.error("Network Error:", err.request);
    } else {
      errorMessage = err.message;
      console.error("Error:", err.message);
    }
  }
  error(errorMessage);
}
