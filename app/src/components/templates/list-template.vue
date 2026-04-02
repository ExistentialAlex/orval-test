<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  title: string;
  dataTestid: string;
  pageSizeItems: number[];
  previous?: string;
  next?: string;
  page: number;
  total: number;
}>();

const pageSize = defineModel<number>('page-size', { required: true });

const { t } = useI18n();

const min = computed(() => {
  return (props.page - 1) * pageSize.value + 1;
});

const max = computed(() => {
  const m = props.page * pageSize.value;

  if (m > props.total) {
    return props.total;
  }

  return m;
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="title">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <slot name="navbar-right"></slot>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <slot name="body"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <TemplateFooter class="flex gap-1.5">
          <USelect
            v-model="pageSize"
            :items="pageSizeItems"
            :data-testid="`${dataTestid}:page-size`"
            class="w-24"
          />
          <p class="text-dimmed mr-2 ml-auto text-xs">
            {{ t('app.components.paginatedTable.total', { min, max, total }) }}
          </p>
          <UButton
            variant="outline"
            color="neutral"
            :to="previous"
            :disabled="!previous"
            icon="i-lucide-chevron-left"
            :data-testid="`${dataTestid}:previous`"
          >
            {{ t('app.components.paginatedTable.previous') }}
          </UButton>
          <UButton
            variant="outline"
            color="neutral"
            :to="next"
            :disabled="!next"
            trailing-icon="i-lucide-chevron-right"
            :data-testid="`${dataTestid}:next`"
          >
            {{ t('app.components.paginatedTable.next') }}
          </UButton>
        </TemplateFooter>
      </slot>
    </template>
  </UDashboardPanel>
</template>
