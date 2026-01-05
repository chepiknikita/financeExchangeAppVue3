<template>
  <div>
    <div class="text-body-1">
      <div class="text-center my-2">
        Доступные средства: {{ formatMoneyAmount(balance) }}
      </div>
      <div class="border py-2 px-4 rounded-sm ma-2 balance-info">
        <div class="d-flex justify-space-between text-disabled">
          <div>Есть на бирже:</div>
          <div>{{ availableQuantity }} шт</div>
        </div>
        <div class="d-flex justify-space-between text-disabled">
          <div>Есть в портфеле:</div>
          <div>{{ quantityAssetExits }} шт</div>
        </div>
        <div class="d-flex justify-space-between text-disabled">
          <div>Работа биржы до:</div>
          <div>{{ closeTime }}</div>
        </div>
      </div>
    </div>
    <slot />
    <div v-if="result">
      <div class="pt-6 px-4 balance-info">
        <div>Итого: {{ formatMoneyAmount(result) }}</div>
        <div class="d-flex justify-space-between text-disabled">
          <div>Комисия биржы:</div>
          <div>Отсутствует</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatMoneyAmount } from "@/utilities/helpers";
//TODO styling - cashe
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

<style scoped>
.balance-info {
  width: 380px;
}
</style>