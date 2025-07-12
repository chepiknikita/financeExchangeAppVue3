export const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      borderColor: '#4f46e5',
      tension: 0.4,
      data: [40, 39, 10, 40, 39, 80, 40],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // Полупрозрачная заливка
    },
  ],
};

export const options = {
  type: 'line',
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#fff', // Цвет текста на оси X
      },
      // grid: {
      //   color: 'rgba(255, 255, 255, 0.3)',
      // },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#fff',
      },
      // grid: {
      //   color: 'rgba(255, 255, 255, 0.3)', // Цвет сетки оси Y
      // },
    },
  },
};
