import { type App } from "vue";
import { useNotifications } from "@/composables/useNotifications";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $notify: typeof useNotifications;
  }
}

export default {
  install: (app: App) => {
    const notifications = useNotifications();
    app.config.globalProperties.$notify = notifications;
    app.provide("notifications", notifications);
  },
};
