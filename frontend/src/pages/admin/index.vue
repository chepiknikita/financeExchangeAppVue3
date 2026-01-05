<template>
  <div
    v-if="loading"
    class="d-flex justify-center align-center flex-column mt-8"
  >
    <v-skeleton-loader
      type="heading, list-item-two-line"
      :width="400"
      class="my-2"
    />
    <v-skeleton-loader
      type="list-item-three-line, heading"
      :width="450"
      class="my-2"
    />
    <v-skeleton-loader
      type="image"
      :width="500"
      class="my-2"
    />
  </div>
  <div v-else class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">Контроль торгов</div>
      <div class="text-center">
        <div>Информация</div>
        <div :class="[ marketState?.isTrading ? 'growth' : 'blocker' ]">Статус биржы: {{ status }}</div>
        <div class="my-2 border px-4 py-2">
          <div class="my-2">Период работы:</div>
            <VueDatePicker
              v-model="model.date"
              range
              locale="ru"
              format="dd.MM.yyyy HH:mm"
              select-text="Выбрать"
              cancel-text="Отмена"
              :clearable="false"
              :style="{ width: '340px'}"
              :dark="true"
              :format-locale="ru"
              :teleport="true"
            />
            <div class="d-flex align-center justify-center">
              <v-switch
                v-model="model.isTrading"
                hide-details
              />
              <div class="mx-2">{{ nextStatus }}</div>
            </div>
            <v-btn
              variant="tonal"
              class="my-2 text-none mx-2"
              :disabled="disabled"
              @click="save"
            >
              Применить
            </v-btn>
        </div>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ApiFactory } from "@/api";
import { formatMoneyAmount } from "@/utilities/helpers";
import { ru } from 'date-fns/locale';
import { User } from "@/entities/User";
import TradingSession from "@/entities/TradingSession";

const router = useRouter();
const userService = ApiFactory.createUserService();
const tradingSessionService = ApiFactory.createTradingSessionService();

const loading = ref(true);

const users = ref<User[]>([]);
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
const marketState = ref<TradingSession | null>(null);
const snapshot = ref<string>("");

const model = ref<{ date: number[], isTrading: boolean }>({
  date: [],
  isTrading: false,
});

const headers = [
  { title: "Пользователь", key: "name", width: "70%" },
  {
    title: "Баланс",
    key: "balance",
    align: "end",
    value: (item: User) => `${formatMoneyAmount(item.currentBalance)} ₽`,
  },
];

onMounted(async () => {
  users.value = (await userService.getAll())
    .filter((v) => v.id !== userId)
    .map((v) => new User(v));
  await loadTradingSession();
  snapshot.value = JSON.stringify(model.value);
  loading.value = false;
});

const status = computed(() => {
  return marketState.value?.isTrading ? 'идут торги' : 'торги остановлены';
});

const nextStatus = computed(() => {
  return model.value.isTrading ? 'Торги будут запущены' : 'Торги будут прекращены';
})

const disabled = computed(() => {
  return snapshot.value === JSON.stringify(model.value);
})

const onSelectUser = (_: MouseEvent, row: { item: User }) => {
  router.push(`/admin/user/${row.item.id}`);
};

const save = async () => {
  await tradingSessionService.updateStatus(TradingSession.fromTimestampObject(model.value));
  await loadTradingSession();
}

const loadTradingSession = async () => {
  const loadedMarket = await tradingSessionService.getStatus();
  if (loadedMarket) {
    marketState.value = new TradingSession(loadedMarket);
    model.value = marketState.value.toTimestampObject();
  }
}
</script>

<style scoped></style>
