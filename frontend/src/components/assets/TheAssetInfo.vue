<template>
  <div class="asset-info-card bank-card mb-3">
    <div class="d-flex align-center gap-2 mb-2">
      <div class="live-dot" :class="tradingStatus ? 'live-dot--active' : 'live-dot--off'" />
      <span class="asset-info-name">{{ assetName }}</span>
    </div>

    <div class="d-flex align-center gap-3">
      <div
        class="asset-price"
        :class="{ 'asset-price--dim': !tradingStatus }"
      >
        {{ formatMoneyAmount(assetPrice) }}<span class="asset-price-currency"> ₽</span>
      </div>
      <span
        class="profit-badge"
        :class="{
          'profit-badge--growth': tradingStatus && assetProfit > 0,
          'profit-badge--fall': tradingStatus && assetProfit < 0,
          'profit-badge--neutral': !tradingStatus || assetProfit === 0,
        }"
      >
        <v-icon
          v-if="tradingStatus && assetProfit !== 0"
          :icon="assetProfit > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
          size="12"
        />
        <v-icon v-else-if="!tradingStatus" icon="mdi-pause" size="12" />
        {{ tradingStatus ? (assetProfit > 0 ? '+' : '') + assetProfit + '%' : 'Закрыто' }}
      </span>
    </div>

    <div class="asset-sublabel mt-1">{{ tradingStatus ? 'текущая цена' : 'торги приостановлены' }}</div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyAmount } from "@/utilities/helpers";

withDefaults(
  defineProps<{
    assetName: string;
    assetPrice: number;
    assetProfit: number;
    tradingStatus: boolean | undefined;
  }>(),
  {
    assetPrice: 0,
    assetProfit: 0,
    tradingStatus: false,
  }
);
</script>

<style scoped lang="scss">
.asset-info-name {
  font-size: 15px;
  font-weight: 600;
  color: #E8EDF5;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;

  &--active {
    background: #00C896;
    box-shadow: 0 0 0 2px rgba(0, 200, 150, 0.2);
    animation: pulse 2s infinite;
  }

  &--off {
    background: rgba(200, 208, 224, 0.25);
  }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(0, 200, 150, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(0, 200, 150, 0.08); }
}

.asset-price {
  font-size: 26px;
  font-weight: 700;
  color: #E8EDF5;
  letter-spacing: -0.02em;
  line-height: 1.1;

  &--dim {
    color: rgba(200, 208, 224, 0.3);
  }
}

.asset-price-currency {
  font-size: 16px;
  font-weight: 500;
  color: rgba(200, 208, 224, 0.45);
}

.asset-sublabel {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(200, 208, 224, 0.35);
  text-transform: uppercase;
}
</style>
