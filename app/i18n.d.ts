import type { MessageSchema } from 'orval-test-i18n';

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}
}
