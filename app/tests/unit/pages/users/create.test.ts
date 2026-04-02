import { en } from '<project-name>-i18n';
import { nuxtUiWrapper } from '@helpers/nuxt-ui-wrapper';
import { $fetch, createMockFetchInstance } from '@mocks/fetch.mock';
import ui from '@nuxt/ui/vue-plugin';
import { PiniaColada } from '@pinia/colada';
import { createTestingPinia } from '@pinia/testing';
import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { createRouterMock, getRouter, injectRouterMock } from 'vue-router-mock';
import CreateUserPage from '@/pages/users/create.vue';

const selectors = {
  name: 'user-form:name',
  jobTitle: 'user-form:job-title',
  create: 'user-form:create',
  cancel: 'user-form:cancel',
  confirmationModal: 'user-form:confirmation',
  confirmationModalDiscard: 'user-form:confirmation:discard',
  confirmationModalContinue: 'user-form:confirmation:continue',
};

const { setupFetchResponses } = createMockFetchInstance({
  '/users': {
    POST: [{ id: 1, name: 'Test', jobTitle: 'test' }],
  },
});

describe('create User Page', () => {
  beforeEach(() => {
    const router = createRouterMock({ runInComponentGuards: true });
    injectRouterMock(router);
    setupFetchResponses();

    render(nuxtUiWrapper(CreateUserPage), {
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
    expect(await screen.findByText('Create User')).toBeInTheDocument();
  });

  it('should be possible to create an user', async () => {
    // Arrange

    const nameField = screen.getByTestId(selectors.name);
    const jobTitleField = screen.getByTestId(selectors.jobTitle);
    const createButton = screen.getByTestId(selectors.create);

    // Act
    await fireEvent.update(nameField, 'test');
    await fireEvent.update(jobTitleField, 'test');

    await fireEvent.click(createButton);

    await flushPromises();

    // Assert
    expect($fetch).toHaveBeenCalledWith('/users', {
      method: 'POST',
      body: {
        name: 'test',
        jobTitle: 'test',
      },
    });
  });

  it('should be possible to cancel creating an user', async () => {
    // Arrange
    const cancelButton = screen.getByTestId(selectors.cancel);

    // Act
    await fireEvent.click(cancelButton);

    // Assert
    const router = getRouter();
    expect(router.push).toHaveBeenCalledWith('/users');
  });
});
