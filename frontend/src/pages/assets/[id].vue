<template>
  <div
    v-if="asset"
    class="page-wrapper overflow-hidden position-relative"
  >
    <the-asset-info
      :asset-name="asset.name"
      :asset-price="assetPrice"
      :asset-profit="+assetProfit"
      :exchange-status="exchangeStatus?.isTrading"
    />
    <the-asset-chart :priceHistory="priceHistory" />
    <the-user-asset :asset="asset"/>
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
import type { Asset, PriceHistory } from "@/api/intarfaces/asset";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";
import TheAssetInfo from "@/components/assets/TheAssetInfo.vue";
import TheAssetChart from "@/components/assets/TheAssetChart.vue";
import TheUserAsset from "@/components/assets/TheUserAsset.vue";
import useExchange from "@/composables/useExchange";
import userAssets from '@/composables/useAssets';

const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const exchangeService = ApiFactory.createExchangeService();
const { updatedExchange } = useExchange();
const { selectAsset, selectedAssetId, assetPrice, history } = userAssets();

selectedAssetId.value = router.currentRoute.value.params.id;
const exchangeStatus = ref<ExchangeInfo | null>(null);
const asset = ref<Asset | null>(null);
const priceHistory = ref<PriceHistory[]>([]);

const assetProfit = computed(() => {
  if (asset.value) {
    return (((asset.value?.price - asset.value?.closingPrice)/asset.value?.price) * 100).toFixed(2);
  }
  return 0;
});

onMounted(async () => {
  exchangeStatus.value = await exchangeService.getStatus();
  if (selectedAssetId.value) {
    asset.value = await assetService.getById(selectedAssetId.value);
    priceHistory.value = await assetService.getAssetHistory(selectedAssetId.value);
    assetPrice.value = asset.value?.price ?? 0;
    selectAsset(selectedAssetId.value);
  }
});

watch(updatedExchange, (v) => {
  exchangeStatus.value = v;
});

watch(history, (v) => {
  if (v) {
    priceHistory.value.unshift(v);
  }
})

const onSell = () => {
  router.push({
    name: "/user/action",
    query: { mode: "SELL", id: selectedAssetId.value },
  });
};

const onBuy = () => {
  router.push({
    name: "/user/action",
    query: { mode: "BUY", id: selectedAssetId.value },
  });
};
</script>

<style scoped></style>
