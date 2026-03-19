<template>
  <v-footer
    v-if="!mobile"
    class="app-footer"
    height="44"
    app
    :style="{
      background: 'rgba(11, 15, 26, 0.85)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '0 24px',
    }"
  >
    <div class="footer-inner d-flex align-center justify-space-between w-100">
      <div class="d-flex align-center gap-2">
        <a
          v-for="item in items"
          :key="item.title"
          :href="item.href"
          :title="item.title"
          class="social-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <v-icon :icon="item.icon" size="18" />
        </a>
      </div>

      <div class="footer-copy text-caption">
        &copy; 2025 Nikita Chepik
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const items = [
  {
    title: "Nikita Chepik Telegram",
    icon: "mdi-telegram",
    href: "https://t.me/",
  },
  {
    title: "Nikita Chepik GitHub",
    icon: "mdi-github",
    href: "https://github.com/",
  },
  {
    title: "Nikita Chepik Instagram",
    icon: "mdi-instagram",
    href: "https://instagram.com/",
  },
];
</script>

<style scoped lang="scss">
.app-footer {
  backdrop-filter: blur(8px);
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(200, 208, 224, 0.35);
  transition: color 0.2s ease;
  text-decoration: none;

  &:hover {
    color: #4A9FFF;
  }
}

.footer-copy {
  color: rgba(200, 208, 224, 0.3);
  font-size: 11px;
}
</style>
