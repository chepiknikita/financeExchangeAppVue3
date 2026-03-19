<template>
  <v-app-bar
    class="app-header px-4"
    :elevation="0"
    height="64"
    :style="{
      background: 'rgba(11, 15, 26, 0.92)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }"
  >
    <div class="header-logo d-flex align-center">
      <v-icon icon="mdi-chart-line" color="primary" size="26" class="mr-2" />
      <span class="logo-text gradient-text">FinEx</span>
    </div>

    <v-spacer />

    <nav v-if="!mobile" class="nav-pills d-flex align-center gap-1">
      <v-btn
        v-for="item in barItems"
        :key="item.name"
        :to="item.path"
        :active="item.path === $route.path"
        variant="text"
        class="nav-btn text-none"
        :class="{ 'nav-btn--active': item.path === $route.path }"
        size="small"
        :height="34"
      >
        <v-icon v-if="item.icon" :icon="item.icon" size="16" class="mr-1" />
        {{ item.name }}
      </v-btn>
    </nav>

    <v-spacer />

    <div class="d-flex align-center gap-2">
      <v-btn
        v-for="item in additionalItems"
        :key="item.name"
        :to="item.path"
        variant="outlined"
        class="text-none exit-btn"
        size="small"
        :height="34"
      >
        <v-icon icon="mdi-logout-variant" size="16" :class="mobile ? '' : 'mr-1'" />
        <span v-if="!mobile">{{ item.name }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/useUserStore';
import { navUser, navAdmin } from '@/config/navigation';

const userStore = useUserStore();
const { mobile } = useDisplay();

const additionalItems = [
  { name: 'Выйти', path: '/' },
];

const barItems = computed(() => userStore.role === 'USER' ? navUser : navAdmin);
</script>

<style scoped lang="scss">
.app-header {
  backdrop-filter: blur(12px);
}

.header-logo {
  min-width: 100px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-pills {
  gap: 4px;
}

.nav-btn.v-btn {
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  color: rgba(200, 208, 224, 0.65);
  transition: all 0.2s ease;
}

.nav-btn.v-btn:hover {
  color: #E8EDF5;
  background: rgba(74, 159, 255, 0.08);
}

.nav-btn.v-btn--active {
  color: #4A9FFF;
  background: rgba(74, 159, 255, 0.12);
}

.exit-btn.v-btn {
  border-radius: 8px;
  font-size: 13px;
  border-color: rgba(74, 159, 255, 0.3);
  color: rgba(74, 159, 255, 0.8);
}

.exit-btn.v-btn:hover {
  border-color: rgba(74, 159, 255, 0.6);
  color: #4A9FFF;
  background: rgba(74, 159, 255, 0.08);
}
</style>
