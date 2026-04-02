<script lang="ts" setup>
import type { UpdateUser } from '<project-name>-schemas';
import type { FetchError } from 'ofetch';
import { UpdateUserSchema } from '<project-name>-schemas';
import { definePage } from 'unplugin-vue-router/runtime';
import { ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useDiscardChanges } from '@/composables';
import { useGetUser, useUpdateUser } from '@/composables/users';

definePage({
  name: 'edit-user',
  meta: {
    title: 'app.pages.users.edit.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const toast = useToast();
const route = useRoute('edit-user');
const router = useRouter();
const { t } = useI18n();

const { error, data } = useGetUser(route.params.id);

watch(error, (err) => {
  if ((err as FetchError).status === 404) {
    router.push({
      name: 'not-found',
      params: { path: route.path.substring(1) },
      query: route.query,
      hash: route.hash,
    });
    return;
  }

  toast.add({
    title: t('app.pages.users.edit.toasts.onFetchError.title'),
    description: err?.message,
    color: 'error',
    icon: 'i-lucide-alert-triangle',
  });
  router.push({ name: 'user-list' });
});

const initialModel: Partial<UpdateUser> = {};
const model = ref<Partial<UpdateUser>>({});

watch(data, (data) => {
  initialModel.name = data?.name;
  initialModel.jobTitle = data?.jobTitle;

  model.value = structuredClone(initialModel);
});

const form = useTemplateRef('form');
const { mutateAsync: updateAttribute, status } = useUpdateUser();
const onSubmit = async () => {
  await updateAttribute({ model: model.value, id: route.params.id });
};

const { shouldDiscardChanges } = useDiscardChanges(
  t('app.pages.users.edit.modals.unsavedChanges.title'),
  t('app.pages.users.edit.modals.unsavedChanges.description'),
  'user-form:confirmation',
  { label: t('app.pages.users.edit.modals.unsavedChanges.discard') },
  { label: t('app.pages.users.edit.modals.unsavedChanges.continue') },
);

onBeforeRouteLeave(async () => {
  const discard = await shouldDiscardChanges(initialModel, model.value);

  if (!discard) {
    await form.value?.submit();

    if (status.value === 'error' || form.value?.errors.length) {
      return false;
    }
  }

  return true;
});
</script>

<template>
  <BuilderTemplate
    :title="t('app.attributes.views.edit.title')"
    back-to="/users"
    data-testid="user-form"
  >
    <template #body>
      <UForm id="user-form" ref="form" :state="model" :schema="UpdateUserSchema" @submit="onSubmit">
        <FormCardHeader
          :title="t('app.pages.users.edit.form.title')"
          :description="t('app.pages.users.edit.form.description')"
        />
        <UPageCard variant="subtle" class="mb-8">
          <div class="flex flex-col gap-8">
            <UserDetailsForm v-model="model" />
          </div>
        </UPageCard>
      </UForm>
    </template>
    <template #footer>
      <UButton
        type="submit"
        class="ml-auto justify-center"
        data-testid="user-form:save"
        color="neutral"
        form="user-form"
      >
        {{ t('app.pages.users.edit.form.submit') }}
      </UButton>
    </template>
  </BuilderTemplate>
</template>
