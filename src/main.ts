import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { create, NMessageProvider } from 'naive-ui';

const naive = create({
  components: [NMessageProvider],
})
const app = createApp(App);
const pinia = createPinia();

app.use(naive);
app.use(pinia);
app.use(router);
app.mount('#app');