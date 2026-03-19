<template>
  <v-main>
    <app-header />
    <router-view />
    <AppFooter />
    <AppBottomNav />
  </v-main>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppBottomNav from '@/components/AppBottomNav.vue';
</script>
