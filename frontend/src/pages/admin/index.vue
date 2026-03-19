<template>
  <div v-if="loading" class="page-wrapper">
    <div class="mb-5">
      <div class="sk sk-line mb-2" style="width: 150px; height: 18px" />
      <div class="sk sk-line" style="width: 220px; height: 11px" />
    </div>
    <div class="sk-card mb-4">
      <div class="sk sk-line mb-4" style="width: 90px; height: 9px" />
      <div class="d-flex justify-space-between align-center mb-3">
        <div class="sk sk-line" style="width: 80px; height: 11px" />
        <div class="sk sk-line" style="width: 100px; height: 22px; border-radius: 20px" />
      </div>
      <div class="sk sk-line mb-2" style="width: 90px; height: 9px" />
      <div class="sk sk-line mb-3" style="width: 100%; height: 36px; border-radius: 8px" />
      <div class="d-flex align-center gap-3 mb-3">
        <div class="sk" style="width: 36px; height: 20px; border-radius: 10px" />
        <div class="sk sk-line" style="width: 140px; height: 11px" />
      </div>
      <div class="sk sk-line" style="width: 160px; height: 36px; border-radius: 8px" />
    </div>
    <div class="sk sk-line mb-3" style="width: 140px; height: 9px" />
    <div class="sk-card pa-0">
      <div
        v-for="i in 4"
        :key="i"
        class="sk-table-row d-flex align-center justify-space-between"
      >
        <div class="sk sk-line" style="width: 130px; height: 13px" />
        <div class="sk sk-line" style="width: 80px; height: 13px" />
      </div>
    </div>
  </div>

  <div v-else class="page-wrapper">
    <div class="mb-5">
      <div class="text-h6 font-weight-bold" style="color: #e8edf5">Администрирование</div>
      <div class="text-body-2 mt-1" style="color: rgba(200, 208, 224, 0.45)">
        Управление торговой сессией
      </div>
    </div>

    <trading-session-form
      v-model="model"
      :market-state="marketState"
      :disabled="disabled"
      @save="save"
    />

    <div>
      <div class="section-title mb-3">Список пользователей</div>
      <div class="bank-card pa-0">
        <v-data-table
          :items="users"
          :headers="headers"
          density="comfortable"
          item-value="name"
          hide-default-footer
          hide-default-header
          select-strategy="single"
          return-object
          bg-color="transparent"
          class="admin-table"
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
import { User } from "@/entities/User";
import { TradingSession } from "@/entities/TradingSession";
import TradingSessionForm from "@/components/admin/TradingSessionForm.vue";

const router = useRouter();
const userService = ApiFactory.createUserService();
const tradingSessionService = ApiFactory.createTradingSessionService();

const loading = ref(true);
const users = ref<User[]>([]);
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
const marketState = ref<TradingSession | null>(null);
const snapshot = ref<string>("");

const model = ref<{ date: number[]; isTrading: boolean }>({
  date: [],
  isTrading: false,
});

const headers = [
  { title: "Пользователь", key: "name", width: "70%" },
  {
    title: "Баланс",
    key: "balance",
    align: "end" as const,
    value: (item: User) => `${formatMoneyAmount(item.currentBalance)} ₽`,
  },
];

onMounted(async () => {
  users.value = (await userService.getAll())
    .filter((v) => v.id !== userId)
    .map((v) => new User(v));
  await loadTradingSession();
  loading.value = false;
});

const disabled = computed(() => snapshot.value === JSON.stringify(model.value));

const onSelectUser = (_: MouseEvent, row: { item: User }) => {
  router.push(`/admin/user/${row.item.id}`);
};

const save = async () => {
  await tradingSessionService.updateStatus(
    TradingSession.fromTimestampObject(model.value),
  );
  await loadTradingSession();
};

const loadTradingSession = async () => {
  const loadedMarket = await tradingSessionService.getStatus();
  if (loadedMarket) {
    marketState.value = new TradingSession(loadedMarket);
    model.value = marketState.value.toTimestampObject();
  }
  snapshot.value = JSON.stringify(model.value);
};
</script>

<style scoped lang="scss">
.admin-table {
  :deep(.v-data-table__tr) {
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition: background 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: rgba(74, 159, 255, 0.05);
    }
  }

  :deep(.v-data-table__td) {
    padding: 12px 20px;
    color: #e8edf5;
    font-size: 14px;
  }
}
</style>
