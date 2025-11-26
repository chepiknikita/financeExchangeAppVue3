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
      :class="{ 'growth': assetProfit > 0, 'fall': assetProfit < 0 }"
    >{{ assetProfit }}%
      (доходность)</div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyAmount } from "@/utilities/helpers";

//TODO - добавить лоадеры, когда данные не загрузились
//TODO - exchangeStatus - убрать цвета доходности, сделать нейтральный серый цвет
withDefaults(
  defineProps<{
    assetName: string;
    assetPrice: number;
    assetProfit: number;
    exchangeStatus: boolean;
  }>(),
  {
    assetPrice: 0,
    assetProfit: 0,
    exchangeStatus: false,
  }
);
</script>

<style scoped></style>