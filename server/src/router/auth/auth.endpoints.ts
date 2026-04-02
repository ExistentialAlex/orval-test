import { AuthSchema } from '<project-name>-schemas';
import { useTranslation } from '@intlify/hono';
import { Hono } from 'hono';
import { zValidator } from '@/middleware';
import { LoginOpenApi } from './auth.openapi';

export const authRouter = new Hono().post(
  '/login',
  zValidator('json', AuthSchema),
  LoginOpenApi,
  async (c) => {
    const t = await useTranslation(c);

    // Handle user login logic here
    const { email, organisation } = c.req.valid('json');
    const session = c.get('session');

    if (!email || !organisation) {
      return c.json({ message: t('server.auth.login.responses.401') }, 401);
    }

    let token: string;

    switch (organisation) {
      case 'Organisation A':
        token = '1234';
        break;
      case 'Organisation B':
        token = '5678';
        break;
      case 'Test Organisation A':
        token = 'test_token1';
        break;
      case 'Test Organisation B':
        token = 'test_token2';
        break;
      default:
        token = '';
    }

    session.secure = { authToken: token };
    session.user = {
      email,
      name: 'Test User',
      company: organisation,
      avatar: {
        src: 'https://images.dog.ceo/breeds/schnauzer-giant/n02097130_572.jpg',
        alt: 'Test User',
      },
    };

    await session.regenerate();

    return c.json({ message: t('server.auth.login.responses.201') }, 200);
  },
);
