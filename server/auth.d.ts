import type { UserSession } from 'orval-test-types';
import 'hono-session/global';

declare module 'hono-session' {
  export interface Session extends UserSession {}
}
