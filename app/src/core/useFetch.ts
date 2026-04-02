import type { FetchHooks, FetchOptions } from 'ofetch';
import defu from 'defu';
import { ofetch } from 'ofetch';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfig } from './config';

/**
 * A composable for accessing an instance of ofetch preconfigured for the BFF.
 * @returns The $fetch function that will be used to make outgoing fetch requests to the BFF.
 */
export const useFetch = (options?: FetchOptions) => {
  const { config } = useConfig();
  const url = config.value?.VITE_API_BASE_URL || '/';

  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useI18n();

  const unauthorisedErrorHook: FetchHooks['onResponseError'] = ({ response }) => {
    if (response.status !== 401) {
      return;
    }

    toast.add({
      title: t('app.composables.useFetch.toasts.unauthorised.title'),
      description: t('app.composables.useFetch.toasts.unauthorised.description'),
    });
    router.push('/login');
  };

  const defaults: FetchOptions = {
    baseURL: url,
    credentials: 'include',
    headers: {
      'accept-language': locale.value,
    },
    onResponseError: [unauthorisedErrorHook],
  };

  const opts = defu(options, defaults);

  // Create a shared ofetch instance for sharing the base url.
  const $fetch = ofetch.create(opts);

  return {
    $fetch,
  };
};
