<template>
  <div class="page-content-body h-100 overflow-hidden">
    <div class="text-body-1 mx-4">График изменения цены</div>
    <div class="h-100 w-100 px-4 pb-6">
      <line-chart :priceHistory="priceHistory"></line-chart>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceHistory } from "@/api/intarfaces/asset";
import LineChart from "@/components/charts/LineChart.vue";

withDefaults(
  defineProps<{
    priceHistory: PriceHistory[];
  }>(),
  {
    priceHistory: () => [],
  }
);

//TODO добавить блок когда данные отсутствуют
</script>

<style scoped></style>