<script setup lang="ts">
import type { User } from '<project-name>-types';
import type { DropdownMenuItem } from '@nuxt/ui';
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserSession } from '@/composables';

const props = defineProps<{
  user: User;
  collapsed?: boolean;
}>();

const colorMode = useColorMode({
  initialValue: 'light',
});
const router = useRouter();
const { t } = useI18n();
const { clear: clearSession } = useUserSession();

const logout = async () => {
  clearSession();
  router.push('/login');
};

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: 'label',
      label: props.user.name,
      avatar: props.user.avatar,
    },
  ],
  [
    {
      label: t('app.sidebar.appearance.title'),
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: t('app.sidebar.appearance.light'),
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onSelect(e: Event) {
            e.preventDefault();
            colorMode.value = 'light';
          },
        },
        {
          label: t('app.sidebar.appearance.dark'),
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onSelect(e: Event) {
            e.preventDefault();
            colorMode.value = 'dark';
          },
        },
      ],
    },
  ],
  [
    {
      label: t('app.sidebar.signOut'),
      icon: 'i-lucide-log-out',
      onSelect(e) {
        e.preventDefault();
        logout();
      },
    },
  ],
]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
    data-testid="user-menu"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      data-testid="user-menu:trigger"
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
