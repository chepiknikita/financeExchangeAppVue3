<template>
  <v-app-bar
    class="px-2"
    :elevation="2"
  >
    <v-list class="nav-list">
      <v-list-item
        v-for="item in barItmes"
        :key="item.name"
        class="nav-item"
        height="30"
        density="compact"
        :active="item.path === $route.path"
        :title="item.name"
        :to="item.path"
      />
    </v-list>
    <v-spacer />
    <v-list class="nav-list">
      <v-list-item
        v-for="item in additionalItems"
        :key="item.name"
        class="nav-item"
        height="30"
        density="compact"
        :active="item.path === $route.path"
        :title="item.name"
        :to="item.path"
      />
    </v-list>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const role = JSON.parse(atob(sessionStorage.getItem('user') ?? ''))?.role;

const pathsUser = [
  {
    name: 'Главная',
    path: '/user',
  },
  {
    name: 'Биржа',
    path: '/assets',
  }
];

const pathsAdmin = [
  {
    name: 'Администрирование',
    path: `/admin`,
  },
];

const additionalItems = [
  {
    name: 'Выйти',
    path: '/',
  }
];

const barItmes = computed(() => role === 'user' ? pathsUser : pathsAdmin);
</script>

<style scoped>
.nav-list {
  display: flex;
  align-items: center;
}
</style>