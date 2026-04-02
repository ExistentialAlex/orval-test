import type { MessageSchema } from 'orval-test-i18n';

declare module '@intlify/hono' {
  // extend `DefineLocaleMessage` with `ResourceSchema`
  export interface DefineLocaleMessage extends MessageSchema {}
}
