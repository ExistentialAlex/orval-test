import { renderUI } from '@helpers/nuxt-ui-render';
import { cleanup, fireEvent, screen } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import TestComponent from './test-component.vue';

vi.mock('@/composables', async (original) => {
  return {
    ...(await original()),
    usePagination: vi.fn(() => {
      return {
        page: ref(1),
        data: ref({ results: [{ id: 1, name: 'Test', jobTitle: 'Test Job' }] }),
        error: ref(undefined),
        pageSizeItems: [1, 5, 10, 25, 50],
        pageSize: ref(25),
      };
    }),
  };
});

const selectors = {
  testTable: 'test-table',
  testTableActionsToggle: 'test-table:actions:0',
  testTableActionsMenu: 'test-table:actions:menu',
  testTableNameLink: 'test-table:name:0',
  testTableSortName: 'test-table:sort:name',
};

describe('useTable', () => {
  beforeEach(() => {
    renderUI(TestComponent, { global: { stubs: { NuxtLink: true } } });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('functions', () => {
    describe('actionsCell', () => {
      it('should be possible to open a row dropdown', async () => {
        // Arrange
        const toggle = screen.getByTestId(selectors.testTableActionsToggle);

        // Act
        await fireEvent.click(toggle);

        // Assert
        expect(await screen.findByText('Actions')).toBeInTheDocument();
      });
    });

    describe('linkCell', () => {
      it('should be possible to use a link cell', async () => {
        // Arrange
        const link = screen.getByTestId(selectors.testTableNameLink);

        // Assert
        expect(link.attributes.getNamedItem('to')?.value).toBe('/test/1');
      });
    });
  });
});
