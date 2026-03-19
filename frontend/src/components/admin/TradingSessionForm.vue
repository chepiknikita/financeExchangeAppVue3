<template>
  <div class="bank-card mb-4">
    <div class="section-title mb-4">Контроль торгов</div>

    <div class="d-flex align-center justify-space-between mb-3">
      <span class="form-label">Статус биржи</span>
      <span
        class="status-badge"
        :class="marketState?.isTrading ? 'status-badge--active' : 'status-badge--inactive'"
      >
        <span class="status-dot" />
        {{ marketState?.isTrading ? 'Торги идут' : 'Торги остановлены' }}
      </span>
    </div>

    <div class="form-label mb-2">Период работы</div>
    <VueDatePicker
      :model-value="modelValue.date"
      range
      locale="ru"
      format="dd.MM.yyyy HH:mm"
      select-text="Выбрать"
      cancel-text="Отмена"
      :clearable="false"
      :style="{ width: '100%', maxWidth: '380px' }"
      :dark="true"
      :format-locale="ru"
      :teleport="true"
      class="mb-3"
      @update:model-value="emit('update:modelValue', { ...modelValue, date: $event })"
    />

    <div class="d-flex align-center gap-3 mb-3">
      <v-switch
        :model-value="modelValue.isTrading"
        hide-details
        color="success"
        density="compact"
        @update:model-value="emit('update:modelValue', { ...modelValue, isTrading: !!$event })"
      />
      <span class="form-label">
        {{ modelValue.isTrading ? 'Торги будут запущены' : 'Торги будут остановлены' }}
      </span>
    </div>

    <v-btn
      variant="tonal"
      color="primary"
      class="text-none"
      :disabled="disabled"
      prepend-icon="mdi-check"
      @click="emit('save')"
    >
      Применить изменения
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ru } from 'date-fns/locale';
import type { TradingSession } from '@/entities/TradingSession';

defineProps<{
  modelValue: { date: number[]; isTrading: boolean };
  marketState: TradingSession | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: { date: number[]; isTrading: boolean }];
  'save': [];
}>();
</script>

<style scoped lang="scss">
.form-label {
  font-size: 13px;
  color: rgba(200, 208, 224, 0.5);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;

  &--active {
    background: rgba(0, 200, 150, 0.12);
    color: #00c896;

    .status-dot { background: #00c896; }
  }

  &--inactive {
    background: rgba(200, 208, 224, 0.08);
    color: rgba(200, 208, 224, 0.4);

    .status-dot { background: rgba(200, 208, 224, 0.4); }
  }
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
</style>
