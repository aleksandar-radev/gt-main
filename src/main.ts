import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n';
import en from './locales/en.json';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18nPlugin, { locale: 'en', messages: { en } });

app.mount('#app');
