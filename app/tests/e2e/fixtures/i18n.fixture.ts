import type { MessageSchema } from 'orval-test-i18n';
import type { ShapeOf } from 'orval-test-types';
import path from 'node:path';

export const i18nFixture = async (locale: string | undefined) => {
  let messages;
  const enPath = './shared/i18n/src/locales/en.json';

  if (locale === 'en' || locale === 'en-GB' || locale === 'en-US') {
    messages = await import(path.join('../../../../', enPath), { with: { type: 'json' } });
  }
  else {
    throw new Error(`Unsupported locale selected: '${locale}'`);
  }

  return (k: ShapeOf<MessageSchema> | (string & {}), params?: Record<string, unknown>) => {
    const keys = k.split('.');

    if (!keys.length) {
      throw new Error('Invalid keys provided.');
    }

    let message = messages.default;

    for (const key of keys) {
      if (typeof message === 'string') {
        break;
      }

      message = message[key];
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        (message as string).replace(`{${key}}`, String(value));
      }
    }

    return message;
  };
};
