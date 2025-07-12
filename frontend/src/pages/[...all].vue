<template>
  <div class="text-center my-2">Такой страницы не существует!</div>
</template>

<script setup lang="ts">
import { definePage } from "vue-router/auto";

definePage({
  meta: {
    layout: "auth",
  },
});
</script>

<style scoped></style>
