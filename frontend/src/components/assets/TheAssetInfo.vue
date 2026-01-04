<template>
  <div class="page-content-title">
    <div class="text-h6">
      {{ assetName }}
    </div>
    <div class="text-h5 text-center">
      {{ formatMoneyAmount(assetPrice) }}
    </div>
    <div
      class="text-body-1"
      :class="{ 'growth': assetProfit > 0, 'fall': assetProfit < 0, 'blocker': !traidingStatus }"
    >{{ assetProfit }}%
      (доходность)</div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyAmount } from "@/utilities/helpers";

withDefaults(
  defineProps<{
    assetName: string;
    assetPrice: number;
    assetProfit: number;
    traidingStatus: boolean | undefined;
  }>(),
  {
    assetPrice: 0,
    assetProfit: 0,
    traidingStatus: false,
  }
);
</script>

<style scoped></style>