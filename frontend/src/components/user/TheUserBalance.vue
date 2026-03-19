<template>
  <div class="balance-chip d-flex align-center gap-2">
    <v-icon icon="mdi-wallet-outline" size="16" color="secondary" />
    <span class="balance-chip__label">Доступно:</span>
    <span class="balance-chip__value">{{ formatMoneyAmount(balance) }} ₽</span>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyAmount } from "@/utilities/helpers";

withDefaults(
  defineProps<{
    balance: number;
  }>(),
  {
    balance: 0,
  }
);
</script>

<style scoped lang="scss">
.balance-chip {
  display: inline-flex;
  background: rgba(0, 212, 170, 0.08);
  border: 1px solid rgba(0, 212, 170, 0.18);
  border-radius: 10px;
  padding: 6px 14px;
  margin-bottom: 12px;

  &__label {
    font-size: 13px;
    color: rgba(200, 208, 224, 0.5);
  }

  &__value {
    font-size: 13px;
    font-weight: 600;
    color: #00D4AA;
  }
}
</style>
