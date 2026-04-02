import type { Mock } from 'vitest';
import { $fetch } from '@mocks/fetch.mock';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from '@/stores';

describe('session Store', () => {
  let store: ReturnType<typeof useSessionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSessionStore();
  });

  describe('actions', () => {
    describe('fetch', () => {
      it('should fetch the user session', async () => {
        // Arrange
        const data = { user: { email: 'test@test.org' } };
        ($fetch as unknown as Mock).mockResolvedValueOnce(data);

        // Act
        await store.fetch();

        // Assert
        expect(store.sessionState).toEqual(data);
      });

      it('should set the session to `null` if an error occurs', async () => {
        // Arrange
        ($fetch as unknown as Mock).mockRejectedValueOnce(new Error('Error'));

        // Act
        await store.fetch();

        // Assert
        expect(store.sessionState).toBe(null);
      });
    });

    describe('clear', () => {
      it('should clear the session', async () => {
        // Arrange
        const data = { user: { email: 'test@test.org' } };
        ($fetch as unknown as Mock).mockResolvedValueOnce(data).mockResolvedValueOnce({});

        // Act
        await store.fetch();

        // Assert
        expect(store.sessionState).toEqual(data);

        // Act
        await store.clear();

        // Assert
        expect(store.sessionState).toBe(null);
      });
    });
  });
});
