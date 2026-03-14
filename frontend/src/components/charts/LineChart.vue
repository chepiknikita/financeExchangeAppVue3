<template>
  <div class="line-chart border pa-2">
    <Line :data="payload" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type TooltipItem,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { PriceHistory } from '@/entities/Asset';
import 'chartjs-adapter-date-fns'
import { ru } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const props = withDefaults(
  defineProps<{
    priceHistory: PriceHistory[];
  }>(),
  {
    priceHistory: () => [],
  }
);

const chartKey = ref(0);
const xAxisRange = ref<{ min: number; max: number } | null>(null);

watch(() => props.priceHistory, (newData) => {
  if (newData.length > 0 && !xAxisRange.value) {
    const timestamps = newData.map(v => new Date(v.timestamp).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    const range = maxTime - minTime;
    xAxisRange.value = {
      min: minTime - range * 0.1,
      max: maxTime + range * 0.1
    };
  }
}, { immediate: true });

watch(() => props.priceHistory, () => {
  nextTick(() => {
    chartKey.value += 1;
  });
}, { deep: true });

const payload = computed(() => {
  const chartData = props.priceHistory.map((v) => ({
    x: new Date(v.timestamp).getTime(),
    y: v.price
  }));

  return {
    datasets: [
      {
        label: 'Цена',
        borderColor: '#4f46e5',
        tension: 0.4,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        data: chartData,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: false
      }
    ]
  };
});

const options = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: { day: 'dd.MM.yyyy', week: 'dd.MM.yyyy' },
          tooltipFormat: 'dd.MM.yyyy HH:mm',
        },
        adapters: {
          date: {
            locale: ru
          }
        },
        min: xAxisRange.value?.min,
        max: xAxisRange.value?.max,
        ticks: {
          font: {
            size: 10,
          },
          source: 'data' as const,
          autoSkip: true,
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        }
      },
      y: {
        beginAtZero: false,
        position: 'right' as const,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'nearest' as const,
        intersect: false,
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: (context: TooltipItem<'line'>) => {
            return `Цена: ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      line: {
        tension: 0.1
      }
    },
    animation: {
      duration: 0
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    }
  };
});
</script>

<style scoped>
.line-chart {
  margin: 8px auto 16px auto;
  max-width: 700px;
  height: 350px;
}
</style>