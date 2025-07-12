<template>
  <div class="line-chart border pa-2">
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { data as items, options as config } from './lineChartConfigs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const data = items;
const options = ref(config)
</script>

<style scoped>
.line-chart {
  margin: 8px auto 16px auto;
  max-width: 700px;
  height: 350px;
}
</style>