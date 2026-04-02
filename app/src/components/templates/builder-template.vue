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
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="title" :toggle="false">
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
          <slot name="navbar-right"></slot>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="mx-auto flex w-full flex-col gap-4 sm:gap-6 lg:max-w-2xl lg:gap-12">
        <slot name="body"></slot>
      </div>
    </template>
    <template #footer>
      <TemplateFooter>
        <slot name="footer"></slot>
      </TemplateFooter>
    </template>
  </UDashboardPanel>
</template>
