// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { ru } from "vuetify/locale";

export default createVuetify({
  theme: {
    defaultTheme: "finexDark",
    themes: {
      finexDark: {
        dark: true,
        colors: {
          background: "#0B0F1A",
          surface: "#141A2E",
          "surface-variant": "#1E2D4A",
          primary: "#4A9FFF",
          "primary-darken-1": "#2E7DD4",
          secondary: "#00D4AA",
          "secondary-darken-1": "#00A886",
          success: "#00C896",
          error: "#FF4D6A",
          warning: "#FFB74D",
          info: "#4A9FFF",
          "on-background": "#E8EDF5",
          "on-surface": "#C8D0E0",
          "on-primary": "#FFFFFF",
          "on-secondary": "#0B0F1A",
          "on-success": "#0B0F1A",
          "on-error": "#FFFFFF",
        },
      },
    },
  },
  locale: {
    locale: "ru",
    messages: { ru },
  },
});
