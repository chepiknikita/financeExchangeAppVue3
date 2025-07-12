<template>
  <v-main>
    <app-header />
    <router-view />
    <AppFooter />
  </v-main>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>
