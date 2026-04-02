import type { User, UserSession } from '<project-name>-types';
import type { ComputedRef, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSessionStore } from '@/stores';

export interface UserSessionComposable {
  /**
   * Computed indicating if the auth session is ready
   */
  ready: ComputedRef<boolean>;
  /**
   * Computed indicating if the user is logged in.
   */
  loggedIn: ComputedRef<boolean>;
  /**
   * The user object if logged in, null otherwise.
   */
  user: ComputedRef<User | null>;
  /**
   * The session object.
   */
  session: Ref<UserSession | null>;
  /**
   * Fetch the user session from the server.
   */
  fetch: () => Promise<void>;
  /**
   * Clear the user session and remove the session cookie.
   */
  clear: () => Promise<void>;
  /**
   * Open the OAuth route in a popup that auto-closes when successful.
   */
  openInPopup: (route: string, size?: { width?: number; height?: number }) => void;
}

/**
 * A composable to make working with user sessions as easy as possible.
 *
 * NOTE - To modify the data that CAN be included in the session, update the `session.type.ts` file in `shared/types`.
 *
 * @example
 * const { loggedIn, ready, session, user, fetch, clear, openInPopup } = useUserSession();
 */
export const useUserSession = (): UserSessionComposable => {
  const sessionStore = useSessionStore();

  const { sessionState, authReadyState } = storeToRefs(sessionStore);
  const { fetch, clear } = sessionStore;

  const popupListener = (e: StorageEvent) => {
    if (e.key === 'temp-auth-utils-popup') {
      fetch();
      window.removeEventListener('storage', popupListener);
    }
  };
  const openInPopup = (route: string, size: { width?: number; height?: number } = {}) => {
    // Set a local storage item to tell the popup that we pending auth
    localStorage.setItem('temp-auth-utils-popup', 'true');

    const width = size.width ?? 960;
    const height = size.height ?? 600;
    const top = (window.top?.outerHeight ?? 0) / 2 + (window.top?.screenY ?? 0) - height / 2;
    const left = (window.top?.outerWidth ?? 0) / 2 + (window.top?.screenX ?? 0) - width / 2;

    window.open(
      route,
      'auth-utils-popup',
      `width=${width}, height=${height}, top=${top}, left=${left}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`,
    );

    window.addEventListener('storage', popupListener);
  };

  return {
    ready: computed(() => authReadyState.value),
    loggedIn: computed(() => Boolean(sessionState.value?.user)),
    user: computed(() => sessionState.value?.user || null),
    session: sessionState,
    fetch,
    clear,
    openInPopup,
  };
};
