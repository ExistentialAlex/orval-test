import type { UpdateUser, User } from '<project-name>-schemas';
import type { FetchError } from 'ofetch';
import type { MaybeRefOrGetter } from 'vue';
import { useMutation, useQueryCache } from '@pinia/colada';
import { toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/core';

export const useUpdateUser = () => {
  const { $fetch } = useFetch();
  const toast = useToast();
  const { t } = useI18n();
  const queryCache = useQueryCache();

  return useMutation({
    mutation: async ({
      model,
      id,
    }: {
      model: MaybeRefOrGetter<Partial<UpdateUser>>;
      id: string;
    }) =>
      $fetch<User>(`/users/${id}`, {
        method: 'PATCH',
        body: toValue(model),
      }),
    onSuccess: async (res) => {
      toast.add({
        title: t('app.composables.users.useUpdateUser.toasts.onSuccess.title'),
        description: t('app.composables.users.useUpdateUser.toasts.onSuccess.description', {
          name: res.name,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.users.useUpdateUser.toasts.onError.title'),
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
