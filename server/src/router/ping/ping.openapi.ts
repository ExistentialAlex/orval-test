import { describeRoute, resolver } from 'hono-openapi';
import z from 'zod';

/**
 * OpenAPI documentation for GET Ping Endpoint
 */
export const PingOpenApi = describeRoute({
  description: 'Health-check endpoint',
  responses: {
    200: {
      description: 'Ping',
      content: {
        'application/json': {
          schema: resolver(z.object({ message: z.string() })),
        },
      },
    },
  },
});
