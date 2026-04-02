<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRouter } from 'vue-router';
import { useUserSession } from '@/composables';

const { fetch: refreshSession } = useUserSession();
const router = useRouter();
const loading = ref(true);
const { t } = useI18n();

onMounted(async () => {
  try {
    // Load any existing user session
    await refreshSession();

    // Wait for the router to be ready
    await router.isReady();
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <UApp>
    <RouterView v-if="!loading" />
    <div v-else class="grid h-screen place-items-center">
      <div class="flex flex-col items-center">
        <h1 class="text-primary text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {{ t('app.title') }}
        </h1>
        <UIcon name="i-lucide-loader-circle" class="mt-4 size-10 animate-spin" />
      </div>
    </div>
  </UApp>
</template>
