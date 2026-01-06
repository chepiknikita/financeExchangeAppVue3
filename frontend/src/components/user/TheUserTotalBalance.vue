<template>
  <div class="page-content-title">
    <div class="text-h6">Баланс</div>
    <div class="text-h5">{{ getTotalBalace() }}</div>
    <div
      class="text-body-1"
      :class="{ 'growth': userProfit > 0, 'fall': userProfit < 0 }"
    >
      {{ userProfit }}% (доходность)
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatMoneyAmount } from "@/utilities/helpers";
import type { User } from '@/entities/User';

const props = withDefaults(
  defineProps<{
    user: User | null;
  }>(),
  {
    user: null,
  }
);

const userProfit = computed(() => {
  return +(props.user?.calculateProfitPercentage().toFixed(2) ?? 0);
});

const getTotalBalace = () => {
  const total = props.user?.calculateTotalBalance().toFixed(2) ?? 0;
  return formatMoneyAmount(total);
}
</script>

<style scoped></style>