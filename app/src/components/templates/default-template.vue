<script setup lang="ts">
defineProps<{
  title: string;
}>();
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
  </UDashboardPanel>
</template>
