import { renderUI } from '@helpers/nuxt-ui-render';
import { $fetch, createMockFetchInstance } from '@mocks/fetch.mock';
import { cleanup, fireEvent, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouterMock, getRouter, injectRouterMock } from 'vue-router-mock';
import NotFound from '@/pages/[...path].vue';
import UpdateUserPage from '@/pages/users/[id].vue';

const selectors = {
  title: 'user-view:title',
  formName: 'user-form:name',
  formJobTitle: 'user-form:display-name',
  formSubmit: 'user-form:save',
  formCancel: 'user-form:cancel',
  formConfirmationModal: 'user-form:confirmation',
  formConfirmationModalDiscard: 'user-form:confirmation:discard',
  formConfirmationModalContinue: 'user-form:confirmation:continue',
};

const { setupFetchResponses } = createMockFetchInstance({
  '/users/1': { id: 1, name: 'Test', jobTitle: 'test' },
  '/users': {
    POST: { id: 1, name: 'Test', jobTitle: 'test' },
  },
});

describe('update User Page', () => {
  beforeEach(async () => {
    const mockRouter = createRouterMock({ runInComponentGuards: true });
    injectRouterMock(mockRouter);
    const router = getRouter();
    router.setParams({ id: 1 });

    setupFetchResponses();

    // Render the UI
    renderUI(UpdateUserPage);

    // Wait for all data to be loaded.
    await flushPromises();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should be possible to update an user', async () => {
    // Arrange
    const nameField = screen.getByTestId(selectors.formName);
    const submitButton = screen.getByTestId(selectors.formSubmit);

    // Act
    await fireEvent.update(nameField, 'test2');
    await fireEvent.click(submitButton);

    await flushPromises();

    // Assert
    expect($fetch).toHaveBeenCalledWith('/users/1', {
      method: 'PATCH',
      body: {
        name: 'test2',
        jobTitle: 'test',
      },
    });
  });

  it('should redirect the user to the 404 page if the user details cannot be found', async () => {
    // Arrange
    cleanup();

    const router = getRouter();
    router.addRoute({
      path: '/[...path]',
      name: 'not-found',
      component: NotFound,
    });

    $fetch.mockRejectedValueOnce({ status: 404 });
    renderUI(UpdateUserPage);
    await flushPromises();

    // Assert
    expect(router.push).toHaveBeenCalledWith({
      name: 'not-found',
      params: {
        path: '',
      },
      query: {},
      hash: '',
    });
  });

  it('should redirect to the list screen if an unexpected error occurs', async () => {
    // Arrange
    cleanup();

    const router = getRouter();
    router.addRoute({
      path: '/users',
      name: 'user-list',
      component: NotFound,
    });

    $fetch.mockRejectedValueOnce({ status: 500 });
    renderUI(UpdateUserPage);
    await flushPromises();

    // Assert
    expect(router.push).toHaveBeenCalledWith({
      name: 'user-list',
    });
  });
});
