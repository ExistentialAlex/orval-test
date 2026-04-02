import type { CreateUser, User } from '<project-name>-schemas';
import type { FetchError } from 'ofetch';
import type { MaybeRefOrGetter } from 'vue';
import { useMutation } from '@pinia/colada';
import { toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/core';

export const useCreateUser = (model: MaybeRefOrGetter<CreateUser>) => {
  const { $fetch } = useFetch();
  const toast = useToast();
  const { t } = useI18n();

  return useMutation({
    mutation: async () =>
      $fetch<User>('/users', {
        method: 'POST',
        body: toValue(model),
      }),
    onSuccess: async (res) => {
      toast.add({
        title: t('app.pages.users.create.toasts.onSuccess.title'),
        description: t('app.pages.users.create.toasts.onSuccess.description', {
          name: res.name,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.pages.users.create.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
  });
};
