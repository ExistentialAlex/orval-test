import { nuxtUiWrapper } from '@helpers/nuxt-ui-wrapper';
import { $fetch } from '@mocks/fetch.mock';
import ui from '@nuxt/ui/vue-plugin';
import { PiniaColada } from '@pinia/colada';
import { createTestingPinia } from '@pinia/testing';
import { render, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { en } from '<project-name>-i18n';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouterMock } from 'vue-router-mock';
import App from '@/App.vue';

describe('app Test', () => {
  let container: Element;

  beforeEach(() => {
    $fetch.mockResolvedValueOnce({});
    const router = createRouterMock();

    const renderedComp = render(nuxtUiWrapper(App), {
      global: {
        plugins: [
          router,
          createTestingPinia({ stubActions: false }),
          PiniaColada,
          ui,
          createI18n({ messages: { en } }),
        ],
      },
    });

    container = renderedComp.container;
  });

  it('should render the app', async () => {
    expect(await screen.findByText('<project-name>')).toBeInTheDocument();
  });

  it('should display the login page', async () => {
    await flushPromises();
    await nextTick();

    expect(container.querySelector('router-view-stub')).toBeInTheDocument();
  });
});
