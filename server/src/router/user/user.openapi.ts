import { PaginationResponseSchema, UserSchema } from '<project-name>-schemas';
import { describeRoute, resolver } from 'hono-openapi';
import z from 'zod';

/**
 * OpenAPI documentation for User List Endpoint
 */
export const UserListOpenApi = describeRoute({
  description: 'Get list of users',
  tags: ['users'],
  responses: {
    200: {
      description: 'List of Users',
      content: {
        'application/json': {
          schema: resolver(PaginationResponseSchema(UserSchema)),
        },
      },
    },
  },
});

/**
 * OpenAPI documentation for Get User Endpoint
 */
export const GetUserOpenApi = describeRoute({
  description: 'Get user by ID',
  tags: ['users'],
  responses: {
    200: {
      description: 'User Details',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    404: {
      description: 'User not found',
    },
  },
});

/**
 * OpenAPI documentation for Create User Endpoint
 */
export const CreateUserOpenApi = describeRoute({
  description: 'Create a new user',
  tags: ['users'],
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    400: {
      description: 'Invalid input',
    },
  },
});

/**
 * OpenAPI documentation for Update User Endpoint
 */
export const UpdateUserOpenApi = describeRoute({
  description: 'Update user by ID',
  tags: ['users'],
  responses: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    404: {
      description: 'User not found',
    },
    400: {
      description: 'Invalid input',
    },
  },
});

/**
 * OpenAPI documentation for Delete User Endpoint
 */
export const DeleteUserOpenApi = describeRoute({
  description: 'Delete user by ID',
  tags: ['users'],
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: resolver(z.object({ id: z.number() })),
        },
      },
    },
    404: {
      description: 'User not found',
    },
  },
});
