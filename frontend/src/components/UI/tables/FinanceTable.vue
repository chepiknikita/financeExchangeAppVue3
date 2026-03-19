<template>
  <div class="finance-table-wrapper bank-card pa-0">
    <v-data-table
      :items="items"
      :headers="headers"
      density="comfortable"
      item-value="name"
      hide-default-footer
      hide-default-header
      select-strategy="single"
      return-object
      bg-color="transparent"
      no-data-text="Данных нет"
      class="finance-table"
      @click:row="onSelectRow"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center py-1">
          <div
            class="asset-indicator mr-3"
            :class="item.getProfit() >= 0 ? 'asset-indicator--up' : 'asset-indicator--down'"
          />
          <div>
            <div class="asset-name text-body-1">
              {{ item.name ?? "" }}
            </div>
            <div class="asset-qty text-body-2">
              {{ formatMoneyAmount(item.quantity ?? 0) }} шт
            </div>
          </div>
        </div>
      </template>

      <template v-slot:item.price="{ item }">
        <div class="text-right py-1">
          <div
            class="asset-price text-body-1"
            :class="{ 'asset-price--inactive': !tradingStatus }"
          >
            {{
              isTotal
                ? formatMoneyAmount((item.price * item.quantity || 0))
                : formatMoneyAmount(item.price)
            }}
            ₽
          </div>
          <div
            class="asset-profit text-body-2 d-flex align-center justify-end gap-1"
            :class="{
              'growth': !tradingStatus ? false : (isTotal ? item.getTotalProfit() > 0 : item.getProfit() > 0),
              'fall': !tradingStatus ? false : (isTotal ? item.getTotalProfit() < 0 : item.getProfit() < 0),
              'blocker': !tradingStatus,
            }"
          >
            <v-icon
              v-if="tradingStatus"
              :icon="(isTotal ? item.getTotalProfit() : item.getProfit()) > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
              size="12"
            />
            {{
              isTotal
                ? Asset.getFormatMoney(item.getTotalProfit())
                : Asset.getFormatMoney(item.getProfit())
            }}₽
            |
            {{
              isTotal
                ? Asset.getFormatMoney(item.price * item.quantity !== 0 ? (item.getTotalProfit() / (item.price * item.quantity) * 100) : 0)
                : Asset.getFormatMoney(item.getProfitPercent())
            }}%
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { Asset } from "@/entities/Asset";
import { formatMoneyAmount } from "@/utilities/helpers";

interface TableHeader {
  title?: string;
  key: string;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
}

withDefaults(
  defineProps<{
    items: Asset[];
    headers: TableHeader[];
    isTotal?: boolean;
    tradingStatus?: boolean;
  }>(),
  {
    isTotal: false,
    tradingStatus: false,
  }
);

const emit = defineEmits(["click:row"]);

const onSelectRow = (_: MouseEvent, row: { item: unknown }) => {
  emit("click:row", row.item);
};
</script>

<style lang="scss" scoped>
.finance-table-wrapper {
  overflow: hidden;
}

.finance-table {
  :deep(.v-data-table__tr) {
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition: background 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: rgba(74, 159, 255, 0.05);
    }
  }

  :deep(.v-data-table__td) {
    padding: 4px 16px;
  }
}

.asset-indicator {
  width: 3px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;

  &--up {
    background: #00C896;
  }

  &--down {
    background: #FF4D6A;
  }
}

.asset-name {
  color: #E8EDF5;
  font-weight: 500;
  max-width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.asset-qty {
  color: rgba(200, 208, 224, 0.45);
  max-width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.asset-price {
  color: #E8EDF5;
  font-weight: 500;

  &--inactive {
    color: rgba(200, 208, 224, 0.3);
  }
}

.asset-profit {
  font-size: 12px;
  white-space: nowrap;
}
</style>
