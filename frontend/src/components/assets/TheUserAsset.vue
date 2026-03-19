<template>
  <div v-if="!asset" />
  <div v-else class="bank-card portfolio-card mb-4">
    <div class="section-title mb-3">В портфеле</div>

    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-item__label">На счёте</div>
        <div class="metric-item__value">{{ asset.quantity }} шт</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">Текущая цена</div>
        <div class="metric-item__value">{{ asset.price }} ₽</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">Цена открытия</div>
        <div class="metric-item__value">{{ asset.closingPrice }} ₽</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">Изменение</div>
        <div
          class="metric-item__value"
          :class="{
            'growth': asset.getProfit() > 0,
            'fall': asset.getProfit() < 0,
          }"
        >
          {{ +asset.getProfit().toFixed(2) }} ₽
          <span class="metric-pct">({{ +asset.getProfitPercent().toFixed(2) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '@/entities/Asset';

defineProps<{
  asset: Asset | null;
}>();
</script>

<style scoped lang="scss">
.portfolio-card {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.metric-pct {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.7;
}
</style>
