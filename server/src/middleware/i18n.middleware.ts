import type { MessageSchema } from '<project-name>-i18n';
import { en } from '<project-name>-i18n';
import { defineIntlifyMiddleware, detectLocaleFromAcceptLanguageHeader } from '@intlify/hono';

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
