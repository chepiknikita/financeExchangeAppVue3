<template>
  <div class="asset-actions" :style="{ bottom: mobile ? '60px' : '44px' }">
    <div class="asset-actions__inner d-flex gap-3">
      <v-btn
        variant="tonal"
        color="error"
        class="text-none action-btn"
        :height="44"
        prepend-icon="mdi-trending-down"
        @click="emit('sell')"
      >
        Продать
      </v-btn>
      <v-btn
        variant="tonal"
        color="success"
        class="text-none action-btn"
        :height="44"
        prepend-icon="mdi-trending-up"
        @click="emit('buy')"
      >
        Купить
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const emit = defineEmits(['sell', 'buy']);
</script>

<style scoped lang="scss">
.asset-actions {
  width: 100%;
  position: fixed;
  left: 0;
  padding: 10px 16px;
  background: rgba(11, 15, 26, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 100;
}

.asset-actions__inner {
  max-width: 400px;
  margin: 0 auto;
}

.action-btn {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.01em;
}
</style>
