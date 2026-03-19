<template>
  <div v-if="loading" class="page-wrapper">
    <div class="sk-card sk-balance-card">
      <div class="d-flex align-start justify-space-between">
        <div style="flex:1">
          <div class="sk sk-line mb-2" style="width:80px;height:9px" />
          <div class="sk sk-line mb-3" style="width:160px;height:26px" />
          <div class="sk sk-line" style="width:72px;height:20px;border-radius:20px" />
        </div>
        <div class="sk" style="width:40px;height:40px;border-radius:12px" />
      </div>
      <div class="sk-divider my-3" />
      <div class="d-flex gap-4">
        <div>
          <div class="sk sk-line mb-1" style="width:24px;height:8px" />
          <div class="sk sk-line" style="width:80px;height:11px" />
        </div>
        <div>
          <div class="sk sk-line mb-1" style="width:50px;height:8px" />
          <div class="sk sk-line" style="width:80px;height:11px" />
        </div>
      </div>
    </div>
    <div class="sk-card mt-4 pa-0">
      <div v-for="i in 4" :key="i" class="sk-table-row d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <div class="sk" style="width:3px;height:36px;border-radius:2px;flex-shrink:0" />
          <div>
            <div class="sk sk-line mb-1" style="width:110px;height:12px" />
            <div class="sk sk-line" style="width:50px;height:9px" />
          </div>
        </div>
        <div class="text-right">
          <div class="sk sk-line mb-1" style="width:80px;height:12px;margin-left:auto" />
          <div class="sk sk-line" style="width:56px;height:9px;margin-left:auto" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="user" class="page-wrapper">
    <the-user-total-balance :user="user" />

    <div class="assets-section">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="section-title mb-0">Активы</div>
        <the-user-balance :balance="+user.currentBalance" />
      </div>
      <finance-table
        is-total
        :headers="columns"
        :items="user.mappedAssets"
        :trading-status="session?.isTrading"
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
import useAssets from '@/composables/useAssets';
import TheUserTotalBalance from '@/components/user/TheUserTotalBalance.vue';
import TheUserBalance from '@/components/user/TheUserBalance.vue';
import FinanceTable from '@/components/UI/tables/FinanceTable.vue';
import columns from './columns';
import useTradingSession from '@/composables/useTradingSession';
import { useUserStore } from '@/stores/useUserStore';

const router = useRouter();
const userStore = useUserStore();
const userService = ApiFactory.createUserService();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, refreshAssets } = useAssets();
const { loadTradingSession, session } = useTradingSession();

const loading = ref(true);
const userId = userStore.id;
const user = ref<User | null>(null);

onMounted(async () => {
  await loadTradingSession();
  await loadUserAssets();
  subscribeToAssets();
  loading.value = false;
});

const loadUserAssets = async () => {
  if (!userId) return;
  const loadedUser = await userService.getById(userId);
  if (loadedUser) {
    user.value = new User(loadedUser);
    user.value.setUserAssets(await assetService.getUserPortfolio(user.value.id));
  }
}

watch(refreshAssets, async (v) => {
  if (v) {
    await loadUserAssets();
    refreshAssets.value = false;
  }
})

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>

<style scoped lang="scss">
.assets-section {
  margin-top: 20px;
}

.sk-balance-card {
  background: linear-gradient(135deg, #1A3A6E 0%, #0F2A52 40%, #0A2040 100%);
  border: 1px solid rgba(74, 159, 255, 0.2);
  border-radius: 18px;
  padding: 20px 22px;
  width: 100%;
}

.sk-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}
</style>
