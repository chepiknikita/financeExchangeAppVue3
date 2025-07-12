<template>
  <div class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">Контроль торгов</div>
      <div v-if="exchangeInfo" class="text-center growth">
        <div>Информация</div>
        <div> Период работы: {{ exchangeInfo.start }} - {{ exchangeInfo.end }}</div>
      </div>
      <div>
        <v-btn variant="tonal" class="my-2 text-none mx-2">Остановить</v-btn>
        <v-btn variant="tonal" class="my-2 text-none mx-2">Редактировать</v-btn>
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-body-1 my-2 mx-4">Список пользователей</div>
      <div :style="{ width: '500px' }">
        <v-data-table
          :items="users"
          :headers="headers"
          density="compact"
          item-value="name"
          hide-default-footer
          hide-default-header
          hover
          select-strategy="single"
          return-object
          @click:row="onSelectUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { User } from "@/api/intarfaces/user";
import { ApiFactory } from "@/api";
import { formatMoneyAmount } from "@/utilities/helpers";
import { useRouter } from "vue-router";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";

const router = useRouter();
const userService = ApiFactory.createUserService();
const exchangeService = ApiFactory.createExchangeService();

const users = ref<User[]>([]);
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
const exchangeInfo = ref<ExchangeInfo | null>(null);

const headers = [
  { title: "Пользователь", key: "name", width: "70%" },
  {
    title: "Баланс",
    key: "balance",
    align: "end",
    value: (item: User) => `${formatMoneyAmount(item.balance)} ₽`,
  },
];

onMounted(async () => {
  users.value = (await userService.getAll()).filter((v) => v.id !== userId);
  exchangeInfo.value = (await exchangeService.getInfo())?.[0] ?? null;
  console.log('test', exchangeInfo.value)
});

const onSelectUser = (event: MouseEvent, row: { item: User }) => {
  router.push(`/admin/user/${row.item.id}`);
};
</script>

<style scoped></style>
