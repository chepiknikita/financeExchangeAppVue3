<template>
  <div class="page-content-body font-size-14">
    <div>
      <v-text-field
        v-model="quantity"
        width="250px"
        density="compact"
        hide-spin-buttons
        type="number"
        placeholder="Количество"
        variant="outlined"
        class="text-none"
        min="0"
        @keypress="validateKey"
        @paste="handlePaste"
      />
    </div>
    <div>
      <v-text-field
        v-model="price"
        width="250px"
        density="compact"
        hide-spin-buttons
        type="number"
        placeholder="Цена"
        variant="outlined"
        :disabled="true"
      />
    </div>
    <v-btn
      variant="tonal"
      width="250px"
      color="#ccc"
      class="text-none my-1 mx-2"
      :disabled="!(quantity && traidingStatus)"
      @click="emit('onOrder')"
    >
      {{ btnTitile }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['onOrder']);

const props = withDefaults(
  defineProps<{
    status: 'SELL' | 'BUY',
    traidingStatus: boolean | undefined;
  }>(),
  {
    traidingStatus: false,
  }
);

const price = defineModel<number | undefined>("price", { required: true });
const quantity = defineModel<string>("quantity", { default: "" });

const btnTitile = props.status === "SELL" ? "Продать" : "Купить";

const validateKey = (event: KeyboardEvent): void => {
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const handlePaste = (event: ClipboardEvent): void => {
  const pastedText = event.clipboardData?.getData('text') || ''
  
  if (!/^\d+$/.test(pastedText)) {
    event.preventDefault()
  }
}
</script>

<style scoped></style>