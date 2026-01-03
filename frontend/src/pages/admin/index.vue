<template>
  <div class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">Контроль торгов</div>
      <div class="text-center growth">
        <div>Информация</div>
        <div>Статус биржы: {{ status }} </div>
        <div>
          <div> Период работы:</div>
          <div>{{ exchangePeriod }}</div>
        </div>
      </div>
      <div>
        <v-btn
          variant="tonal"
          class="my-2 text-none mx-2"
          @click="onEdit"
        >
          Редактировать
        </v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        max-width="500"
      >
        <v-confirm-edit
          ref="confirm"
          v-model="model"
          ok-text="Применить"
          @save="save"
          @cancel="dialog = false"
        >
          <template v-slot:default="{ model: proxyModel, actions }">
            <v-card title="Редактирование данных биржы">
              <v-card-text>
                <v-switch
                  v-model="proxyModel.value.isTrading"
                  label="Статус биржы"
                  hide-details
                />
                <VueDatePicker
                  v-model="proxyModel.value.date"
                  range
                  locale="ru"
                  format="dd.MM.yyyy HH:mm"
                  select-text="Выбрать"
                  cancel-text="Отмена"
                  :dark="true"
                  :format-locale="ru"
                  :teleport="true"
                />
              </v-card-text>
              <template v-slot:actions>
                <v-spacer />
                <component :is="actions" />
              </template>
            </v-card>
          </template>
        </v-confirm-edit>
      </v-dialog>
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
import type { User } from "@/api/intarfaces/user";
import type { ExchangeInfo } from "@/api/intarfaces/exchange";
import { ru } from 'date-fns/locale';

const router = useRouter();
const userService = ApiFactory.createUserService();
const exchangeService = ApiFactory.createExchangeService();

const users = ref<User[]>([]);
const userId = JSON.parse(atob(sessionStorage.getItem("user") ?? ""))?.id;
const exchangeStatus = ref<ExchangeInfo | null>(null);

const headers = [
  { title: "Пользователь", key: "name", width: "70%" },
  {
    title: "Баланс",
    key: "balance",
    align: "end",
    value: (item: User) => `${formatMoneyAmount(item.balance)} ₽`,
  },
];

const dialog = ref(false);
const model = ref<{ isTrading: boolean, date: number[] }>({
  isTrading: false,
  date: [],
});

onMounted(async () => {
  users.value = (await userService.getAll()).filter((v) => v.id !== userId);
  await loadExchangeStatus();
});

const status = computed(() => {
  return exchangeStatus.value?.isTrading ? 'идут торги' : 'торги остановлены';
});

const exchangePeriod = computed(() => {
  if (exchangeStatus.value?.start && exchangeStatus.value?.end) {
    const start = new Date(exchangeStatus.value.start).toLocaleString();
    const end = new Date(exchangeStatus.value.end).toLocaleString();
    return `${start} -  ${end}`;
  }
  return 'Данные отсутствуют';
});

const onSelectUser = (event: MouseEvent, row: { item: User }) => {
  router.push(`/admin/user/${row.item.id}`);
};

const onEdit = () => {
  dialog.value = true;
}

const save = async () => {
  dialog.value = false;
  await exchangeService.updateStatus({
    start: model.value.date[0],
    end: model.value.date[1],
    isTrading: model.value.isTrading,
  });
  await loadExchangeStatus();
}

const loadExchangeStatus = async () => {
  exchangeStatus.value = await exchangeService.getStatus();
  if (exchangeStatus.value?.start && exchangeStatus.value?.end) {
    model.value.date = [exchangeStatus.value.start, exchangeStatus.value?.end];
    model.value.isTrading = exchangeStatus.value.isTrading;
  }
}
</script>

<style scoped></style>
