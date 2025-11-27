<template>
  <!-- <v-skeleton-loader
    v-if="loading"
    :width="600"
    type="list-item-three-line"
  ></v-skeleton-loader> -->
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
  return +(props.assets.reduce((acc, v) => acc + ((v.totalProfit/(v.price * v.quantity)) * 100), 0)).toFixed(2);
});

const getTotalBalace = () => {
  if (props.user) {
    let balance: number = +props.user.balance;
    balance = balance + (props.assets.reduce((acc: number, val: AssetInfo) => acc + (val.price * val.quantity), 0) || 0);
    return formatMoneyAmount(balance.toFixed(2));
  }
  return 0;
}
</script>

<style scoped></style>