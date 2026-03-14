<template>
  <div class="finance-table">
    <v-data-table
      :items="items"
      :headers="headers"
      density="compact"
      item-value="name"
      hide-default-footer
      hide-default-header
      hover
      select-strategy="single"
      return-object
      no-data-text="Данных нет"
      @click:row="onSelectRow"
    >
      <template v-slot:item.name="{ item }">
        <div class="ma-2">
          <div class="text-body-1 text-cell">
            {{ item.name ?? "" }}
          </div>
          <div class="text-body-2 text-disabled text-cell">
            {{ formatMoneyAmount(item.quantity ?? 0) }} шт
          </div>
        </div>
      </template>
      <template v-slot:item.price="{ item }">
        <div class="ma-2">
          <div
            class="text-body-1 text-end text-cell"
            :class="{ 'blocker': !tradingStatus }"
          >
            {{
              isTotal
                ? formatMoneyAmount((item.price * item.quantity || 0))
                : formatMoneyAmount(item.price)
            }}
            ₽
          </div>
          <div
            class="text-body-2 text-end text-cell"
            :class="{
              'growth': (isTotal ? item.getTotalProfit() > 0 : item.getProfit() > 0),
              'fall': isTotal ? item.getTotalProfit() < 0 : item.getProfit() < 0,
              'blocker': !tradingStatus}"
          >
            {{
              isTotal
                ? Asset.getFormatMoney(item.getTotalProfit())
                : Asset.getFormatMoney(item.getProfit())
            }}₽ |
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
.finance-table {
  width: 700px;
}

.text-cell {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
