import type { ComponentProps } from 'vue-component-type-helpers';
import { computed, ref } from 'vue';
import ActionModal from '@/components/action-modal.vue';

export const useActionModal = <T extends ComponentProps<typeof ActionModal>>(props: T) => {
  const overlay = useOverlay();
  const modal = overlay.create(ActionModal);
  const instance = ref<ReturnType<typeof modal.open> | undefined>();

  const open = () => {
    instance.value = modal.open(props);
  };

  const close = () => {
    modal.close();
  };

  return {
    open,
    close,
    instance,
    actionTaken: computed(async () => (await instance.value?.result) || ''),
  };
};
