import * as z from 'zod';
import { max, min } from './utils';

export const UserSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .refine(min(1), {
      params: {
        i18n: 'schemas.UserSchema.name.min',
      },
    })
    .refine(max(100), {
      params: {
        i18n: 'schemas.UserSchema.name.max',
      },
    }),
  jobTitle: z
    .string()
    .refine(min(1), {
      params: {
        i18n: 'schemas.UserSchema.job-title.min',
      },
    })
    .refine(max(100), {
      params: {
        i18n: 'schemas.UserSchema.job-title.max',
      },
    }),
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const GetUserSchema = z.object({
  id: z.coerce.number(),
});
export type GetUser = z.infer<typeof GetUserSchema>;
