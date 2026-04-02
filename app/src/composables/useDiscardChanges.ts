import type { ButtonProps } from '@nuxt/ui';
import { deepEqual } from 'fast-equals';
import { useI18n } from 'vue-i18n';
import { useActionModal } from './useActionModal';

export interface UseDiscardChangesComposable {
  /**
   * Check whether the user wants to discard their changes or continue editing.
   * If the models are the same, not modal pops up.
   * Otherwise, a modal appears asking the user to confirm if they want to keep their changes or not.
   * @param initialModel The initial version of the model.
   * @param currentModel The current version of the model.
   */
  shouldDiscardChanges: <T>(initialModel: T, currentModel: T) => Promise<boolean>;
}

export const useDiscardChanges = (
  title: string,
  description: string,
  dataTestid: string,
  cancel?: ButtonProps,
  confirm?: ButtonProps,
): UseDiscardChangesComposable => {
  const { t } = useI18n();
  const { open: openModal, actionTaken } = useActionModal({
    title,
    description,
    dataTestid,
    actions: [
      {
        'action': 'discard',
        'label': t('app.composables.useDiscardChanges.modal.discard'),
        'variant': 'outline',
        'color': 'neutral',
        'class': 'ml-auto',
        'data-testid': `${dataTestid}:discard`,
        ...cancel,
      },
      {
        'action': 'continue',
        'label': t('app.composables.useDiscardChanges.modal.continue'),
        'color': 'neutral',
        'data-testid': `${dataTestid}:continue`,
        ...confirm,
      },
    ],
    close: false,
    dismissible: false,
  });

  const shouldDiscardChanges = async <T>(initialModel: T, currentModel: T) => {
    if (deepEqual(initialModel, currentModel)) {
      return true;
    }

    openModal();
    const action = await actionTaken.value;

    if (action === 'discard') {
      return true;
    }

    return false;
  };

  return {
    shouldDiscardChanges,
  };
};
