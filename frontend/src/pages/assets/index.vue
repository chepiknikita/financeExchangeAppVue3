<template>
  <div>
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      color="basil"
      align-tabs="center"
    >
      <v-tab
        v-for="item in tabs"
        :key="item.key"
        :text="item.name"
        :value="item.key"
        class="text-none text-body-1"
      />
    </v-tabs>
    <div class="page-wrapper">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="stock" class="my-0 mx-auto">
          <finance-table
            :headers="headers"
            :items="stocks"
            @click:row="onSelectAsset"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="bond" class="my-0 mx-auto">
          <finance-table
            :headers="headers"
            :items="bonds"
            @click:row="onSelectAsset"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="metal" class="my-0 mx-auto">
          <finance-table
            :headers="headers"
            :items="metals"
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
import type { Asset } from "@/api/intarfaces/asset";
import FinanceTable from "@/components/UI/tables/FinanceTable.vue";
import userAssets from '@/composables/useAssets';

const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, needUpdatedAllAssets } = userAssets();

const tab = ref(null);
const stocks = ref<Asset[]>([]);
const bonds = ref<Asset[]>([]);
const metals = ref<Asset[]>([]);
//TODO - loaders
//TODO - enum AssetType
const tabs = [
  { name: "Акции", key: "stock" },
  { name: "Облигации", key: "bond" },
  { name: "Металлы", key: "metal" },
];

const headers = [
  { title: "Название", key: "name", width: "90%" },
  { title: "Цена", key: "price" },
];

onMounted(async () => {
  await loadAssets();
  subscribeToAssets();
});

const loadAssets = async () => {
  const assets: Asset[] = (await assetService.getAll()).map((v) => {
    v.profit = +(v.price - v.closingPrice).toFixed(2);
    return v;
  });
  stocks.value = assets.filter((v) => v.type === "stock");
  bonds.value = assets.filter((v) => v.type === "bond");
  metals.value = assets.filter((v) => v.type === "metal");
}
// TODO - rename - refrashAssets
watch(needUpdatedAllAssets, async (v) => {
  if (v) {
    await loadAssets();
    needUpdatedAllAssets.value = false;
  }
});

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>

<style scoped></style>
