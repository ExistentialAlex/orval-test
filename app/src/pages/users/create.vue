<script lang="ts" setup>
import type { CreateUser } from '<project-name>-schemas';
import { CreateUserSchema } from '<project-name>-schemas';
import { definePage } from 'unplugin-vue-router/runtime';
import { reactive, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useDiscardChanges } from '@/composables';
import { useCreateUser } from '@/composables/users';

definePage({
  name: 'create-user',
  meta: {
    title: 'app.pages.users.create.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const router = useRouter();
const { t } = useI18n();

const initialModel: CreateUser = {
  name: '',
  jobTitle: '',
};
const model = reactive<CreateUser>(structuredClone(initialModel));

const form = useTemplateRef('form');
const { mutateAsync: createUser, state } = useCreateUser(model);
const onSubmit = async () => {
  // Wait for the user to be created.
  await createUser();

  // If there's an error, we don't want to navigate away.
  if (state.value.error) {
    return;
  }

  router.push(`/users/${state.value.data?.id}`);
};

const { shouldDiscardChanges } = useDiscardChanges(
  t('app.pages.users.create.modals.unsavedChanges.title'),
  t('app.pages.users.create.modals.unsavedChanges.description'),
  'user-form:confirmation',
  { label: t('app.pages.users.create.modals.unsavedChanges.discard') },
  { label: t('app.pages.users.create.modals.unsavedChanges.continue') },
);

onBeforeRouteLeave(async () => {
  // In this case, the user has been created so we don't want to block the navigation.
  if (state.value.data) {
    return true;
  }

  const discard = await shouldDiscardChanges(initialModel, model);

  if (!discard) {
    form.value?.submit();
    return false;
  }

  return true;
});
</script>

<template>
  <BuilderTemplate
    :title="t('app.pages.users.create.title')"
    back-to="/users"
    data-testid="user-form"
  >
    <template #body>
      <UForm id="user-form" ref="form" :state="model" :schema="CreateUserSchema" @submit="onSubmit">
        <FormCardHeader
          :title="t('app.pages.users.create.form.title')"
          :description="t('app.pages.users.create.form.description')"
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
        data-testid="user-form:create"
        color="neutral"
        form="user-form"
      >
        {{ t('app.pages.users.create.form.submit') }}
      </UButton>
    </template>
  </BuilderTemplate>
</template>
