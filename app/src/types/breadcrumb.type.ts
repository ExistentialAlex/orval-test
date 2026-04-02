import type { MessageSchema } from 'orval-test-i18n';
import type { ShapeOf } from 'orval-test-types';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import type { RouteNamedMap } from 'vue-router/auto-routes';

export interface AppBreadcrumb<TRouteName extends keyof RouteNamedMap> {
  to: RouteLocationRaw;
  label: ShapeOf<MessageSchema>;
  params?: Record<string, (route: RouteLocationNormalized<TRouteName>) => string>;
}
