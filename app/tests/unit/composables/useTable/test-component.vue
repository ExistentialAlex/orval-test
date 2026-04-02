<script setup lang="ts">
import type { UserSchema } from '<project-name>-schemas';
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import { definePage } from 'unplugin-vue-router/runtime';
import { useI18n } from 'vue-i18n';
import PaginatedTable from '@/components/paginated-table.vue';
import { usePagination, useTable } from '@/composables';

definePage({
  meta: {
    requiresAuth: true,
    breadcrumbs: [
      {
        to: '/users',
        label: 'app.users.breadcrumbs.list',
      },
    ],
  },
});

const { t } = useI18n();
const { sortableColumn, actionsCell, linkCell } = useTable<UserSchema>('test-table');

const getRowItems = (): DropdownMenuItem[] => {
  return [
    {
      'type': 'label',
      'label': t('app.pages.users.list.actions.title'),
      'data-testid': 'test-table:actions:menu',
    },
  ];
};

const columns: TableColumn<UserSchema>[] = [
  {
    accessorKey: 'name',
    cell: linkCell('name', (row) => `/test/${row.original.id}`),
    header: sortableColumn('Name', true),
  },
  {
    accessorKey: 'jobTitle',
    header: sortableColumn('Job Title', true),
  },
  {
    id: 'actions',
    cell: actionsCell(getRowItems),
  },
];

const { pageSize, sort, data, isPending, pageSizeItems } = usePagination<UserSchema>(
  ['users'],
  '/users',
);
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <PaginatedTable
      v-model:page-size="pageSize"
      v-model:sort="sort"
      :data="data?.results || []"
      :page-size-items="pageSizeItems"
      :columns="columns"
      :loading="isPending"
      data-testid="<project-name>-table"
    />
  </div>
</template>
