<template>
  <div class="mb-2">Доступные средства:
    <span class="text-h6">
      {{ formatMoneyAmount(balance) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyAmount } from "@/utilities/helpers";

withDefaults(
  defineProps<{
    balance: number;
  }>(),
  {
    balance: 0,
  }
);
</script>

<style scoped></style>