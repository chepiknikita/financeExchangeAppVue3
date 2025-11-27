<template>
  <div class="asset-actions">
    <div class="d-flex justify-center">
      <v-btn
        variant="tonal"
        color="#ccc"
        class="text-none my-1 mx-2"
        @click="emit('sell')"
      >
        Продать
      </v-btn>
      <v-btn
        variant="tonal"
        class="text-none my-1 mx-2"
        @click="emit('buy')"
      >
        Купить
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['sell', 'buy'])
</script>

<style scoped lang="scss">
.asset-actions {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 40px;
  padding: 8px 0;
  background: #121212;
}
</style>