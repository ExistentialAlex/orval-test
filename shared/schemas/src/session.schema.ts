import * as z from 'zod';

export const UserSessionSchema = z.object({
  email: z.string(),
  name: z.string(),
  company: z.string(),
  avatar: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
});
export type UserSession = z.infer<typeof UserSessionSchema>;

export const SecureSessionSchema = z.object({
  authToken: z.string().optional(),
});
export type SecureSession = z.infer<typeof SecureSessionSchema>;

export const SessionSchema = z.looseObject({
  id: z.string(),
  user: UserSessionSchema.optional(),
  secure: SecureSessionSchema.optional(),
});
export type Session = z.infer<typeof SessionSchema>;
