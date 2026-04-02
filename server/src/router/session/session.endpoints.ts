import { useTranslation } from '@intlify/hono';
import { Hono } from 'hono';
import { clearSession } from '@/middleware';
import { DeleteSessionOpenApi, GetSessionOpenApi } from './session.openapi';

export const sessionRouter = new Hono()
  .get('/', GetSessionOpenApi, async (c) => {
    // Remove sensitive data from session
    const { secure, ...data } = c.session;

    return c.json(data);
  })
  .delete('/', DeleteSessionOpenApi, async (c) => {
    const t = await useTranslation(c);
    clearSession(c);
    return c.json({ message: t('server.session.delete') });
  });
