import * as z from 'zod';

export const AuthSchema = z.object({
  email: z
    .string()
    .refine((v) => !!v, { params: { i18n: 'schemas.AuthSchema.email.required' } })
    .refine((v) => new RegExp(z.regexes.email).test(v), {
      params: { i18n: 'schemas.AuthSchema.email.valid' },
    }),
  organisation: z
    .string()
    .refine((v) => !!v, { params: { i18n: 'schemas.AuthSchema.organisation' } }),
});
export type Auth = z.infer<typeof AuthSchema>;
