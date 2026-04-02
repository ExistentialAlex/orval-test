import type { NavigationMenuItem } from '@nuxt/ui';
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useSidebar = () => {
  const { t } = useI18n();

  const open = useLocalStorage('<project-name>-sidebar', true);

  const toggleSidebar = () => (open.value = !open.value);

  const sidebarItems = ref<NavigationMenuItem[]>([
    [
      {
        value: 'dashboard',
        label: t('app.sidebar.dashboard'),
        to: '/',
        icon: 'i-lucide-layout-dashboard',
      },
      {
        value: 'users',
        label: t('app.sidebar.users'),
        to: '/users',
        icon: 'i-lucide-user',
      },
    ],
  ]);

  return { sidebarItems, toggleSidebar, open };
};
