<template>
  <div v-if="!asset">Данных нет</div>
  <div v-else class="d-flex justify-center">
    <div>В портфеле</div>
    <div class="border py-2 px-4 rounded-sm ma-2 balance-info">
      <div class="d-flex justify-space-between text-disabled">
        <div>На счете:</div>
        <div>{{ asset.quantity }} шт</div>
      </div>
      <div class="d-flex justify-space-between text-disabled">
        <div>Средняя цена:</div>
        <!-- <div>{{ asset.averageBuyPrice }} шт</div> -->
      </div>
      <div class="d-flex justify-space-between text-disabled">
        <div>Текущая цена:</div>
        <div>{{ asset.price }} шт</div>
      </div>
      <div class="d-flex justify-space-between text-disabled">
        <div>Цена открытия:</div>
        <div>{{ asset.closingPrice }} шт</div>
      </div>
      <div class="d-flex justify-space-between text-disabled">
        <div>Изменение стоимости:</div>
        <div>{{ +(asset.price - asset.closingPrice).toFixed(2) }} | {{ +(((asset.price -
          asset.closingPrice) / asset.price) * 100).toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset, AssetInfo } from '@/api/intarfaces/asset';

defineProps<{
  asset: Asset | null;
}>();
</script>

<style scoped></style>