import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';
import { authGuard, titleGuard } from '@/guards';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Set up Guards
router.beforeEach(authGuard);
router.afterEach(titleGuard);

if (import.meta.hot) {
  handleHotUpdate(router);
}

export default router;
