<script setup lang="ts">
import { usePagination } from '@/composables/usePagination';

const {
  pageSize,
  search,
  sort,
  data,
  error,
  isLoading,
  isPending,
  pageSizeItems,
  status,
  useQueryParam,
} = usePagination<any, any>(['test'], '/api/test');

const testFilter = useQueryParam('test-filter');

const addFilters = () => {
  testFilter.value = 'test';
};
</script>

<template>
  <div>
    <h1>Pagination Test Component</h1>
    <p>Items per Page: {{ pageSize }}</p>
    <p>Search Query: {{ search }}</p>
    <p>Sort Order: {{ sort }}</p>
  </div>
  <button id="next-page" @click="$router.push(data?.next || '')">
    Next Page
  </button>
  <button id="previous-page" @click="$router.push(data?.previous || '')">
    previous Page
  </button>
  <input id="pageSize" v-model="pageSize" type="number" placeholder="Items per page">
  <input id="search" v-model="search" placeholder="Search...">
  <button id="add-filter" @click="addFilters"></button>
  <button id="add-sort" @click="sort = [{ desc: true, id: 'test' }]">
    Add Sort
  </button>
  <p id="data">
    {{ JSON.stringify(data) }}
  </p>
  <p v-if="error" id="error">
    {{ error }}
  </p>
  <p id="isLoading">
    Loading: {{ isLoading }}
  </p>
  <p id="isPending">
    Pending: {{ isPending }}
  </p>
  <p id="pageSizeItems">
    {{ pageSizeItems }}
  </p>
  <p id="status">
    {{ status }}
  </p>
</template>
