import type { UserSession } from '<project-name>-types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch } from '@/core';

/**
 * Composable to get back the user session and utils around it.
 */
export const useSessionStore = defineStore('session', () => {
  const { $fetch } = useFetch();

  const sessionState = ref<UserSession | null>(null);
  const authReadyState = ref(false);

  const clear = async () => {
    await $fetch('/session', {
      method: 'DELETE',
    });
    sessionState.value = null;
  };

  const fetch = async () => {
    sessionState.value = await $fetch<UserSession>('/session', {
      headers: {
        accept: 'application/json',
      },
      retry: false,
    }).catch(() => null);
    if (!authReadyState.value) {
      authReadyState.value = true;
    }
  };

  return {
    authReadyState,
    sessionState,
    fetch,
    clear,
  };
});
