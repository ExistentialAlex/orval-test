<script lang="ts" setup generic="T extends TableData">
import type { ColumnSort } from '<project-name>-types';
import type { TableColumn, TableData } from '@nuxt/ui';

defineProps<IPaginatedTableProps<T>>();
const search = defineModel<string>('search', { required: true });
const sort = defineModel<ColumnSort[]>('sort', { required: false });

interface IPaginatedTableProps<T> {
  data: T[];
  loading?: boolean;
  columns?: TableColumn<T>[];
  dataTestid?: string;
  multiSort?: boolean;
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <div class="flex">
      <UInput v-model="search" icon="i-lucide-search" :data-testid="`${dataTestid}:search`" />
      <slot name="right"></slot>
    </div>
    <UTable
      v-model:sorting="sort"
      :data="data"
      :pagination-options="{
        manualPagination: true,
      }"
      :sorting-options="{
        enableMultiSort: multiSort,
        manualSorting: true,
      }"
      sticky
      :loading="loading"
      :columns="columns"
      :data-testid="dataTestid"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
      }"
    />
  </div>
</template>
