import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const app = createApp(App);
const pinia = createPinia();

const savedLocale = localStorage.getItem('locale') || 'en';

app.use(pinia);
app.use(router);
app.use(i18nPlugin, { locale: savedLocale, messages: { en, es, fr, de } });

app.mount('#app');
