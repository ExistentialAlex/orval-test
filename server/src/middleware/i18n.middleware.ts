import type { MessageSchema } from 'orval-test-i18n';
import { defineIntlifyMiddleware, detectLocaleFromAcceptLanguageHeader } from '@intlify/hono';
import { en } from 'orval-test-i18n';

// define middleware with vue-i18n like options
export const i18nMiddleware = defineIntlifyMiddleware<[MessageSchema], 'en' | 'en-GB'>({
  // detect locale with `accept-language` header
  locale: detectLocaleFromAcceptLanguageHeader,
  // resource messages
  messages: {
    en,
    'en-GB': en,
  },
});
