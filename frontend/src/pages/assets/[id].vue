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
        {{ formatMoneyAmount(asset.price) }}
      </div>
      <div class="text-body-1 growth">{{ assetProfit }}% (доходность)</div>
    </div>
    <div class="page-content-body h-100 overflow-hidden">
      <div class="text-body-1 text-disabled text-center mt-2">Торги продляться до {{ endTrading }}</div>
      <div class="text-body-1 mx-4">График изменения цены</div>
      <div class="h-100 w-100 px-4 pb-6">
        <LineChart></LineChart>
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
        <v-btn variant="tonal" class="text-none my-1 mx-2" @click="onBuy">
          Купить
        </v-btn>
      </div>
    </div>
  </div>
  <div v-else class="text-center my-2">Такого актива не существует</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import LineChart from "@/components/charts/LineChart.vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import type { Asset } from "@/api/intarfaces/asset";
import { formatMoneyAmount } from "@/utilities/helpers";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";

const router = useRouter();
const assetId = router.currentRoute.value.params.id;
const assetService = ApiFactory.createAssetsService();
const exchangeService = ApiFactory.createExchangeService();
const exchangeStatus = ref<ExchangeInfo | null>(null);

const asset = ref<Asset | null>(null);

const assetProfit = computed(() => 0);

onMounted(async () => {
  asset.value = await assetService.getById(assetId);
  exchangeStatus.value = await exchangeService.getStatus();
});

const endTrading = computed(() => {
  exchangeStatus.value?.end
  return exchangeStatus.value?.end ? new Date(exchangeStatus.value?.end).toLocaleString() : new Date().toLocaleString()
});

const onSell = () => {
  router.push({
    name: "/user/action",
    query: { mode: "sell", id: assetId },
  });
};

const onBuy = () => {
  router.push({
    name: "/user/action",
    query: { mode: "buy", id: assetId },
  });
};
</script>

<style scoped></style>
