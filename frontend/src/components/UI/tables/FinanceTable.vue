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
          <div class="text-body-1 text-end text-cell">
            {{
              isTotal
                ? formatMoneyAmount((item.price * item.quantity || 0).toFixed(2))
                : formatMoneyAmount(item.price ?? 0)
            }}
            ₽
          </div>
          <div
            class="text-body-2 text-end text-cell"
            :class="{ 'growth': (isTotal ? item.totalProfit > 0 : item.profit > 0), 'fall': isTotal ? item.totalProfit < 0 : item.profit < 0}"
          >
            {{
              isTotal
                ? formatMoneyAmount(item.totalProfit.toFixed(2))
                : formatMoneyAmount(item.profit ?? 0)
            }}₽ |
            {{
              isTotal
                ? formatMoneyAmount((item.totalProfit/(item.price * item.quantity)*100).toFixed((0)))
                : formatMoneyAmount(((item.profit ?? 0)/(item.price) * 100).toFixed(0))
            }}%
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from "@/api/intarfaces/asset";
import { formatMoneyAmount } from "@/utilities/helpers";

withDefaults(
  defineProps<{
    items: Asset[];
    headers: unknown[];
    isTotal?: boolean;
  }>(),
  {
    isTotal: false,
  }
);

const emit = defineEmits(["click:row"]);

const onSelectRow = (event: MouseEvent, row: { item: unknown }) => {
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
