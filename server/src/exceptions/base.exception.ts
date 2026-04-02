import type { MessageSchema } from '<project-name>-i18n';
import type { ShapeOf } from '<project-name>-types';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { useTranslation } from '@intlify/hono';
import defu from 'defu';
// server/src/exceptions/base.exception.ts
import { HTTPException } from 'hono/http-exception';

export interface HTTPExceptionOptions {
  cause?: unknown;
}

export abstract class BaseException extends HTTPException {
  constructor(
    c: Context,
    status: ContentfulStatusCode,
    translationKey: ShapeOf<MessageSchema>,
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    const t = useTranslation(c);
    const message = translationParams ? t(translationKey, translationParams) : t(translationKey);
    super(status, defu(options, { message }));
  }
}

export class DefaultBadRequestException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.400',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 400, translationKey, translationParams, options);
  }
}

export class DefaultUnauthorisedException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.401',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 401, translationKey, translationParams, options);
  }
}

export class DefaultForbiddenException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.403',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 403, translationKey, translationParams, options);
  }
}

export class DefaultNotFoundException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.404',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 404, translationKey, translationParams, options);
  }
}

export class DefaultConflictException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.409',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 409, translationKey, translationParams, options);
  }
}

export class DefaultUnprocessableException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema> = 'server.exceptions.default.422',
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 422, translationKey, translationParams, options);
  }
}

export class DefaultInternalServerErrorException extends BaseException {
  constructor(
    c: Context,
    translationKey: ShapeOf<MessageSchema>,
    translationParams?: Record<string, unknown>,
    options?: HTTPExceptionOptions,
  ) {
    super(c, 500, translationKey, translationParams, options);
  }
}
