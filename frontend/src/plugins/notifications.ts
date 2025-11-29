import { type App } from 'vue';
import { useNotifications } from '@/composables/useNotifications';

// Создаем глобальные свойства для TypeScript
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $notify: typeof useNotifications;
  }
}

export default {
  install: (app: App) => {
    const notifications = useNotifications();
    
    // Делаем доступным через this.$notify в компонентах
    app.config.globalProperties.$notify = notifications;
    
    // Делаем доступным через provide/inject
    app.provide('notifications', notifications);
  },
};