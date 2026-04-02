import type { MessageSchema } from '<project-name>-i18n';

declare module '@intlify/hono' {
  // extend `DefineLocaleMessage` with `ResourceSchema`
  export interface DefineLocaleMessage extends MessageSchema {}
}
