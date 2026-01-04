<template>
  <div class="page-wrapper h-100 overflow-hidden">
    <div
      v-if="loading"
      class="d-flex justify-center align-center flex-column mt-8"
    >
      <v-skeleton-loader
        type="list-item-three-line"
        :width="200"
        class="my-2"
      />
      <v-skeleton-loader
        type="list-item-three-line"
        :width="300"
        class="my-2"
      />
      <v-skeleton-loader
        type="heading"
        :width="150"
        class="my-2"
      />
      <v-skeleton-loader
        type="heading"
        :width="150"
        class="my-2"
      />
    </div>
    <div v-else class="page-content-title">
      <the-asset-info
        :asset-name="asset ? asset.name : ''"
        :asset-price="assetPrice"
        :asset-profit="+assetProfit"
        :traiding-status="exchangeStatus?.isTrading"
      />
      <the-user-asset-info
        :balance="user ? +user.currentBalance : 0"
        :available-quantity="asset?.availableQuantity ? asset.availableQuantity : 0"
        :quantity-asset-exits="quantityAssetExits"
        :result="result"
        :trading-end-time="exchangeStatus?.end"
      >
        <the-user-asset-action
          v-model:price="price"
          v-model:quantity="quantity"
          :status="status"
          :traiding-status="exchangeStatus?.isTrading"
          @on-order="createOrder"
        />
      </the-user-asset-info>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { ApiFactory } from "@/api";
import type { Asset } from "@/api/intarfaces/asset";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";
import type { OrderCreate } from "@/api/intarfaces/order";
import type { User } from "@/api/intarfaces/user";
import useExchange from "@/composables/useExchange";
import userAssets from '@/composables/useAssets';

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const exchangeService = ApiFactory.createExchangeService();
const orderService = ApiFactory.createOrderService();

const loading = ref(true);

const route = useRoute();
const { updatedExchange } = useExchange();
const { selectAsset, selectedAssetId, assetPrice } = userAssets();

const status = route.query?.mode;
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
selectedAssetId.value = typeof route.query?.id === "string" ? +route.query?.id : 0;

const user = ref<User | null>(null);
const asset = ref<Asset | null>(null);
const exchangeStatus = ref<ExchangeInfo | null>(null);

const quantityAssetExits = ref(0);
const quantity = ref<string>("");
const price = ref<number>();

//TODO loader
onMounted(async () => {
  user.value = await userService.getById(userId);
  exchangeStatus.value = await exchangeService.getStatus();
  if (selectedAssetId.value) {
    asset.value = await assetService.getById(selectedAssetId.value);
    assetPrice.value = asset.value?.price ?? 0;
    selectAsset(selectedAssetId.value);
  }
  quantityAssetExits.value =
    user.value?.assets?.find((asset) => asset.assetId === selectedAssetId.value)?.quantity ??
    0;
  price.value = asset.value?.price;
  loading.value = false;
});

const assetProfit = computed(() => {
  if (asset.value) {
    return (((asset.value?.price - asset.value?.closingPrice)/asset.value?.price) * 100).toFixed(2);
  }
  return 0;
});

watch(updatedExchange, (v) => {
  exchangeStatus.value = v;
});

const result = computed(() => {
  return quantity.value && price.value
    ? +(price.value * +quantity.value).toFixed(2)
    : null;
});

const createOrder = async () => {
  if (user.value && asset.value && quantity.value) {
    const order: OrderCreate  = {
      userId: user.value?.id,
      assetId: asset.value?.id,
      type: status as string,
      quantity: +quantity.value,
    }
    await orderService.create(order);
  }
};
</script>

<style scoped lang="scss">
:deep(.font-size-14 input) {
  font-size: 14px;
}
</style>
