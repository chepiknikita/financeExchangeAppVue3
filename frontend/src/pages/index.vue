<template>
  <div class="page-wrapper">
    <div class="page-content-title">
      <div class="text-h6">
        Список пользователей
      </div>
    </div>
    <div class="page-content-body">
      <div class="text-body-1 my-2 mx-4">
        Выберите пользователя для входа
      </div>
      <div
        v-if="loading"
        class="d-flex justify-center"
      >
        <v-skeleton-loader
          type="image"
          :width="600"
        />
      </div>
      <div
        v-else
        class="table-user"
      >
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
      <div class="text-body-2 my-2 mx-4">
        Проект разработан в учебных целях, для получения опыта работы на новых технологиях.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ApiFactory } from '@/api';
import { useRouter } from 'vue-router';
import { definePage } from 'vue-router/auto';
import { User } from '@/entities/User';
import { useUserStore } from '@/stores/useUserStore';

definePage({
  meta: {
    layout: 'auth',
  }
});

const loading = ref(true);
const router = useRouter();
const userStore = useUserStore();
const userService = ApiFactory.createUserService();
const users = ref<User[]>([]);

const headers = [
  {
    title: 'Пользователь',
    key: 'name',
    width: '50%',
  },
  {
    title: 'Логин',
    key: 'login',
    width: '20%',
    align: 'end' as const,
  },
  {
    title: 'Баланс',
    key: 'currentBalance',
    width: '30%',
    align: 'end' as const,
  },
];

onMounted(async () => {
  users.value = ((await userService.getAll()).map((u) => new User(u)));
  loading.value = false;
});

const onSelectUser = (_: MouseEvent, row: { item: User }) => {
  userStore.setUser(row.item.id, row.item.role);
  router.push(row.item.role);
};
</script>

<style scoped>
.table-user {
  width: 500px;
}
</style>