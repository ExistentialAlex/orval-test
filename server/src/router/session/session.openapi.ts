import { UserSessionSchema } from '<project-name>-schemas';
import { describeRoute, resolver } from 'hono-openapi';
import z from 'zod';

/**
 * OpenAPI documentation for GET Session Endpoint
 */
export const GetSessionOpenApi = describeRoute({
  description: 'Get public session data.',
  tags: ['session'],
  responses: {
    200: {
      description: 'Public Session Data',
      content: {
        'application/json': {
          schema: resolver(UserSessionSchema),
        },
      },
    },
  },
});

/**
 * OpenAPI documentation for DELETE Session Endpoint
 */
export const DeleteSessionOpenApi = describeRoute({
  description: 'Delete the current user session.',
  tags: ['session'],
  responses: {
    200: {
      description: 'Session Deleted',
      content: {
        'application/json': {
          schema: resolver(z.object({ message: z.string() })),
        },
      },
    },
  },
});
