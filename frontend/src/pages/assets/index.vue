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
    <div
      v-if="loading"
      class="d-flex justify-center my-8"
    >
      <v-skeleton-loader
        type="image"
        :width="600"
      />
    </div>
    <div
      v-else
      class="page-wrapper"
    >
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          value="stock"
          class="my-0 mx-auto"
        >
          <finance-table
            :headers="headers"
            :items="stocks"
            @click:row="onSelectAsset"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="metal"
          class="my-0 mx-auto"
        >
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
import { Asset, AssetType } from "@/entities/Asset";
import userAssets from '@/composables/useAssets';
import FinanceTable from "@/components/UI/tables/FinanceTable.vue";

const router = useRouter();
const assetService = ApiFactory.createAssetsService();
const { subscribeToAssets, refrashAssets } = userAssets();

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
  await loadAssets();
  subscribeToAssets();
  loading.value = false;
});

const loadAssets = async () => {
  const assets: Asset[] = (await assetService.getAll()).map((v) => new Asset(v));
  stocks.value = assets.filter((v) => v.type === AssetType.Stock);
  metals.value = assets.filter((v) => v.type === AssetType.Metal);
}

watch(refrashAssets, async (v) => {
  if (v) {
    await loadAssets();
    refrashAssets.value = false;
  }
});

const onSelectAsset = (item: Asset) => {
  router.push(`/assets/${item.id}`);
};
</script>

<style scoped></style>
