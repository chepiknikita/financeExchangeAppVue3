<template>
  <div class="page-wrapper h-100 overflow-hidden">
    <div class="page-content-title">
      <div class="text-h6">
        {{ asset?.name }}
      </div>
      <div>
        <div class="text-center">{{ title }}</div>
        <div class="border py-2 px-4 rounded-sm ma-2 balance-info">
          <div>Баланс: {{ formatMoneyAmount(user?.balance ?? 0) }}</div>
          <div class="d-flex justify-space-between text-disabled">
            <div>Есть в портфеле:</div>
            <div>{{ quantityAssetExits }} шт</div>
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
        Торги продляться до {{ endTrading }}
      </div>
      <v-btn
        variant="tonal"
        width="250px"
        color="#ccc"
        class="text-none my-1 mx-2"
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
import type { User } from "@/api/intarfaces/user";
import { formatMoneyAmount } from "@/utilities/helpers";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const status = route.query?.mode;
const assetId = typeof route.query?.id === "string" ? +route.query?.id : 0;
const title = status === "sell" ? "Продажа" : "Покупка";
const btnTitile = status === "sell" ? "Продать" : "Купить";
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;

const assetService = ApiFactory.createAssetsService();
const userService = ApiFactory.createUserService();
const exchangeService = ApiFactory.createExchangeService();

const exchangeInfo = ref<ExchangeInfo | null>(null);
const asset = ref<Asset | null>(null);
const user = ref<User | null>(null);
const quantityAssetExits = ref(0);
const quantity = ref<number>();
const price = ref<number>();

onMounted(async () => {
  asset.value = await assetService.getById(assetId);
  user.value = await userService.getById(userId);
  exchangeInfo.value = (await exchangeService.getInfo())?.[0] ?? null;
  quantityAssetExits.value =
    user.value?.assets?.find((asset) => asset.assetId === assetId)?.quantity ??
    0;
});

const endTrading = computed(() => {
  exchangeInfo.value?.end;
  return exchangeInfo.value?.end
    ? new Date(exchangeInfo.value?.end).toLocaleString()
    : new Date().toLocaleString();
});

const onClick = () => {};
</script>

<style scoped lang="scss">
:deep(.font-size-14 input) {
  font-size: 14px;
}
.balance-info {
  width: 300px;
}
</style>
