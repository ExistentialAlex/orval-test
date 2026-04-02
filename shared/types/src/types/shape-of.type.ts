import type { I18nFunctions } from './i18n';

export type ShapeOf<T extends Record<string, any>> = keyof {
  [K in keyof T as T[K] extends string
    ? K
    : T[K] extends (functions: I18nFunctions) => string
      ? K
      : T[K] extends Record<string, unknown>
        ? `${K & string}.${ShapeOf<T[K]> & string}`
        : never]: any;
};
