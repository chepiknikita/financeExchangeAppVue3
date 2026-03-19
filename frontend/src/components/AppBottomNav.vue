<template>
  <v-bottom-navigation
    v-if="mobile"
    app
    :elevation="0"
    :height="60"
    active-color="#4A9FFF"
    class="bottom-nav"
    :model-value="activeTab"
    :style="{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }"
  >
    <v-btn
      v-for="item in barItems"
      :key="item.path"
      :to="item.path"
      :value="item.path"
      class="bottom-nav-btn"
    >
      <v-icon :icon="item.icon" size="22" />
      <span class="bottom-nav-label">{{ item.shortName ?? item.name }}</span>
    </v-btn>

    <v-btn
      to="/"
      value="/"
      class="bottom-nav-btn bottom-nav-btn--exit"
    >
      <v-icon icon="mdi-logout-variant" size="22" />
      <span class="bottom-nav-label">Выйти</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/useUserStore';
import { navUser, navAdmin } from '@/config/navigation';

const { mobile } = useDisplay();
const route = useRoute();
const userStore = useUserStore();

const barItems = computed(() => userStore.role === 'USER' ? navUser : navAdmin);

const activeTab = computed(() => {
  const matched = barItems.value.find(item => route.path.startsWith(item.path));
  return matched?.path ?? route.path;
});
</script>

<style scoped lang="scss">
.bottom-nav {
  background: rgba(11, 15, 26, 0.96);
  backdrop-filter: blur(16px);
}

.bottom-nav-btn {
  flex: 1;
  color: rgba(200, 208, 224, 0.45);
  transition: color 0.18s ease;
}

.bottom-nav-btn--exit.v-btn--active {
  color: rgba(200, 208, 224, 0.45);
}

.bottom-nav-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-top: 2px;
  display: block;
}
</style>
