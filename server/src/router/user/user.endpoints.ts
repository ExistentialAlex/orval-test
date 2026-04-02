import type { ServerEnv } from '@env';
import {
  CreateUserSchema,
  GetUserSchema,
  PaginationQuerySchema,
  UpdateUserSchema,
} from '<project-name>-schemas';
import { Hono } from 'hono';
import { requireUserSession, zValidator } from '@/middleware';
import { useUserService } from '@/services';
import {
  CreateUserOpenApi,
  DeleteUserOpenApi,
  GetUserOpenApi,
  UpdateUserOpenApi,
  UserListOpenApi,
} from './user.openapi';

const userRouter = new Hono<ServerEnv>()
  .use(requireUserSession())
  /**
   * User List Endpoint
   */
  .get('/', UserListOpenApi, zValidator('query', PaginationQuerySchema), async (c) => {
    const { getUsers } = useUserService(c);

    const { page, page_size, search, sort } = c.req.valid('query');
    const users = await getUsers(page, page_size, search, sort);
    return c.json(users);
  })
  /**
   * User Detail Endpoint
   */
  .get('/:id', GetUserOpenApi, zValidator('param', GetUserSchema), async (c) => {
    const { getUser } = useUserService(c);
    const { id } = c.req.valid('param');
    const user = await getUser(id);

    return c.json(user);
  })
  /**
   * Create User Endpoint
   */
  .post('/', CreateUserOpenApi, zValidator('json', CreateUserSchema), async (c) => {
    const { createUser } = useUserService(c);
    const user = await createUser(c.req.valid('json'));
    return c.json(user, 201);
  })
  /**
   * Update User Endpoint
   */
  .patch(
    '/:id',
    UpdateUserOpenApi,
    zValidator('param', GetUserSchema),
    zValidator('json', UpdateUserSchema),
    async (c) => {
      const { updateUser } = useUserService(c);

      const { id } = c.req.valid('param');
      const user = await updateUser(id, c.req.valid('json'));

      return c.json(user);
    },
  )
  /**
   * Delete User Endpoint
   */
  .delete('/:id', DeleteUserOpenApi, zValidator('param', GetUserSchema), async (c) => {
    const { deleteUser } = useUserService(c);

    const { id } = c.req.valid('param');
    deleteUser(id);

    return c.json({ id });
  });

export { userRouter };
