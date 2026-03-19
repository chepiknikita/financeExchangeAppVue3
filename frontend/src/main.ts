import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { createApp } from "vue";
import "./styles/index.scss";
import { useUserStore } from "@/stores/useUserStore";

const app = createApp(App);

registerPlugins(app);

useUserStore().loadFromStorage();

app.mount("#app");
