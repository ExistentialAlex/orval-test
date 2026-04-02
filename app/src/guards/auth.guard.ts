import type { RouteLocationNormalized } from 'vue-router';
import { useUserSession } from '@/composables';

/**
 * Auth Guard to protect routes that require authentication.
 * @param to The target route being navigated to.
 * @returns Returns true if the user is allowed to proceed, or a redirect object if not.
 */
export const authGuard = async (to: RouteLocationNormalized) => {
  const { loggedIn, fetch, ready } = useUserSession();

  // If the session is not ready, then we need to fetch it
  if (!ready.value) {
    // Fetch the session data again
    await fetch();
  }

  if (!loggedIn.value && to.meta.requiresAuth) {
    // Build the full URL including query params and hash
    let redirectUrl = to.path;

    // Add query parameters if they exist
    if (Object.keys(to.query).length > 0) {
      const queryString = new URLSearchParams(new Object(to.query)).toString();
      redirectUrl += `?${queryString}`;
    }

    // Add hash if it exists
    if (to.hash) {
      redirectUrl += to.hash;
    }

    return {
      path: '/login',
      query: {
        redirect: redirectUrl,
      },
    };
  }

  return true;
};
