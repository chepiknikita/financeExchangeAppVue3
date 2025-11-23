<template>
  <div v-if="user" class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">
        Баланс
      </div>
      <div class="text-h5">
        {{ getTotalBalace() }}
      </div>
      <div
        class="text-body-1"
        :class="{ 'growth': +userProfit > 0, 'fall': +userProfit < 0 }"
      >
        {{ userProfit }}% (доходность)
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-body-1 mt-2 mx-4">
        Активы
      </div>
      <div class="mb-2">Доступные средства:
        <span class="text-h6">{{ formatMoneyAmount(user.balance) }}</span>
      </div>
      <finance-table
        is-total
        :headers="columns"
        :items="assets"
        @click:row="onSelectAsset"
      />
    </div>
  </div>
  <div v-else class="text-center my-2">
    Такого пользователя не существует.
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ApiFactory } from '@/api';
import type { Asset, AssetInfo, UserAsset } from '@/api/intarfaces/asset';
import type { User } from '@/api/intarfaces/user';
import FinanceTable from '@/components/UI/tables/FinanceTable.vue';
import columns from './columns';
import { formatMoneyAmount } from '@/utilities/helpers';
import userAssets from '@/composables/useAssets';

const router = useRouter();
const userService = ApiFactory.createUserService();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, needUpdatedAllAssets } = userAssets();

const userId = JSON.parse(atob(sessionStorage.getItem('user') ?? ''))?.id;
const user = ref<User | null>(null);
const assets = ref<AssetInfo[]>([]);

onMounted(async () => {
  await loadUserAssets();
  subscribeToAssets();
});

const loadUserAssets = async () => {
  user.value = await userService.getById(userId);
  if (user.value) {
    const userAssets = await assetService.getUserPortfolio(userId);
    assets.value = userAssets?.map((asset: Required<UserAsset>) => {
      return {
        ...asset.asset,
        id: asset.assetId,
        quantity: asset.quantity,
        averageBuyPrice: asset.averageBuyPrice,
        totalProfit: (asset.asset.price - asset.averageBuyPrice) * asset.quantity,
      };
    }) ?? [];
  }
}

watch(needUpdatedAllAssets, async (v) => {
  if (v) {
    await loadUserAssets();
    needUpdatedAllAssets.value = false;
  }
})

const userProfit = computed(() => {
  return (assets.value.reduce((acc, v) => acc + ((v.totalProfit/(v.price * v.quantity)) * 100), 0)).toFixed(2);
});

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
const getTotalBalace = () => {
  if (user.value) {
    let balance: number = +user.value.balance;
    balance = balance + (user.value.assets?.reduce((acc: number, val: UserAsset) => acc + (val.asset.price * val.quantity), 0) || 0);
    return formatMoneyAmount(balance.toFixed(2));
  }
  return 0;
}
</script>
