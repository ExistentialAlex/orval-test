import type { VueWrapper } from '@vue/test-utils';
import type { UserSession } from '<project-name>-types';
import { $fetch, createMockFetchInstance } from '@mocks/fetch.mock';
import ui from '@nuxt/ui/vue-plugin';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { FetchError } from 'ofetch';
import { en } from '<project-name>-i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { getRouter } from 'vue-router-mock';
import LoginView from '@/pages/login.vue';

const { setupFetchResponses } = createMockFetchInstance({
  '/auth/login': {
    POST: {},
  },
  '/session': {} as UserSession,
});

describe('login Page', () => {
  let wrapper: VueWrapper<InstanceType<typeof LoginView>>;

  beforeEach(() => {
    wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia(), ui, createI18n({ messages: { en } })],
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the login form', () => {
    // Arrange
    const form = wrapper.find('form');

    // Assert
    expect(form.exists()).toBe(true);
  });

  it('should call login method on form submit', async () => {
    // Arrange
    setupFetchResponses({
      '/session': {
        user: { email: 'admin@admin.com', name: 'Test User', company: 'Test Company' },
      },
    });
    const form = wrapper.find('form');
    const email = wrapper.find('[data-testid="login-form:email"]');
    const organisation = wrapper.findComponent({ name: 'Select' });

    // Act
    await email.setValue('admin@admin.com');
    await organisation.vm.$emit('update:model-value', 'Organisation A');
    await form.trigger('submit.prevent');
    await flushPromises();

    // Assert
    expect($fetch).toHaveBeenCalledWith('/auth/login', {
      body: { email: 'admin@admin.com', organisation: 'Organisation A' },
      method: 'POST',
    });
    expect(getRouter().push).toHaveBeenCalledWith('/');
  });

  it('should show an error message on login failure', async () => {
    // Arrange
    $fetch.mockRejectedValueOnce(new FetchError('test error'));
    const form = wrapper.find('form');
    const email = wrapper.find('[data-testid="login-form:email"]');
    const organisation = wrapper.findComponent({ name: 'Select' });

    // Act
    await email.setValue('admin@admin.com');
    await organisation.vm.$emit('update:model-value', 'Organisation A');
    await form.trigger('submit.prevent');
    await flushPromises();

    // Assert
    expect(getRouter().push).not.toHaveBeenCalled();
  });
});
