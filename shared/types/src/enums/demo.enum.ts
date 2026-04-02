import type { Enum } from '@/types';

// Rather than using the Typescript enum syntax, use the following as it affords better type support and compiles to more what we expect.
export const DemoEnum = {
  test: 'test value',
} as const;

export type Demo = Enum<typeof DemoEnum>;
