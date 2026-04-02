import type { RouteMeta } from 'vue-router';
import type { RouteNamedMap } from 'vue-router/auto-routes';
import type { RouteMeta as TypedRouteMeta } from '@/types';

/**
 * Helper function to create type-safe route meta for a specific route.
 * This provides full type safety for route parameters in breadcrumbs and other meta properties.
 *
 * @example
 * ```typescript
 * definePage({
 *   name: 'edit-user',
 *   meta: createTypedMeta<'edit-user'>({
 *     title: 'Edit User',
 *     requiresAuth: true,
 *     breadcrumbs: [
 *       {
 *         to: '/users',
 *         label: 'Users',
 *       },
 *       {
 *         to: '',
 *         label: 'Edit',
 *         params: {
 *           id: (route) => route.params.id, // ← Fully typed, no casting needed!
 *         },
 *       },
 *     ],
 *   }),
 * });
 * ```
 */
export const definePageMeta = <TRouteName extends keyof RouteNamedMap>(
  meta: TypedRouteMeta<TRouteName>,
): RouteMeta => {
  return meta as RouteMeta;
};
