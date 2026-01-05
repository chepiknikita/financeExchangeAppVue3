<template>
  <div v-if="loading" class="d-flex justify-center align-center mt-8">
    <v-skeleton-loader
      type="heading, list-item-three-line"
      :width="600"
    />
  </div>
  <div
    v-else-if="user"
    class="page-wrapper"
  >
    <the-user-total-balance :user="user" />
    <div class="page-content-body">
      <div class="text-body-1 mt-2 mx-4">Активы</div>
      <the-user-balance :balance="+user.currentBalance"/>
      <finance-table
        is-total
        :headers="columns"
        :items="user.mappedAssets"
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
import { User } from '@/entities/User';
import type { Asset } from '@/entities/Asset';
import userAssets from '@/composables/useAssets';
import TheUserTotalBalance from '@/components/user/TheUserTotalBalance.vue';
import TheUserBalance from '@/components/user/TheUserBalance.vue';
import FinanceTable from '@/components/UI/tables/FinanceTable.vue';
import columns from './columns';

const router = useRouter();
const userService = ApiFactory.createUserService();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, refrashAssets } = userAssets();

const loading = ref(true);
const userId = JSON.parse(atob(sessionStorage.getItem('user') ?? ''))?.id;
const user = ref<User | null>(null);

onMounted(async () => {
  await loadUserAssets();
  subscribeToAssets();
  loading.value = false;
});

const loadUserAssets = async () => {
  const loadedUser = await userService.getById(userId);
  if (loadedUser) {
    user.value = new User(loadedUser);
    user.value.setUserAssets(await assetService.getUserPortfolio(user.value.id));
  }
}

watch(refrashAssets, async (v) => {
  if (v) {
    await loadUserAssets();
    refrashAssets.value = false;
  }
})

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>
