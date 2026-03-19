<template>
  <div>
    <div class="bank-card mb-2">
      <div class="section-title mb-2">Детали сделки</div>

      <div class="d-flex align-center justify-space-between mb-2">
        <span class="info-label">Доступные средства</span>
        <span class="info-value accent-value">{{ formatMoneyAmount(balance) }} ₽</span>
      </div>

      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-item__label">На бирже</div>
          <div class="metric-item__value">{{ availableQuantity }} шт</div>
        </div>
        <div class="metric-item">
          <div class="metric-item__label">В портфеле</div>
          <div class="metric-item__value">{{ quantityAssetExits }} шт</div>
        </div>
        <div class="metric-item" style="grid-column: span 2">
          <div class="metric-item__label">Биржа работает до</div>
          <div class="metric-item__value">{{ closeTime }}</div>
        </div>
      </div>
    </div>

    <slot />

    <div v-if="result" class="bank-card bank-card--sm mt-3">
      <div class="d-flex justify-space-between align-center">
        <span class="info-label">Итого к оплате</span>
        <span class="total-value">{{ formatMoneyAmount(result) }} ₽</span>
      </div>
      <div class="d-flex justify-space-between align-center mt-2">
        <span class="info-label">Комиссия биржи</span>
        <span class="commission-value">Отсутствует</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatMoneyAmount } from "@/utilities/helpers";

const props = withDefaults(
  defineProps<{
    balance: number;
    availableQuantity: number;
    quantityAssetExits: number;
    result: number | null;
    tradingEndTime?: string;
  }>(),
  {
    balance: 0,
    result: null,
  }
);

const closeTime = computed(() => {
  return props.tradingEndTime
    ? new Date(props.tradingEndTime).toLocaleString()
    : new Date().toDateString();
});
</script>

<style scoped lang="scss">
.info-label {
  font-size: 13px;
  color: rgba(200, 208, 224, 0.5);
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #E8EDF5;
}

.accent-value {
  color: #00D4AA;
}

.total-value {
  font-size: 16px;
  font-weight: 700;
  color: #4A9FFF;
}

.commission-value {
  font-size: 12px;
  color: rgba(200, 208, 224, 0.4);
}
</style>
