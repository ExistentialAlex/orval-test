import ui from '@nuxt/ui/vue-plugin';

import { PiniaColada } from '@pinia/colada';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import z from 'zod';
import App from './App.vue';
import { i18n } from './core/i18n';
import router from './router';
import './assets/main.css';
import './core/config';

const app = createApp(App);

app.use(createPinia());
app.use(PiniaColada);
app.use(router);
app.use(ui);
app.use(i18n);

z.config({
  customError: (issue) => {
    const params = issue.params as { i18n: string; i18nParams?: Record<string, unknown> };

    if (!params?.i18n) {
      return issue.message;
    }

    return i18n.global.t(params.i18n, params.i18nParams || {});
  },
});

app.mount('#app');
