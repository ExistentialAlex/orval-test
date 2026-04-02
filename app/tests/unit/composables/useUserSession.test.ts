import type { UserSessionComposable } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserSession } from '@/composables';
import { useSessionStore } from '@/stores';

vi.stubGlobal('open', vi.fn());
vi.mock('vue-i18n', async () => {
  const { en } = await import('<project-name>-i18n');
  return (await import('@mocks/i18n.mock')).mockI18n(en);
});

describe('useUserSession', () => {
  let sessionStore: ReturnType<typeof useSessionStore>;
  let composable: UserSessionComposable;

  beforeEach(() => {
    setActivePinia(createTestingPinia());
    sessionStore = useSessionStore();
    composable = useUserSession();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('fetch', () => {
      it('should call the session store `fetch` action', async () => {
        // Act
        await composable.fetch();

        // Assert
        expect(sessionStore.fetch).toHaveBeenCalled();
      });
    });

    describe('clear', () => {
      it('should call the session store `clear` action', async () => {
        // Act
        await composable.clear();

        // Assert
        expect(sessionStore.clear).toHaveBeenCalled();
      });
    });

    describe('openInPopup', () => {
      it('should open the specified route in a popup', () => {
        // Arrange
        const openSpy = vi.spyOn(window, 'open');

        // Act
        composable.openInPopup('/test');

        // Assert
        expect(openSpy).toHaveBeenCalledWith(
          '/test',
          'auth-utils-popup',
          'width=960, height=600, top=84, left=32, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no',
        );
      });

      it('should open the popup with the specified size', () => {
        // Arrange
        const openSpy = vi.spyOn(window, 'open');

        // Act
        composable.openInPopup('/test', { height: 100, width: 100 });

        // Assert
        expect(openSpy).toHaveBeenCalledWith(
          '/test',
          'auth-utils-popup',
          'width=100, height=100, top=334, left=462, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no',
        );
      });

      it('should fallback the top and left values if window properties are not available', () => {
        // Arrange
        const openSpy = vi.spyOn(window, 'open');
        const originalTop = window.top;
        const originalScreenY = window.screenY;
        const originalOuterHeight = window.outerHeight;
        const originalOuterWidth = window.outerWidth;

        // Mock the properties to be undefined
        Object.defineProperty(window, 'top', { value: undefined });
        Object.defineProperty(window, 'screenY', { value: undefined });
        Object.defineProperty(window, 'outerHeight', { value: undefined });
        Object.defineProperty(window, 'outerWidth', { value: undefined });

        // Act
        composable.openInPopup('/test');

        // Assert
        expect(openSpy).toHaveBeenCalledWith(
          '/test',
          'auth-utils-popup',
          'width=960, height=600, top=-300, left=-480, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no',
        );

        // Restore original properties
        Object.defineProperty(window, 'top', { value: originalTop });
        Object.defineProperty(window, 'screenY', { value: originalScreenY });
        Object.defineProperty(window, 'outerHeight', { value: originalOuterHeight });
        Object.defineProperty(window, 'outerWidth', { value: originalOuterWidth });
      });
    });

    describe('popupListener', () => {
      it('should fetch the user session when the popup is closed', () => {
        // Arrange
        composable.openInPopup('/test');

        // Act
        window.dispatchEvent(new StorageEvent('storage', { key: 'temp-auth-utils-popup' })); // Storage event will be called when the popup closes.

        // Assert
        expect(sessionStore.fetch).toHaveBeenCalled();
      });
    });
  });
});
