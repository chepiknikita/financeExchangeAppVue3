<template>
  <div class="page-wrapper h-100 overflow-hidden">
    <div v-if="loading" class="action-layout">
      <div class="sk-card mb-3">
        <div class="d-flex align-center gap-2 mb-2">
          <div class="sk" style="width:7px;height:7px;border-radius:50%" />
          <div class="sk sk-line" style="width:130px;height:13px" />
        </div>
        <div class="d-flex align-center gap-3">
          <div class="sk sk-line" style="width:110px;height:26px" />
          <div class="sk sk-line" style="width:56px;height:20px;border-radius:20px" />
        </div>
        <div class="sk sk-line mt-2" style="width:65px;height:8px" />
      </div>
      <div class="sk-card mb-2">
        <div class="sk sk-line mb-2" style="width:80px;height:9px" />
        <div class="d-flex justify-space-between mb-2">
          <div class="sk sk-line" style="width:100px;height:11px" />
          <div class="sk sk-line" style="width:80px;height:11px" />
        </div>
        <div class="sk-metrics-grid">
          <div
            v-for="i in 3"
            :key="i"
            class="sk-metric-cell"
            :style="i === 3 ? 'grid-column: span 2' : ''"
          >
            <div class="sk sk-line mb-1" style="height:8px;width:55%" />
            <div class="sk sk-line" style="height:12px;width:75%" />
          </div>
        </div>
      </div>
      <div class="sk-card">
        <div class="sk sk-line mb-3" style="width:55px;height:9px" />
        <div class="sk sk-line mb-2" style="height:36px;border-radius:8px" />
        <div class="sk sk-line mb-3" style="height:36px;border-radius:8px" />
        <div class="sk sk-line" style="height:44px;border-radius:10px" />
      </div>
    </div>

    <div v-else class="action-layout">
      <the-asset-info
        :asset-name="asset ? asset.name : ''"
        :asset-price="asset?.price"
        :asset-profit="+assetProfit"
        :trading-status="session?.isTrading"
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
          :trading-status="session?.isTrading"
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
import { useUserStore } from "@/stores/useUserStore";

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const orderService = ApiFactory.createOrderService();
const { loadTradingSession, session } = useTradingSession();
const { selectAsset, selectedAssetId, updatedAsset, unsubscribeAll } = useAssets();
const userStore = useUserStore();

const loading = ref(true);
const route = useRoute();
const { info, error } = useNotifications();

const status = route.query?.mode as OrderType;
selectedAssetId.value = typeof route.query?.id === "string" ? +route.query?.id : 0;

const user = ref<User | null>(null);
const asset = ref<Asset | null>(null);
const quantityAssetExits = ref(0);
const quantity = ref<string>("");
const price = ref<number>();

onMounted(async () => {
  const userId = userStore.id;
  if (!userId) return;

  const loadedUser = await userService.getById(userId);
  if (loadedUser) user.value = new User(loadedUser);

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

const assetProfit = computed(() => asset.value?.getProfitPercent().toFixed(2) ?? 0);

const result = computed(() => {
  return quantity.value && price.value
    ? +(price.value * +quantity.value).toFixed(2)
    : null;
});

watch(updatedAsset, (v) => {
  if (v) asset.value?.updatePrice(v);
});

watch(() => session.value?.isTrading, (isTrading) => {
  if (isTrading === false) unsubscribeAll();
});

const createOrder = async () => {
  if (!user.value || !asset.value || !price.value) return;

  const qty = +quantity.value;

  if (status === OrderType.Buy) {
    if (qty * price.value > user.value.currentBalance) {
      error('Недостаточно средств для покупки', 'Ошибка');
      return;
    }
  } else if (status === OrderType.Sell) {
    if (qty > quantityAssetExits.value) {
      error('Недостаточно активов для продажи', 'Ошибка');
      return;
    }
  }

  const order = Order.getOrderRequest(status, user.value, asset.value, quantity.value);
  if (order) {
    const saved = await orderService.create(order);
    if (saved) {
      const event = saved.type === OrderType.Buy ? 'Покупка' : 'Продажа';
      info(`${event} прошла успешно`, 'Информация');
    }
  }
};
</script>

<style scoped lang="scss">
.action-layout {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
