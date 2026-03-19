<template>
  <div class="auth-page">
    <div class="auth-bg" />

    <div class="auth-container d-flex align-center justify-center">
      <div class="auth-card">
        <div class="d-flex flex-column align-center mb-6">
          <div class="brand-icon mb-3">
            <v-icon icon="mdi-chart-line" color="primary" size="36" />
          </div>
          <div class="text-h5 font-weight-bold gradient-text mb-1">FinEx</div>
          <div class="text-body-2" style="color: rgba(200, 208, 224, 0.5)">
            Торговая платформа
          </div>
        </div>

        <div class="section-title text-center mb-4">Выберите профиль</div>

        <div v-if="loading" class="d-flex flex-column gap-2">
          <div
            v-for="i in 3"
            :key="i"
            class="sk-user-row d-flex align-center gap-3"
          >
            <div class="sk sk-avatar" />
            <div class="sk-user-text">
              <div class="sk sk-line sk-line--name" />
              <div class="sk sk-line sk-line--sub mt-1" />
            </div>
            <div class="sk-user-right ml-auto">
              <div class="sk sk-line sk-line--balance" />
              <div class="sk sk-line sk-line--badge mt-1" />
            </div>
          </div>
        </div>

        <v-list v-else bg-color="transparent" class="user-list pa-0">
          <v-list-item
            v-for="user in users"
            :key="user.id"
            class="user-item rounded-lg mb-2"
            :style="{ minHeight: '60px' }"
            :ripple="true"
            @click="onSelectUser(user)"
          >
            <template #prepend>
              <v-avatar
                class="user-avatar"
                size="40"
                :color="getAvatarColor(user.name)"
              >
                <span class="text-body-2 font-weight-bold">{{ getInitials(user.name) }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="user-name font-weight-medium">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="user-login">
              {{ user.login }}
            </v-list-item-subtitle>

            <template #append>
              <div class="text-right">
                <div class="user-balance font-weight-semibold">
                  {{ formatMoneyAmount(user.currentBalance) }} ₽
                </div>
                <div class="user-role-badge" :class="user.role === 'ADMIN' ? 'user-role-badge--admin' : 'user-role-badge--user'">
                  {{ user.role === 'ADMIN' ? 'Admin' : 'User' }}
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <div class="disclaimer mt-4 text-center">
          Проект разработан в учебных целях
        </div>
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
import { formatMoneyAmount } from '@/utilities/helpers';

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

const avatarColors = ['#3D7EFF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

const getInitials = (name: string) => {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
};

onMounted(async () => {
  users.value = ((await userService.getAll()).map((u) => new User(u)));
  loading.value = false;
});

const onSelectUser = (user: User) => {
  userStore.setUser(user.id, user.role);
  router.push(user.role.toLowerCase() === 'admin' ? '/admin' : '/user');
};
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.auth-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% -10%, rgba(74, 159, 255, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0, 212, 170, 0.07) 0%, transparent 50%),
    #0B0F1A;
  pointer-events: none;
  z-index: 0;
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 24px;

  @media (max-width: 599px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #141A2E;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 32px 28px;

  @media (max-width: 599px) {
    padding: 24px 16px;
    border-radius: 16px;
  }
}

.brand-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(74, 159, 255, 0.15), rgba(0, 212, 170, 0.1));
  border: 1px solid rgba(74, 159, 255, 0.2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-list {
  :deep(.user-item.v-list-item) {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.18s ease;
    padding: 10px 14px;
  }

  :deep(.user-item.v-list-item:hover) {
    background: rgba(74, 159, 255, 0.07);
    border-color: rgba(74, 159, 255, 0.2);
  }

  :deep(.user-item .v-list-item-subtitle) {
    color: rgba(200, 208, 224, 0.45);
  }
}

.sk-user-row {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  min-height: 60px;
}

.sk.sk-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sk-user-text {
  flex: 1;
  min-width: 0;
}

.sk-user-right {
  text-align: right;
}

.sk-line {
  height: 10px;

  &--name    { width: 120px; }
  &--sub     { width: 72px; height: 8px; }
  &--balance { width: 80px; }
  &--badge   { width: 36px; height: 8px; margin-left: auto; }
}

.user-name {
  font-size: 14px;
  color: #E8EDF5;
}

.user-balance {
  font-size: 13px;
  color: #E8EDF5;
}

.user-role-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  text-align: center;

  &--user {
    background: rgba(74, 159, 255, 0.12);
    color: #4A9FFF;
  }

  &--admin {
    background: rgba(0, 212, 170, 0.12);
    color: #00D4AA;
  }
}

.disclaimer {
  font-size: 11px;
  color: rgba(200, 208, 224, 0.3);
}
</style>
