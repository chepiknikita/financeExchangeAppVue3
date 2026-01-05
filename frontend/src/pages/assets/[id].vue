<template>
  <div
    v-if="loading"
    class="d-flex justify-center align-center flex-column mt-8"
  >
    <v-skeleton-loader
      type="list-item-three-line"
      :width="300"
      class="my-2"
    />
    <v-skeleton-loader
      type="image"
      :width="600"
    />
    <v-skeleton-loader
      type="list-item-three-line"
      :width="400"
      class="my-2"
    />
  </div>
  <div
    v-else-if="asset"
    class="page-wrapper overflow-hidden position-relative"
  >
    <the-asset-info
      :asset-name="asset.name"
      :asset-price="assetPrice"
      :asset-profit="+assetProfit"
      :traiding-status="marketState?.isTrading"
    />
    <the-asset-chart :priceHistory="asset.history" />
    <the-user-asset :asset="asset" />
    <the-asset-actions
      @buy="onBuy"
      @sell="onSell"
    />
  </div>
  <div v-else class="text-center my-2">Такого актива не существует</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import { OrderType } from "@/entities/Order";
import TheAssetInfo from "@/components/assets/TheAssetInfo.vue";
import TheAssetChart from "@/components/assets/TheAssetChart.vue";
import TheUserAsset from "@/components/assets/TheUserAsset.vue";
import useTradingSession from "@/composables/useTradingSession";
import userAssets from '@/composables/useAssets';
import TradingSession from "@/entities/TradingSession";
import { Asset, type PriceHistory } from "@/entities/Asset";

const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const tradingSessionService = ApiFactory.createTradingSessionService();
const { updatedTradingSession } = useTradingSession();
const { selectAsset, selectedAssetId, assetPrice, history } = userAssets();
const loading = ref(true);

selectedAssetId.value = router.currentRoute.value.params.id;
const marketState = ref<TradingSession | null>(null);
const asset = ref<Asset | null>(null);

const assetProfit = computed(() => {
  return asset.value?.getProfitPercent().toFixed(2) ?? 0;
});

onMounted(async () => {
  const loadedMarket = await tradingSessionService.getStatus();
  if (loadedMarket) {
    marketState.value = new TradingSession(loadedMarket);
  }
  if (selectedAssetId.value) {
    const loadedAsset = await assetService.getById(selectedAssetId.value);
    if (loadedAsset) {
      asset.value = new Asset(loadedAsset);
      asset.value.setHistory(await assetService.getAssetHistory(selectedAssetId.value))
    }
    assetPrice.value = asset.value?.price ?? 0;
    selectAsset(selectedAssetId.value);
  }
  loading.value = false;
});

watch(updatedTradingSession, (v) => {
  marketState.value = v;
});

watch(history, (v) => {
  if (v) {
    asset.value?.history.unshift(v);
  }
})

const onSell = () => {
  router.push({
    name: "/user/action",
    query: { mode: OrderType.Sell, id: selectedAssetId.value },
  });
};

const onBuy = () => {
  router.push({
    name: "/user/action",
    query: { mode: OrderType.Buy, id: selectedAssetId.value },
  });
};
</script>

<style scoped></style>
