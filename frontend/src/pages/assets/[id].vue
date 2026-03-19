<template>
  <div v-if="loading" class="page-wrapper">
    <div class="sk-card mb-3">
      <div class="d-flex align-center gap-2 mb-2">
        <div class="sk" style="width: 7px; height: 7px; border-radius: 50%" />
        <div class="sk sk-line" style="width: 130px; height: 13px" />
      </div>
      <div class="d-flex align-center gap-3">
        <div class="sk sk-line" style="width: 120px; height: 26px" />
        <div class="sk sk-line" style="width: 60px; height: 20px; border-radius: 20px" />
      </div>
      <div class="sk sk-line mt-2" style="width: 70px; height: 8px" />
    </div>
    <div
      class="sk-card mb-3"
      style="height: 200px; display: flex; align-items: flex-end; gap: 3px; padding-bottom: 12px"
    >
      <div
        v-for="i in 18"
        :key="i"
        class="sk"
        :style="`flex:1;height:${30 + ((i * 37 + 11) % 55)}%;border-radius:3px 3px 0 0`"
      />
    </div>
    <div class="sk-card mb-4">
      <div class="sk sk-line mb-3" style="width: 70px; height: 9px" />
      <div class="sk-metrics-grid">
        <div v-for="i in 4" :key="i" class="sk-metric-cell">
          <div class="sk sk-line mb-1" style="height: 8px; width: 60%" />
          <div class="sk sk-line" style="height: 12px; width: 80%" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="asset" class="page-wrapper overflow-hidden position-relative">
    <the-asset-info
      :asset-name="asset.name"
      :asset-price="asset.price"
      :asset-profit="+assetProfit"
      :trading-status="session?.isTrading"
    />

    <div class="chart-card bank-card mb-3">
      <div class="chart-title text-body-1 mb-2">График изменения цены</div>
      <line-chart :price-history="asset.history" />
    </div>

    <the-user-asset :asset="asset" />
    <the-asset-actions @buy="onBuy" @sell="onSell" />
  </div>

  <div v-else class="text-center my-2">Такого актива не существует</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import { OrderType } from "@/entities/Order";
import TheAssetInfo from "@/components/assets/TheAssetInfo.vue";
import TheUserAsset from "@/components/assets/TheUserAsset.vue";
import LineChart from "@/components/charts/LineChart.vue";
import useAssets from "@/composables/useAssets";
import useTradingSession from "@/composables/useTradingSession";
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
  if (v) asset.value?.updatePrice(v);
});

watch(
  () => session.value?.isTrading,
  (isTrading) => {
    if (isTrading === false) unsubscribeAll();
  },
);

const onSell = () => {
  router.push({ name: "/user/action", query: { mode: OrderType.Sell, id: assetId } });
};

const onBuy = () => {
  router.push({ name: "/user/action", query: { mode: OrderType.Buy, id: assetId } });
};
</script>

<style scoped lang="scss">
.chart-title {
  color: rgba(200, 208, 224, 0.6);
  font-size: 13px;
}
</style>
