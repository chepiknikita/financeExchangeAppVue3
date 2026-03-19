<template>
  <div class="bank-card mt-3">
    <div class="section-title mb-3">{{ isBuy ? 'Купить' : 'Продать' }}</div>

    <v-text-field
      v-model="quantity"
      density="compact"
      hide-spin-buttons
      type="number"
      label="Количество (шт)"
      variant="outlined"
      class="action-field mb-1"
      min="0"
      :color="isBuy ? 'success' : 'error'"
      @keypress="validateKey"
      @paste="handlePaste"
    />

    <v-text-field
      v-model="price"
      density="compact"
      hide-spin-buttons
      type="number"
      label="Цена за единицу"
      variant="outlined"
      class="action-field mb-3"
      :disabled="true"
      color="primary"
    >
      <template #append-inner>
        <v-icon icon="mdi-currency-rub" size="16" />
      </template>
    </v-text-field>

    <v-btn
      :color="isBuy ? 'success' : 'error'"
      variant="tonal"
      class="text-none order-btn"
      :height="44"
      :disabled="!(quantity && tradingStatus)"
      :prepend-icon="isBuy ? 'mdi-trending-up' : 'mdi-trending-down'"
      @click="emit('onOrder')"
    >
      {{ btnTitle }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { OrderType } from '@/entities/Order';

const emit = defineEmits(['onOrder']);

const props = withDefaults(
  defineProps<{
    status: OrderType;
    tradingStatus: boolean | undefined;
  }>(),
  {
    tradingStatus: false,
  }
);

const price = defineModel<number | undefined>("price", { default: undefined });
const quantity = defineModel<string>("quantity", { default: "" });

const isBuy = computed(() => props.status === OrderType.Buy);
const btnTitle = computed(() => isBuy.value ? "Подтвердить покупку" : "Подтвердить продажу");

const validateKey = (event: KeyboardEvent): void => {
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};

const handlePaste = (event: ClipboardEvent): void => {
  const pastedText = event.clipboardData?.getData('text') || '';
  if (!/^\d+$/.test(pastedText)) {
    event.preventDefault();
  }
};
</script>

<style scoped lang="scss">
.action-field {
  :deep(.v-field__outline) {
    opacity: 0.6;
  }
}

.order-btn {
  width: 100%;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
}
</style>
