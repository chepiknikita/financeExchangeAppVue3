<template>
  <div
    v-if="loading"
    class="d-flex justify-center align-center flex-column mt-2"
  >
    <v-skeleton-loader
      type="list-item-three-line"
      :width="300"
      class="my-2"
    />
    <v-skeleton-loader
      type="heading"
      :width="300"
      class="my-2"
    />
    <v-skeleton-loader
      type="image"
      :width="500"
      class="my-2"
    />
  </div>
  <div
    v-else-if="user"
    class="page-wrapper"
  >
    <div class="page-content-title">
      <div class="border rounded-sm py-2 px-4 text-center">
        <div>{{ user.name }}</div>
        <div>Баланс: {{ formatMoneyAmount(user.currentBalance) }}</div>
        <div class="growth">Доходность: {{ userProfit }}%</div>
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-h6">Состав портфеля</div>
      <div class="text-body-1 my-2 mx-4">Активы</div>
      <finance-table
        is-total
        :headers="columns"
        :items="user.mappedAssets"
      />
    </div>
  </div>
  <div v-else class="text-center my-2">Такого пользователя не существует.</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { ApiFactory } from "@/api";
import { formatMoneyAmount } from "@/utilities/helpers";
import { User } from "@/entities/User";
import FinanceTable from "@/components/UI/tables/FinanceTable.vue";
import columns from "@/pages/user/columns";

const loading = ref(true);
const route = useRoute();
const userService = ApiFactory.createUserService();

const userId = route.params?.id;
const user = ref<User | null>(null);

onMounted(async () => {
  const loadedUser = await userService.getById(userId);
  user.value = loadedUser ? new User(loadedUser) : null;
  loading.value = false;
});

const userProfit = computed(() => 0);
</script>
