import type { Env } from 'hono';

export interface ServerEnv extends Env {
  Bindings: {
    VITE_UI_URL: string;
  };
}
