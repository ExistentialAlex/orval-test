<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime';
import { useI18n } from 'vue-i18n';

definePage({
  name: 'dashboard',
  meta: {
    title: 'app.pages.dashboard.title',
    requiresAuth: true,
    breadcrumbs: [
      {
        to: '/',
        label: 'app.pages.dashboard.title',
      },
    ],
  },
});

const { t } = useI18n();
</script>

<template>
  <DefaultTemplate :title="t('app.pages.dashboard.title')">
    <template #body>
      <span class="text-center">
        <h1
          class="text-primary mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl"
        >
          {{ t('app.pages.dashboard.welcome.title') }}
        </h1>
        <p
          class="mt-6 text-lg font-medium text-pretty text-neutral-500 sm:text-xl/8 dark:text-neutral-400"
        >
          {{ t('app.pages.dashboard.welcome.description', { title: t('app.title') }) }}
        </p>
      </span>
      <USeparator />
      <UPageGrid>
        <UPageCard
          :title="t('app.pages.dashboard.cards.users.title')"
          :description="t('app.pages.dashboard.cards.users.description')"
          icon="i-lucide-user"
          to="/users"
        />
      </UPageGrid>
    </template>
  </DefaultTemplate>
</template>
