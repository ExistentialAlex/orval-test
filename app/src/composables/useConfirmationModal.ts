import type { Callback } from '<project-name>-utils';
import type { ButtonProps } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { useActionModal } from './useActionModal';

export interface UseConfirmationModalComposable {
  /**
   * Check whether the user wants to discard their changes or continue editing.
   * If the models are the same, not modal pops up.
   * Otherwise, a modal appears asking the user to confirm if they want to keep their changes or not.
   * @param cb The callback function to call.
   * @param args The arguments for the callback.
   */
  confirmAction: <TCallback extends Callback>(
    cb: TCallback,
    ...args: Parameters<TCallback>
  ) => Promise<ReturnType<TCallback> | undefined>;
}

export const useConfirmationModal = (
  title: string,
  description: string,
  dataTestid: string,
  cancel?: ButtonProps,
  confirm?: ButtonProps,
): UseConfirmationModalComposable => {
  const { t } = useI18n();
  const { open: openModal, actionTaken } = useActionModal({
    title,
    description,
    dataTestid,
    actions: [
      {
        'action': 'cancel',
        'label': t('app.composables.useConfirmationModal.modal.cancel'),
        'variant': 'outline',
        'color': 'neutral',
        'class': 'ml-auto',
        'data-testid': `${dataTestid}:cancel`,
        ...cancel,
      },
      {
        'action': 'confirm',
        'label': t('app.composables.useConfirmationModal.modal.confirm'),
        'color': 'neutral',
        'data-testid': `${dataTestid}:confirm`,
        ...confirm,
      },
    ],
    close: false,
    dismissible: false,
  });

  const confirmAction = async <TCallback extends Callback>(
    cb: TCallback,
    ...args: Parameters<TCallback>
  ) => {
    openModal();
    const action = await actionTaken.value;

    if (action === 'cancel') {
      return;
    }

    return cb(...args);
  };

  return {
    confirmAction,
  };
};
