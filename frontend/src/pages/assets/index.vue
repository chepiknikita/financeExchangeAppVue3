<template>
  <div class="page-wrapper">
    <div class="exchange-header mb-4">
      <div class="text-h6 font-weight-bold" style="color: #E8EDF5">Биржа</div>
      <div class="text-body-2 mt-1" style="color: rgba(200,208,224,0.45)">
        Торговые инструменты
      </div>
    </div>

    <v-tabs
      v-model="tab"
      bg-color="transparent"
      color="primary"
      align-tabs="start"
      class="exchange-tabs mb-4"
    >
      <v-tab
        v-for="item in tabs"
        :key="item.key"
        :text="item.name"
        :value="item.key"
        class="text-none tab-item"
      />
    </v-tabs>

    <div v-if="loading">
      <div class="d-flex gap-2 mb-4">
        <div class="sk" style="width:72px;height:34px;border-radius:8px" />
        <div class="sk" style="width:80px;height:34px;border-radius:8px" />
      </div>
      <div class="sk-card pa-0">
        <div v-for="i in 6" :key="i" class="sk-table-row d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-3">
            <div class="sk" style="width:3px;height:36px;border-radius:2px;flex-shrink:0" />
            <div>
              <div class="sk sk-line mb-1" style="width:120px;height:12px" />
              <div class="sk sk-line" style="width:48px;height:9px" />
            </div>
          </div>
          <div class="text-right">
            <div class="sk sk-line mb-1" style="width:72px;height:12px;margin-left:auto" />
            <div class="sk sk-line" style="width:50px;height:9px;margin-left:auto" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="stock">
          <finance-table
            :headers="headers"
            :items="stocks"
            :trading-status="session?.isTrading"
            @click:row="onSelectAsset"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="metal">
          <finance-table
            :headers="headers"
            :items="metals"
            :trading-status="session?.isTrading"
            @click:row="onSelectAsset"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import { Asset, AssetType } from "@/entities/Asset";
import useAssets from '@/composables/useAssets';
import FinanceTable from "@/components/UI/tables/FinanceTable.vue";
import useTradingSession from '@/composables/useTradingSession';

const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, refreshAssets } = useAssets();
const { loadTradingSession, session } = useTradingSession();

const loading = ref(true);
const tab = ref(null);
const stocks = ref<Asset[]>([]);
const metals = ref<Asset[]>([]);

const tabs = [
  { name: "Акции", key: AssetType.Stock },
  { name: "Металлы", key: AssetType.Metal },
];

const headers = [
  { title: "Название", key: "name", width: "90%" },
  { title: "Цена", key: "price" },
];

onMounted(async () => {
  await loadTradingSession();
  await loadAssets();
  subscribeToAssets();
  loading.value = false;
});

const loadAssets = async () => {
  const assets: Asset[] = (await assetService.getAll()).map((v) => new Asset(v));
  stocks.value = assets.filter((v) => v.type === AssetType.Stock);
  metals.value = assets.filter((v) => v.type === AssetType.Metal);
}

watch(refreshAssets, async (v) => {
  if (v) {
    await loadAssets();
    refreshAssets.value = false;
  }
});

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>

<style scoped lang="scss">
.exchange-tabs {
  :deep(.v-tab) {
    font-size: 14px;
    font-weight: 500;
    padding: 0 20px;
    min-width: 100px;
    border-radius: 8px 8px 0 0;
  }

  :deep(.v-tab--selected) {
    color: #4A9FFF;
  }

  :deep(.v-tabs__bar) {
    border-bottom: 2px solid rgba(255, 255, 255, 0.06);
  }
}
</style>
