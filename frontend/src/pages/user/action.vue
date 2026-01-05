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
        :traiding-status="marketState?.isTrading"
      />
      <the-user-asset-info
        :balance="user ? +user.currentBalance : 0"
        :available-quantity="asset?.availableQuantity ? asset.availableQuantity : 0"
        :quantity-asset-exits="quantityAssetExits"
        :result="result"
        :trading-end-time="marketState?.end"
      >
        <the-user-asset-action
          v-model:price="price"
          v-model:quantity="quantity"
          :status="status"
          :traiding-status="marketState?.isTrading"
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
import useTradingSession from "@/composables/useTradingSession";
import userAssets from '@/composables/useAssets';
import { Asset } from "@/entities/Asset";
import TradingSession from "@/entities/TradingSession";
import { User } from "@/entities/User";
import { OrderType } from "@/entities/Order";
import Order from "@/entities/Order";
import { useNotifications } from "@/composables/useNotifications";

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const tradingSessionService = ApiFactory.createTradingSessionService();
const orderService = ApiFactory.createOrderService();

const loading = ref(true);

const route = useRoute();
const { updatedTradingSession } = useTradingSession();
const { selectAsset, selectedAssetId, assetPrice } = userAssets();
const { info } = useNotifications();

const status = route.query?.mode as OrderType;
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
selectedAssetId.value = typeof route.query?.id === "string" ? +route.query?.id : 0;

const user = ref<User | null>(null);
const asset = ref<Asset | null>(null);
const marketState = ref<TradingSession | null>(null);

const quantityAssetExits = ref(0);
const quantity = ref<string>("");
const price = ref<number>();

onMounted(async () => {
  const loadedUser = await userService.getById(userId);
  if (loadedUser) {
    user.value = new User(loadedUser);
  }
  const loadedMarket = await tradingSessionService.getStatus();
  if (loadedMarket) {
    marketState.value = new TradingSession(loadedMarket);
  }
  if (selectedAssetId.value) {
    const loadedAsset = await assetService.getById(selectedAssetId.value);
    asset.value = loadedAsset ? new Asset(loadedAsset) : null;
    assetPrice.value = asset.value?.price ?? 0;
    selectAsset(selectedAssetId.value);
    quantityAssetExits.value = user.value?.getQuantityByAssetId(selectedAssetId.value) ?? 0;
  }
  price.value = asset.value?.price;
  loading.value = false;
});

const assetProfit = computed(() => {
  return asset.value?.getProfitPercent().toFixed(2) ?? 0;
});

watch(updatedTradingSession, (v) => {
  marketState.value = v;
});

const result = computed(() => {
  return quantity.value && price.value
    ? +(price.value * +quantity.value).toFixed(2)
    : null;
});

const createOrder = async () => {
  const order = Order.getOrderRequest(
    status,
    user.value,
    asset.value,
    quantity.value,
  );
  if (order) {
    const saved = await orderService.create(order);
    if (saved) {
      const event = saved.type === OrderType.Buy ? 'Покупка' : 'Продажа';
      const message = `${event} прошла успешно`;
      info(message, 'Информация');
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.font-size-14 input) {
  font-size: 14px;
}
</style>
