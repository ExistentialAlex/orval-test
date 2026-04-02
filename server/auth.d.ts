import type { UserSession } from '<project-name>-types';
import 'hono-session/global';

declare module 'hono-session' {
  export interface Session extends UserSession {}
}
