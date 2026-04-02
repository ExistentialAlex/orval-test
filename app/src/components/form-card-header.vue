<script setup lang="ts">
export interface IFormCardHeaderProps {
  title: string;
  description?: string;
}

defineProps<IFormCardHeaderProps>();
</script>

<template>
  <div class="mb-4">
    <h2 class="text-highlighted text-base font-semibold text-pretty">
      {{ title }}
    </h2>
    <p v-if="description" class="text-muted mt-1 text-[15px] text-pretty">
      {{ description }}
    </p>
  </div>
</template>
