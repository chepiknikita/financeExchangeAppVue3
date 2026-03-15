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
      :asset-price="asset.price"
      :asset-profit="+assetProfit"
      :trading-status="session?.isTrading"
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
import useAssets from '@/composables/useAssets';
import useTradingSession from '@/composables/useTradingSession';
import { Asset } from "@/entities/Asset";

const loading = ref(true);
const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const { selectAsset, updatedAsset, unsubscribeAll } = useAssets();
const { loadTradingSession, session } = useTradingSession();

const assetId = +router.currentRoute.value.params.id;
const asset = ref<Asset | null>(null);

const assetProfit = computed(() => {
  return asset.value?.getProfitPercent().toFixed(2) ?? 0;
});

onMounted(async () => {
  await loadTradingSession();
  if (assetId) {
    const loadedAsset = await assetService.getById(assetId);
    if (loadedAsset) {
      asset.value = new Asset(loadedAsset);
      asset.value.setHistory(await assetService.getAssetHistory(assetId));
    }
    selectAsset(assetId);
  }
  loading.value = false;
});

watch(updatedAsset, (v) => {
  if (v) {
    asset.value?.updatePrice(v);
  }
});

watch(() => session.value?.isTrading, (isTrading) => {
  if (isTrading === false) {
    unsubscribeAll();
  }
});

const onSell = () => {
  router.push({
    name: "/user/action",
    query: { mode: OrderType.Sell, id: assetId },
  });
};

const onBuy = () => {
  router.push({
    name: "/user/action",
    query: { mode: OrderType.Buy, id: assetId },
  });
};
</script>

<style scoped></style>
