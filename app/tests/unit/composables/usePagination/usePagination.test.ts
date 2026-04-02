import type { VueWrapper } from '@vue/test-utils';
import { en } from '<project-name>-i18n';
import { $fetch } from '@mocks/fetch.mock';
import { PiniaColada } from '@pinia/colada';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import TestComponent from './test-component.vue';

describe('usePagination', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestComponent>>;

  beforeEach(async () => {
    $fetch.mockResolvedValueOnce({
      results: [],
      count: 0,
      next: 'http://localhost:8000?page=3&page_size=25',
      previous: 'http://localhost:8000?page=1&page_size=25',
      page: 2,
    });

    wrapper = mount(TestComponent, {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false }),
          PiniaColada,
          createI18n({ messages: { en } }),
        ],
      },
    });

    await flushPromises();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with default values', () => {
    // Arrange

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {},
    });
  });

  it('should refetch data when page changes', async () => {
    // Arrange
    const nextPage = wrapper.find('#next-page');

    // Act
    await nextPage.trigger('click');

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {
        page: '3',
        page_size: '25',
      },
    });
  });

  it('should refetch data when page_size changes', async () => {
    // Arrange
    const pageSizeSelect = wrapper.find('#pageSize');

    // Act
    await pageSizeSelect.setValue('50');

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {
        page_size: '50',
      },
    });
  });

  it('should refetch data when search changes', async () => {
    // Arrange
    vi.useFakeTimers();
    const searchInput = wrapper.find('#search');

    // Act
    await searchInput.setValue('test');
    vi.advanceTimersByTime(600); // Wait for debounce
    await nextTick();

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {
        page_size: '25',
        search: 'test',
      },
    });

    // Cleanup
    vi.useRealTimers();
  });

  it('should refetch data when sort changes', async () => {
    // Arrange
    const sortSelect = wrapper.find('#add-sort');

    // Act
    await sortSelect.trigger('click');

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {
        page_size: '25',
        sort: ['-test'],
      },
    });
  });

  it('should be possible to specify additional filters', async () => {
    // Arrange
    const sortSelect = wrapper.find('#add-sort');
    const addFilters = wrapper.find('#add-filter');

    // Act
    await sortSelect.trigger('click');
    await nextTick();
    await addFilters.trigger('click');

    // Assert
    expect($fetch).toHaveBeenCalledWith('/api/test', {
      query: {
        'page_size': '25',
        'sort': ['-test'],
        'test-filter': 'test',
      },
    });
  });
});
