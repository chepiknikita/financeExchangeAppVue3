<template>
  <div v-if="user" class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">
        Баланс
      </div>
      <div class="text-h5">
        {{ formatMoneyAmount(user.balance) }}
      </div>
      <div class="text-body-1 growth">
        {{ userProfit }}% (доходность)
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-body-1 my-2 mx-4">
        Активы
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ApiFactory } from '@/api';
import type { Asset, UserAsset } from '@/api/intarfaces/asset';
import type { User } from '@/api/intarfaces/user';
import FinanceTable from '@/components/UI/tables/FinanceTable.vue';
import columns from './columns';
import { formatMoneyAmount } from '@/utilities/helpers';

const router = useRouter();
const userService = ApiFactory.createUserService();

const userId = JSON.parse(atob(sessionStorage.getItem('user') ?? ''))?.id;
const user = ref<User | null>(null);
const assets = ref<Asset[]>([]);

onMounted(async () => {
  user.value = await userService.getById(userId);
  if (user.value) {
    assets.value = user.value.assets?.map((asset: Required<UserAsset>) => {
      return {
        ...asset.asset,
        id: asset.assetId,
        quantity: asset.quantity,
      };
    }) ?? []

  }
});

const userProfit = computed(() => 0);

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>
