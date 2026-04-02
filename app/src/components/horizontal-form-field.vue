<script setup lang="ts">
import type { FormFieldProps } from '@nuxt/ui';

const props = defineProps<FormFieldProps>();
</script>

<template>
  <UFormField
    v-bind="props"
    class="flex justify-between gap-4 max-sm:flex-col"
    :class="[{ 'items-start': props.description, 'items-center': !props.description }]"
    :ui="{ container: 'flex-1', ...ui }"
  >
    <slot></slot>
  </UFormField>
</template>
