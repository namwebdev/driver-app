import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/index.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus);
app.use(router);

app.mount("#app");

app.config.globalProperties.$filter = {
  formatDate(val) {
    const date = new Date(val);
    return (
      date.toLocaleTimeString("vi", {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " - " +
      date.toLocaleDateString("vi", {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      })
    );
  },
};
