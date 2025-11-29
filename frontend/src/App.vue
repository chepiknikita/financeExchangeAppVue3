<template>
  <v-app class="w-100">
    <router-view />
    <app-notifications />
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style>
/* Глобальные стили для правильного позиционирования */
/* .v-application { */
  /* position: relative; */
/* } */

/* Убедимся что уведомления поверх диалогов и других элементов */
/* .v-overlay-container {
  position: relative;
  z-index: 1000;
} */
</style>