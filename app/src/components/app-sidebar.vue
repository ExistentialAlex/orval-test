<script setup lang="ts">
import { useSidebar, useUserSession } from '@/composables';

const { open, sidebarItems } = useSidebar();
const { user } = useUserSession();
</script>

<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="sidebarItems"
        orientation="vertical"
        tooltip
        popover
      />
    </template>

    <template #footer="{ collapsed }">
      <UserMenu v-if="user" :collapsed="collapsed" :user="user" />
    </template>
  </UDashboardSidebar>
</template>
