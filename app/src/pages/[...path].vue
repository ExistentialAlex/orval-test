<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

definePage({
  name: 'not-found',
  meta: {
    title: 'app.pages.notFound.title',
    requiresAuth: true,
  },
});

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <UDashboardPanel class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-primary text-base font-semibold">
        404
      </p>
      <h1 class="text-default mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
        {{ t('app.pages.notFound.title') }}
      </h1>
      <p
        class="mt-6 text-lg font-medium text-pretty text-neutral-500 sm:text-xl/8 dark:text-neutral-400"
      >
        {{ t('app.pages.notFound.description') }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <UButton data-testid="not-found:go-back" @click="router.push({ name: 'dashboard' })">
          {{
            t('app.pages.notFound.actions.goBack')
          }}
        </UButton>
        <UButton variant="soft" color="neutral" trailing-icon="i-lucide-arrow-right">
          {{ t('app.pages.notFound.actions.contactSupport') }}
        </UButton>
      </div>
    </div>
  </UDashboardPanel>
</template>
