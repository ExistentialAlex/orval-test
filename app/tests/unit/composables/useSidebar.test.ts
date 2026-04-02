import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSidebar } from '@/composables';

vi.mock('vue-i18n', async () => {
  const { en } = await import('<project-name>-i18n');
  return (await import('@mocks/i18n.mock')).mockI18n(en);
});
vi.mock('@/utils', () => {
  return {
    $fetch: vi.fn(),
  };
});

describe('useSidebar', () => {
  let composable: ReturnType<typeof useSidebar>;

  beforeEach(() => {
    setActivePinia(createTestingPinia());
    composable = useSidebar();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('toggleSidebar', () => {
      it('should toggle the sidebar state', () => {
        // Arrange
        const initialState = composable.open.value;

        // Act
        composable.toggleSidebar();

        // Assert
        expect(composable.open.value).toBe(!initialState);
      });
    });
  });
});
