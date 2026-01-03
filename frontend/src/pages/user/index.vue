<template>
  <div v-if="user" class="page-wrapper">
    <the-user-total-balance
      :user="user"
      :assets="assets"
    />
    <div class="page-content-body">
      <div class="text-body-1 mt-2 mx-4">Активы</div>
      <the-user-balance :balance="+user.balance"/>
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
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ApiFactory } from '@/api';
import type { Asset, AssetInfo, UserAsset } from '@/api/intarfaces/asset';
import type { User } from '@/api/intarfaces/user';
import TheUserTotalBalance from '@/components/user/TheUserTotalBalance.vue';
import TheUserBalance from '@/components/user/TheUserBalance.vue';
import FinanceTable from '@/components/UI/tables/FinanceTable.vue';
import userAssets from '@/composables/useAssets';
import columns from './columns';

const router = useRouter();
const userService = ApiFactory.createUserService();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, needUpdatedAllAssets } = userAssets();

const loading = ref(false);
const userId = JSON.parse(atob(sessionStorage.getItem('user') ?? ''))?.id;
const user = ref<User | null>(null);
const assets = ref<AssetInfo[]>([]);

onMounted(async () => {
  loading.value = true;
  await loadUserAssets();
  subscribeToAssets();
  loading.value = false;
});

const loadUserAssets = async () => {
  //TODO на then
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

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>
