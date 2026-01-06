<template>
  <div class="app-notifications">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="notificationVisible[notification.id]"
      class="notification-item"
      location="bottom right"
      multi-line
      :timeout="notification.duration"
      :color="snackbarColor(notification.type)"
      @update:model-value="onSnackbarClose(notification.id)"
    >
      <div class="notification-content">
        <div v-if="notification.title">{{ notification.title }}</div>
        <div>{{ notification.message }}</div>
      </div>

      <template v-slot:actions>
        <v-btn
          icon
          variant="text"
          color="white"
          size="small"
          :ripple="false"
          @click="removeNotification(notification.id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNotifications } from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();

const notificationVisible = ref<Record<number, boolean>>({});

watch(notifications, (value) => {  
  value.forEach((notification) => {
    if (!notificationVisible.value[notification.id]) {
      notificationVisible.value[notification.id] = true;
    }
  });
}, { deep: true });

const snackbarColor = (type: string) => {
  const colors = {
    error: 'error',
    info: 'info',
  };
  return colors[type as keyof typeof colors] || 'info';
};

const onSnackbarClose = (id: number) => {
  removeNotification(id);
  delete notificationVisible.value[id];
};
</script>

<style scoped></style>