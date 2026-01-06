import { reactive } from "vue";

export interface Notification {
  id: number;
  type: "error" | "info";
  title?: string;
  message: string;
  duration?: number;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
  nextId: number;
}

const state = reactive<NotificationState>({
  notifications: [],
  nextId: 1,
});

export function useNotifications() {
  const notify = (notification: Omit<Notification, "id">): number => {
    const id = state.nextId++;
    const fullNotification: Notification = {
      id,
      duration: 6000,
      ...notification,
    };

    state.notifications.push(fullNotification);

    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, fullNotification.duration);
    }

    return id;
  };

  const error = (message: string, title?: string) => {
    return notify({
      type: "error",
      title: title || "Ошибка",
      message,
      icon: "mdi-alert-circle",
      duration: 8000,
    });
  };

  const info = (message: string, title?: string) => {
    return notify({
      type: "info",
      title,
      message,
      icon: "mdi-information",
    });
  };

  const removeNotification = (id: number) => {
    const index = state.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      state.notifications.splice(index, 1);
    }
  };

  const clearAll = () => {
    state.notifications = [];
  };

  return {
    notifications: state.notifications,
    notify,
    error,
    info,
    removeNotification,
    clearAll,
  };
}
