<template>
  <div
    v-if="user"
    class="page-wrapper"
  >
    <div class="page-content-title">
      <div class="border rounded-sm py-2 px-4 text-center">
        <div>{{ user.name }}</div>
        <div>Баланс: {{ formatMoneyAmount(user.balance) }}</div>
        <div class="growth">Доходность: {{ userProfit }}%</div>
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-h6">Состав портфеля</div>
      <div class="text-body-1 my-2 mx-4">Активы</div>
      <finance-table
        is-total
        :headers="columns"
        :items="assets"
      />
    </div>
  </div>
  <div v-else class="text-center my-2">Такого пользователя не существует.</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { ApiFactory } from "@/api";
import type { Asset, UserAsset } from "@/api/intarfaces/asset";
import type { User } from "@/api/intarfaces/user";
import FinanceTable from "@/components/UI/tables/FinanceTable.vue";
import { formatMoneyAmount } from "@/utilities/helpers";
import columns from "@/pages/user/columns";

const route = useRoute();
const userService = ApiFactory.createUserService();

const userId = route.params?.id;
const user = ref<User | null>(null);
const assets = ref<Asset[]>([]);

onMounted(async () => {
  user.value = await userService.getById(userId);
  if (user.value) {
    assets.value =
      user.value.assets?.map((asset: Required<UserAsset>) => {
        return {
          ...asset.asset,
          id: asset.assetId,
          quantity: asset.quantity,
        };
      }) ?? [];
  }
});

const userProfit = computed(() => 0);
</script>
