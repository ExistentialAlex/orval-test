import { vi } from 'vitest';

export const getUsersMock = vi.fn();
export const getUserMock = vi.fn();
export const createUserMock = vi.fn();
export const updateUserMock = vi.fn();
export const deleteUserMock = vi.fn();

export const mockUserService = () => ({
  getUsers: getUsersMock,
  getUser: getUserMock,
  createUser: createUserMock,
  updateUser: updateUserMock,
  deleteUser: deleteUserMock,
});
