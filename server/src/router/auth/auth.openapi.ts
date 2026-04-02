import { describeRoute, resolver } from 'hono-openapi';
import z from 'zod';

/**
 * OpenAPI documentation for GET Session Endpoint
 */
export const LoginOpenApi = describeRoute({
  description: 'Login to the BFF.',
  tags: ['authentication'],
  responses: {
    200: {
      description: 'Login Successful',
      content: {
        'application/json': {
          schema: resolver(z.object({ message: z.string() })),
        },
      },
    },
    401: {
      description: 'Login not authorized',
      content: {
        'application/json': {
          schema: resolver(z.object({ message: z.string() })),
        },
      },
    },
  },
});
