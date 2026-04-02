import type { Context } from 'hono';
import type { HTTPExceptionOptions } from './base.exception';
import {
  DefaultInternalServerErrorException,
  DefaultNotFoundException,

} from './base.exception';

export class UserNotFoundException extends DefaultNotFoundException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.user-not-found', translationParams, options);
  }
}

export class UserListException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.list', translationParams, options);
  }
}

export class UserGetException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.get', translationParams, options);
  }
}

export class UserCreateException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.create', translationParams, options);
  }
}

export class UserUpdateException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.update', translationParams, options);
  }
}

export class UserDeleteException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.users.delete', translationParams, options);
  }
}
