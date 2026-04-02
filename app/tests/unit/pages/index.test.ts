import { en } from '<project-name>-i18n';
import { nuxtUiWrapper } from '@helpers/nuxt-ui-wrapper';
import ui from '@nuxt/ui/vue-plugin';
import { PiniaColada } from '@pinia/colada';
import { createTestingPinia } from '@pinia/testing';
import { cleanup, render, screen } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import Dashboard from '@/pages/index.vue';

describe('dashboard Page', () => {
  beforeEach(() => {
    render(nuxtUiWrapper(Dashboard), {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false }),
          createI18n({ messages: { en } }),
          PiniaColada,
          ui,
        ],
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the page', async () => {
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});
