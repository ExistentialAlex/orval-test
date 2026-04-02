import type { RouteLocationNormalized } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { i18n } from '@/core/i18n';

/**
 * Title Guard to set the page title after route navigation.
 * @param to The target route being navigated to.
 */
export const titleGuard = (to: RouteLocationNormalized) => {
  const {
    global: { t },
  } = i18n;

  const params = Object.fromEntries(
    Object.entries(to.meta.titleParams || {}).map(([k, v]) => [k, v(to)]),
  );

  useTitle(t(String(to.meta.title), params), {
    titleTemplate: `%s | ${t('app.title')}`,
  });
};
