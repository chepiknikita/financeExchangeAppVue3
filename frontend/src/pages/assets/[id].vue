<template>
  <div
    v-if="asset"
    class="page-wrapper overflow-hidden position-relative"
  >
    <div class="page-content-title">
      <div class="text-h6">
        {{ asset.name }}
      </div>
      <div class="text-h5 text-center">
        {{ formatMoneyAmount(assetPrice) }}
      </div>
      <div
        class="text-body-1"
        :class="{ 'growth': +assetProfit > 0, 'fall': +assetProfit < 0 }"
      >{{ assetProfit }}% (доходность)</div>
    </div>
    <div class="page-content-body h-100 overflow-hidden">
      <div class="text-body-1 text-disabled text-center mt-2">
        {{ exchangeMessage }}
      </div>
      <div class="text-body-1 mx-4">График изменения цены</div>
      <div class="h-100 w-100 px-4 pb-6">
        <LineChart :priceHistory="priceHistory"></LineChart>
      </div>
    </div>
    <div class="page-bottom-actions">
      <div class="d-flex justify-center">
        <v-btn
          variant="tonal"
          color="#ccc"
          class="text-none my-1 mx-2"
          @click="onSell"
        >
          Продать
        </v-btn>
        <v-btn
          variant="tonal"
          class="text-none my-1 mx-2"
          @click="onBuy"
        >
          Купить
        </v-btn>
      </div>
    </div>
  </div>
  <div v-else class="text-center my-2">Такого актива не существует</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import LineChart from "@/components/charts/LineChart.vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import type { Asset, PriceHistory } from "@/api/intarfaces/asset";
import { formatMoneyAmount } from "@/utilities/helpers";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";
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

const exchangeMessage = computed(() => {
  if (exchangeStatus.value?.isTrading) {
    const dateEnd = exchangeStatus.value?.end
      ? new Date(exchangeStatus.value.end).toLocaleString()
      : new Date().toDateString();
    return `Торги продляться до ${dateEnd}`;
  }
  return 'Биржа временно закрыта';
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
