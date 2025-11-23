<template>
  <div class="page-wrapper h-100 overflow-hidden">
    <div class="page-content-title">
      <div class="text-h6">
        {{ asset?.name }}
        <span :class="{ 'growth': +assetProfit > 0, 'fall': +assetProfit < 0 }">
          ({{ assetPrice }})
        </span>
      </div>
      <div>
        <div class="text-center">{{ title }}</div>
        <div class="border py-2 px-4 rounded-sm ma-2 balance-info">
          <div>Баланс: {{ formatMoneyAmount(user?.balance ?? 0) }}</div>
          <div class="d-flex justify-space-between text-disabled">
            <div>Есть в портфеле:</div>
            <div>{{ quantityAssetExits }} шт</div>
          </div>
          <div class="d-flex justify-space-between text-disabled">
            <div>Доступно к покупке:</div>
            <div>{{ asset?.availableQuantity }} шт</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content-body font-size-14">
      <div>
        <v-text-field
          v-model="quantity"
          width="250px"
          density="compact"
          hide-spin-buttons
          type="number"
          placeholder="Количество"
          variant="outlined"
          class="text-none"
        />
      </div>
      <div>
        <v-text-field
          v-model="price"
          width="250px"
          density="compact"
          hide-spin-buttons
          type="number"
          placeholder="Цена"
          variant="outlined"
        />
      </div>
      <div class="text-body-1 text-disabled text-center mt-2">
        {{ exchangeMessage }}
      </div>
      <v-btn
        variant="tonal"
        width="250px"
        color="#ccc"
        class="text-none my-1 mx-2"
        :disabled="!(quantity && !exchangeStatus?.isTrading)"
        @click="onClick"
      >
        {{ btnTitile }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiFactory } from "@/api";
import type { Asset } from "@/api/intarfaces/asset";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";
import type { OrderCreate } from "@/api/intarfaces/order";
import type { User } from "@/api/intarfaces/user";
import { formatMoneyAmount } from "@/utilities/helpers";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import useExchange from "@/composables/useExchange";
import userAssets from '@/composables/useAssets';

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const exchangeService = ApiFactory.createExchangeService();
const orderService = ApiFactory.createOrderService();

const route = useRoute();
const { selectAsset, selectedAssetId, assetPrice } = userAssets();
const { updatedExchange } = useExchange();
const status = route.query?.mode;
const title = status === "SELL" ? "Продажа" : "Покупка";
const btnTitile = status === "SELL" ? "Продать" : "Купить";
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
selectedAssetId.value = typeof route.query?.id === "string" ? +route.query?.id : 0;

const exchangeStatus = ref<ExchangeInfo | null>(null);
const asset = ref<Asset | null>(null);
const user = ref<User | null>(null);

const quantityAssetExits = ref(0);
const quantity = ref<number>();
const price = ref<number>();

onMounted(async () => {
  user.value = await userService.getById(userId);
  exchangeStatus.value = await exchangeService.getStatus();
  if (selectedAssetId.value) {
    asset.value = await assetService.getById(selectedAssetId.value);
    assetPrice.value = asset.value?.price ?? 0;
    selectAsset(selectedAssetId.value);
  }
  quantityAssetExits.value =// TODO  мониторить надо цену и количество акций.
    user.value?.assets?.find((asset) => asset.assetId === selectedAssetId.value)?.quantity ??
    0;
  price.value = asset.value?.price;
});

const assetProfit = computed(() => {
  if (asset.value) {
    return (((asset.value?.price - asset.value?.closingPrice)/asset.value?.price) * 100).toFixed(2);
  }
  return 0;
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

const onClick = async () => {
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
.balance-info {
  width: 300px;
}
</style>
