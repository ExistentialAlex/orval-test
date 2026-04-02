<script setup lang="ts">
import type { CreateUser } from '<project-name>-schemas';
import { CreateUserSchema } from '<project-name>-schemas';
import { useI18n } from 'vue-i18n';

const model = defineModel<Partial<CreateUser>>({ required: true });

const { t } = useI18n();
</script>

<template>
  <UForm :schema="CreateUserSchema.partial()" nested>
    <div class="flex flex-col gap-8">
      <HorizontalFormField
        name="name"
        :label="t('app.components.users.user-details-form.name.label')"
        :description="t('app.components.users.user-details-form.name.description')"
        required
      >
        <UInput v-model="model.name" class="w-full" data-testid="user-form:name" />
      </HorizontalFormField>
      <USeparator />
      <HorizontalFormField
        name="jobTitle"
        :label="t('app.components.users.user-details-form.job-title.label')"
        :description="t('app.components.users.user-details-form.job-title.description')"
        required
      >
        <UInput v-model="model.jobTitle" class="w-full" data-testid="user-form:job-title" />
      </HorizontalFormField>
    </div>
  </UForm>
</template>
