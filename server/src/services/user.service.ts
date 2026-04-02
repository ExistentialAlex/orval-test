import type {
  CreateUser,
  PaginationResponse,
  UpdateUser,
  User,
} from '<project-name>-schemas';
import type { ServerEnv } from '@env';
import type { Context } from 'hono';
import { UserGetException, UserNotFoundException } from '@/exceptions';
import { convertExternalPaginationResponse, log, paginate } from '../utils';

let users: User[] = [
  {
    id: 1,
    name: 'Alex Ashwood',
    jobTitle: 'Developer',
  },
];

// Add more dummy users
// This is just for testing purposes, in a real application you would fetch this from a database
for (let i = 0; i < 50; i++) {
  users.push({
    id: i + 2,
    name: `User ${i + 1}`,
    jobTitle: 'Developer',
  });
}

export const useUserService = (c: Context<ServerEnv>) => {
  const reqID = c.get('requestId');

  const getUser = (id: number): User => {
    log(`Getting User with ID '${id}'`, reqID);

    if (id === 999) {
      throw new UserGetException(c, { id });
    }

    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new UserNotFoundException(c, { id });
    }

    log(`User Found`, reqID);

    return user;
  };

  const getUsers = (
    page?: number,
    pageSize?: number,
    search?: string,
    sort?: string[] | string,
  ): PaginationResponse<User> => {
    log('Getting paginated list of users', reqID);
    return convertExternalPaginationResponse(c, paginate(users, page, pageSize, search, sort));
  };

  const createUser = (user: CreateUser): User => {
    log('Creating new user', reqID);

    const newUser: User = {
      id: users.length + 1,
      ...user,
    };
    users.push(newUser);

    log('New user created', reqID);

    return newUser;
  };

  const updateUser = (id: number, user: UpdateUser): User => {
    log(`Updating user with ID '${id}'`, reqID);

    const existingUser = getUser(id);
    const updatedUser = { ...existingUser, ...user };
    users = users.map((u) => (u.id === id ? updatedUser : u));

    log('New user created', reqID);

    return updatedUser;
  };

  const deleteUser = (id: number) => {
    log(`Deleting user with ID '${id}'`, reqID);

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new UserNotFoundException(c, { id });
    }
    users.splice(userIndex, 1);

    log('User deleted', reqID);

    return { id };
  };

  return { getUser, getUsers, createUser, updateUser, deleteUser };
};
