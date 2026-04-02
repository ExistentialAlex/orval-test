import { renderUI } from '@helpers/nuxt-ui-render';
import { $fetch, createMockFetchInstance } from '@mocks/fetch.mock';
import { cleanup, fireEvent, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { getRouter } from 'vue-router-mock';
import UsersList from '@/pages/users/index.vue';

const selectors = {
  search: 'user-list:search',
  create: 'user-list:create',
  userList: 'user-list',
  userListPageSize: 'user-list:page-size',
  userListNext: 'user-list:next',
  userListPrevious: 'user-list:previous',

  userListSortName: 'user-list:sort:name',

  userListActionsToggle: 'user-list:actions:0',
  userListActionsMenu: 'user-list:actions:menu',
  userListActionsEdit: 'user-list:actions:edit',
  userListActionsDelete: 'user-list:actions:delete',

  deleteModal: 'user-list:delete-modal',
  deleteModalConfirm: 'user-list:delete-modal:confirm',
  deleteModalCancel: 'user-list:delete-modal:cancel',
};

const { setupFetchResponses } = createMockFetchInstance({
  '/users': {
    GET: {
      results: [{ id: 1, name: 'Test User', jobTitle: 'Test Job' }],
      count: 1,
      page: 1,
    },
  },
});

describe('users List', () => {
  beforeEach(async () => {
    setupFetchResponses();
    renderUI(UsersList);

    await flushPromises();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the page', async () => {
    // Arrange
    expect(await screen.findByTestId('user-list')).toBeInTheDocument();
  });

  it('should be possible to open a row dropdown', async () => {
    // Arrange
    const toggle = screen.getByTestId(selectors.userListActionsToggle);

    // Act
    await fireEvent.click(toggle);

    // Assert
    expect(await screen.findByText('Actions')).toBeInTheDocument();
  });

  it('should be possible to navigate to the view/edit user page', async () => {
    // Arrange
    const toggle = screen.getByTestId(selectors.userListActionsToggle);
    await fireEvent.click(toggle);

    // Act
    const viewButton = screen.getByTestId(selectors.userListActionsEdit);
    await fireEvent.click(viewButton);

    // Assert
    const router = getRouter();
    expect(router.push).toHaveBeenCalledWith({ path: '/users/1' });
  });

  it('should be possible to delete a user', async () => {
    // Arrange
    const toggle = screen.getByTestId(selectors.userListActionsToggle);
    await fireEvent.click(toggle);

    // Act
    const deleteButton = screen.getByTestId(selectors.userListActionsDelete);
    await fireEvent.click(deleteButton);
    const confirmDeleteButton = screen.getByTestId(selectors.deleteModalConfirm);
    await fireEvent.click(confirmDeleteButton);
    await flushPromises();

    // Assert
    expect($fetch).toHaveBeenCalledWith('/users/1', {
      method: 'DELETE',
    });
  });

  it('should be possible to navigate to the create user page', async () => {
    // Arrange
    const createButton = screen.getByTestId(selectors.create);
    const router = getRouter();
    router.addRoute({
      path: '/user/create',
      redirect: '',
    });

    // Act
    await fireEvent.click(createButton);

    // Assert
    expect(router.push).toHaveBeenCalledWith('/users/create');
  });

  it('should be possible to search for an user', async () => {
    // Arrange
    vi.useFakeTimers();
    const searchInput = screen.getByTestId(selectors.search);
    const router = getRouter();

    // Act
    await fireEvent.update(searchInput, 'test');
    vi.advanceTimersByTime(600);
    await nextTick();

    // Assert
    expect(router.push).toHaveBeenCalledWith({
      query: {
        page_size: 25,
        search: 'test',
      },
    });
    vi.useRealTimers();
  });

  it('should be possible to change the sort', async () => {
    // Arrange
    const nameSort = screen.getByTestId(selectors.userListSortName);

    // Act
    await fireEvent.click(nameSort);

    // Assert
    expect($fetch).toHaveBeenCalledWith('/users', {
      query: {
        page_size: '25',
        sort: ['name'],
      },
    });
  });
});
