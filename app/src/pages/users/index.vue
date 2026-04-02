<script setup lang="ts">
import type { PaginationQuery, User } from '<project-name>-schemas';
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import { definePage } from 'unplugin-vue-router/runtime';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import PaginatedTable from '@/components/paginated-table.vue';
import { useConfirmationModal, usePagination, useTable } from '@/composables';
import { useDeleteUser } from '@/composables/users';

definePage({
  name: 'user-list',
  meta: {
    title: 'app.users.titles.list',
    requiresAuth: true,
    layout: 'default',
  },
});

const { t } = useI18n();
const { sortableColumn, linkCell, actionsCell } = useTable<User>('user-list');
const router = useRouter();
const toast = useToast();

const { confirmAction: confirmDelete } = useConfirmationModal(
  t('app.pages.users.list.modals.delete.title'),
  t('app.pages.users.list.modals.delete.description'),
  'user-list:delete-modal',
);
const { mutate: deleteUser } = useDeleteUser();

const getActionItems = (row: Row<User>): DropdownMenuItem[] => [
  {
    'type': 'label',
    'label': t('app.pages.users.list.actions.title'),
    'data-testid': 'user-list:actions:menu',
  },
  {
    type: 'separator',
  },
  {
    'label': t('app.pages.users.list.actions.edit'),
    'onSelect': () => router.push({ path: `/users/${row.original.id}` }),
    'icon': 'i-lucide-edit',
    'data-testid': 'user-list:actions:edit',
  },
  {
    'label': t('app.pages.users.list.actions.delete'),
    'onSelect': () => confirmDelete(deleteUser, { id: String(row.original.id) }),
    'icon': 'i-lucide-delete',
    'data-testid': 'user-list:actions:delete',
  },
];

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    cell: linkCell('name', (row) => `/users/${row.original.id}`),
    header: sortableColumn(t('app.pages.users.list.columns.name')),
  },
  {
    accessorKey: 'jobTitle',
    header: sortableColumn(t('app.pages.users.list.columns.jobTitle')),
  },
  {
    id: 'actions',
    cell: actionsCell(getActionItems),
  },
];

const { pageSize, search, sort, error, pageSizeItems, state } = usePagination<
  User,
  PaginationQuery
>(['users'], '/users');

watch(error, (err) => {
  if (err) {
    toast.add({
      title: t('app.pages.users.list.toasts.fetchListError'),
      description: err.message,
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
});
</script>

<template>
  <ListTemplate
    v-model:page-size="pageSize"
    :title="t('app.pages.users.list.title')"
    data-testid="user-list"
    :previous="state.data?.previous"
    :next="state.data?.next"
    :page-size-items="pageSizeItems"
    :page="state.data?.page || 1"
    :total="state.data?.count || 0"
  >
    <template #navbar-right>
      <UButton
        icon="i-lucide-plus"
        data-testid="user-list:create"
        @click="router.push('/users/create')"
      >
        {{ t('app.pages.users.list.create') }}
      </UButton>
    </template>
    <template #body>
      <PaginatedTable
        v-model:search="search"
        v-model:sort="sort"
        :data="state.data?.results || []"
        :columns="columns"
        :loading="state.status === 'pending'"
        data-testid="user-list"
        multi-sort
      />
    </template>
  </ListTemplate>
</template>
