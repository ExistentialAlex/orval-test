import { useTranslation } from '@intlify/hono';
import { Hono } from 'hono';
import { PingOpenApi } from './ping.openapi';

export const pingRouter = new Hono().get('/', PingOpenApi, async (c) => {
  const t = await useTranslation(c);
  return c.json({ message: t('server.ping') });
});
