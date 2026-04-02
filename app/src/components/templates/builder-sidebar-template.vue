<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { useRouter } from 'vue-router';

defineProps<{
  title: string;
  backTo: RouteLocationRaw;
  dataTestid: string;
}>();

const router = useRouter();
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar :title="title" toggle-side="right">
        <template #title>
          <span :data-testid="`${dataTestid}:title`">
            {{ title }}
          </span>
        </template>
        <template #leading>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            :data-testid="`${dataTestid}:cancel`"
            @click="router.push(backTo)"
          />
        </template>
        <template #trailing>
          <slot name="navbar-trailing"></slot>
        </template>
        <template #right>
          <slot name="navbar-right">
          </slot>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex max-h-full flex-1">
        <div
          class="mx-auto flex max-h-full w-full flex-1 flex-col gap-4 overflow-auto p-4 sm:gap-6 sm:p-6 lg:gap-12"
        >
          <slot name="body"></slot>
        </div>
        <UDashboardSidebar
          v-if="$slots.sidebar"
          side="right"
          mode="drawer"
          class="border-default min-h-full border-l"
        >
          <slot name="sidebar"></slot>
        </UDashboardSidebar>
      </div>
    </template>
    <template #footer>
      <TemplateFooter>
        <slot name="footer"></slot>
      </TemplateFooter>
    </template>
  </UDashboardPanel>
</template>
