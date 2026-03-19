<template>
  <div class="balance-gradient mb-3">
    <div class="d-flex align-start justify-space-between">
      <div class="balance-left">
        <div class="balance-label">Общий баланс</div>
        <div class="balance-amount mt-1">
          {{ getTotalBalance() }}<span class="balance-currency"> ₽</span>
        </div>
        <div class="d-flex align-center mt-2 gap-2">
          <span
            class="profit-badge"
            :class="{
              'profit-badge--growth': userProfit > 0,
              'profit-badge--fall': userProfit < 0,
              'profit-badge--neutral': userProfit === 0,
            }"
          >
            <v-icon
              :icon="userProfit > 0 ? 'mdi-trending-up' : userProfit < 0 ? 'mdi-trending-down' : 'mdi-minus'"
              size="13"
            />
            {{ userProfit > 0 ? '+' : '' }}{{ userProfit }}%
          </span>
          <span class="balance-sublabel">доходность</span>
        </div>
      </div>

      <div class="balance-icon-wrap">
        <v-icon icon="mdi-wallet" size="22" color="primary" />
      </div>
    </div>

    <div class="balance-divider my-3" />

    <div class="d-flex gap-4">
      <div class="balance-stat">
        <div class="balance-stat__label">Кэш</div>
        <div class="balance-stat__value">{{ getCashBalance() }} ₽</div>
      </div>
      <div class="balance-stat-divider" />
      <div class="balance-stat">
        <div class="balance-stat__label">В активах</div>
        <div class="balance-stat__value">{{ getAssetsBalance() }} ₽</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatMoneyAmount } from "@/utilities/helpers";
import type { User } from '@/entities/User';

const props = withDefaults(
  defineProps<{
    user: User | null;
  }>(),
  { user: null }
);

const userProfit = computed(() => {
  return +(props.user?.calculateProfitPercentage().toFixed(2) ?? 0);
});

const getTotalBalance = () => {
  const total = props.user?.calculateTotalBalance().toFixed(2) ?? 0;
  return formatMoneyAmount(total);
};

const getCashBalance = () => {
  return formatMoneyAmount(+(props.user?.currentBalance ?? 0).toFixed(2));
};

const getAssetsBalance = () => {
  const total = props.user?.calculateTotalBalance() ?? 0;
  const cash = props.user?.currentBalance ?? 0;
  return formatMoneyAmount(+(total - cash).toFixed(2));
};
</script>

<style scoped lang="scss">
.balance-left {
  flex: 1;
  min-width: 0;
}

.balance-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(200, 208, 224, 0.45);
}

.balance-amount {
  font-size: 28px;
  font-weight: 700;
  color: #E8EDF5;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.balance-currency {
  font-size: 16px;
  font-weight: 500;
  color: rgba(200, 208, 224, 0.55);
}

.balance-sublabel {
  font-size: 11px;
  color: rgba(200, 208, 224, 0.35);
}

.balance-icon-wrap {
  width: 40px;
  height: 40px;
  background: rgba(74, 159, 255, 0.12);
  border: 1px solid rgba(74, 159, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.balance-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}

.balance-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(200, 208, 224, 0.35);
  }

  &__value {
    font-size: 13px;
    font-weight: 600;
    color: rgba(200, 208, 224, 0.75);
  }
}

.balance-stat-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.07);
  align-self: stretch;
}
</style>
