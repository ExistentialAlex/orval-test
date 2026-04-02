import type { RenderOptions } from '@testing-library/vue';
import type { Component } from 'vue';
import { en } from '<project-name>-i18n';
import ui from '@nuxt/ui/vue-plugin';
import { PiniaColada } from '@pinia/colada';
import { createTestingPinia } from '@pinia/testing';
import { render } from '@testing-library/vue';
import defu from 'defu';
import { createI18n } from 'vue-i18n';
import { nuxtUiWrapper } from './nuxt-ui-wrapper';

export const renderUI = <T extends Component>(page: T, options?: RenderOptions<T>) => {
  const i18n = createI18n({ messages: { en } });

  const opts = defu(options, {
    global: {
      plugins: [createTestingPinia({ stubActions: false }), PiniaColada, i18n, ui],
    },
  });

  return { i18n, ...render(nuxtUiWrapper(page), opts) };
};
