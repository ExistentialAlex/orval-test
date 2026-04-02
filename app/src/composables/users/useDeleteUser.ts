import type { FetchError } from 'ofetch';
import { useMutation, useQueryCache } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/core';

export const useDeleteUser = () => {
  const { $fetch } = useFetch();
  const toast = useToast();
  const { t } = useI18n();
  const queryCache = useQueryCache();

  return useMutation({
    mutation: async ({ id }: { id: string }) =>
      $fetch(`/users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: async (res, { id }) => {
      toast.add({
        title: t('app.composables.users.useDeleteUser.toasts.onSuccess.title'),
        description: t('app.composables.users.useDeleteUser.toasts.onSuccess.description', {
          id,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.users.useDeleteUser.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
    onSettled: (_, __, vars) => {
      queryCache.invalidateQueries({ key: ['user-details', vars.id], exact: true }); // Invalidate edit page query
      queryCache.invalidateQueries({ key: ['users'], exact: true }); // Invalidate list view query
    },
  });
};
