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
        :asset-price="asset?.price"
        :asset-profit="+assetProfit"
        :traiding-status="session?.isTrading"
      />
      <the-user-asset-info
        :balance="user ? +user.currentBalance : 0"
        :available-quantity="asset?.availableQuantity ? asset.availableQuantity : 0"
        :quantity-asset-exits="quantityAssetExits"
        :result="result"
        :trading-end-time="session?.end"
      >
        <the-user-asset-action
          v-model:price="price"
          v-model:quantity="quantity"
          :status="status"
          :traiding-status="session?.isTrading"
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
import useAssets from '@/composables/useAssets';
import { Asset } from "@/entities/Asset";
import { User } from "@/entities/User";
import { Order, OrderType } from "@/entities/Order";
import { useNotifications } from "@/composables/useNotifications";
import useTradingSession from '@/composables/useTradingSession';

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const orderService = ApiFactory.createOrderService();
const { loadTradingSession, session } = useTradingSession();

const loading = ref(true);

const route = useRoute();
const { selectAsset, selectedAssetId, updatedAsset } = useAssets();
const { info } = useNotifications();

const status = route.query?.mode as OrderType;
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
selectedAssetId.value = typeof route.query?.id === "string" ? +route.query?.id : 0;

const user = ref<User | null>(null);
const asset = ref<Asset | null>(null);

const quantityAssetExits = ref(0);
const quantity = ref<string>("");
const price = ref<number>();

onMounted(async () => {
  const loadedUser = await userService.getById(userId);
  if (loadedUser) {
    user.value = new User(loadedUser);
  }
  await loadTradingSession();
  if (selectedAssetId.value) {
    const loadedAsset = await assetService.getById(selectedAssetId.value);
    asset.value = loadedAsset ? new Asset(loadedAsset) : null;
    selectAsset(selectedAssetId.value);
    quantityAssetExits.value = user.value?.getQuantityByAssetId(selectedAssetId.value) ?? 0;
  }
  price.value = asset.value?.price;
  loading.value = false;
});

const assetProfit = computed(() => {
  return asset.value?.getProfitPercent().toFixed(2) ?? 0;
});

const result = computed(() => {
  return quantity.value && price.value
    ? +(price.value * +quantity.value).toFixed(2)
    : null;
});

watch(updatedAsset, (v) => {
  if (v) {
    asset.value?.updatePrice(v);
  }
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
