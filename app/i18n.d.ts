import type { MessageSchema } from '<project-name>-i18n';

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}
}
