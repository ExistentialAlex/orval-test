<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

export interface IActionModalAction extends Partial<ButtonProps> {
  'action': string;
  'label': string;
  'data-testid'?: string;
}

export interface IActionModalProps {
  actions: IActionModalAction[];
  close?: boolean | Partial<ButtonProps>;
  title: string;
  description?: string;
  dismissible?: boolean;
  dataTestid?: string;
}

const props = withDefaults(defineProps<IActionModalProps>(), {
  description: '',
  dismissable: true,
});
const emit = defineEmits<{ close: [string] }>();
</script>

<template>
  <UModal v-bind="props">
    <template #footer>
      <div class="flex flex-1 gap-2">
        <UButton
          v-for="(action, index) in actions"
          :key="index"
          v-bind="action"
          @click="emit('close', action.action)"
        />
      </div>
    </template>
  </UModal>
</template>
