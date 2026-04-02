import type { User } from '<project-name>-schemas';
import type { UseQueryOptions } from '@pinia/colada';
import type { MaybeRefOrGetter } from 'vue';
import { useQuery } from '@pinia/colada';
import { toValue } from 'vue';
import { useFetch } from '@/core';

export const useGetUser = (
  id: MaybeRefOrGetter<string>,
  options: Partial<UseQueryOptions<User>> = {},
) => {
  const { $fetch } = useFetch();

  return useQuery({
    key: ['user-details', toValue(id)],
    query: async () => $fetch<User>(`/users/${toValue(id)}`),
    ...options,
  });
};
