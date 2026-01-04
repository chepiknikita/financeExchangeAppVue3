<template>
  <div
    class="page-content-title"
  >
    <div class="text-h6">
      Баланс
    </div>
    <div class="text-h5">
      {{ getTotalBalace() }}
    </div>
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
import type { AssetInfo } from '@/api/intarfaces/asset';
import type { User } from '@/api/intarfaces/user';
import { formatMoneyAmount } from "@/utilities/helpers";

const props = withDefaults(
  defineProps<{
    user: User | null;
    assets: AssetInfo[];
  }>(),
  {
    user: null,
    assets: () => [],
  }
);

const userProfit = computed(() => {
  if (props.user) {
    const totalBalance = props.assets.reduce((acc, v) => acc + (v.price * v.quantity), 0) + props.user.currentBalance;
    const profit = totalBalance - props.user.initialBalance;
    return +((profit/props.user.initialBalance) * 100).toFixed(2);
  }
  return 0;
});

const getTotalBalace = () => {
  if (props.user) {
    let balance: number = +props.user.currentBalance;
    balance = balance + (props.assets.reduce((acc: number, val: AssetInfo) => acc + (val.price * val.quantity), 0) || 0);
    return formatMoneyAmount(balance.toFixed(2));
  }
  return 0;
}
</script>

<style scoped></style>