import type { Hook } from '@hono/standard-validator';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Context, Env, ValidationTargets } from 'hono';
import type { $ZodIssue } from 'zod/v4/core';
import { useTranslation } from '@intlify/hono';
import { validator } from 'hono-openapi';

const translateErrors = async <E extends Env>(c: Context<E>, issues: $ZodIssue[]) => {
  const t = await useTranslation(c);
  const translatedIssues = [];

  for (const issue of issues) {
    if (issue.code !== 'custom') {
      translatedIssues.push(issue);
      continue;
    }

    const params = issue.params as { i18n: string; i18nParams?: Record<string, unknown> };

    if (!params.i18n) {
      translatedIssues.push(issue);
      continue;
    }

    const message = t(params.i18n, params.i18nParams || {});

    translatedIssues.push({
      ...issue,
      message,
    });
  }

  return translatedIssues;
};

export const zValidator = <
  Schema extends StandardSchemaV1,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
>(
  target: Target,
  schema: Schema,
  hook?: Hook<StandardSchemaV1.InferOutput<Schema>, E, P, Target>,
) =>
  validator(target, schema, async (result, c: Context<E, P, object>) => {
    if (!result.success) {
      result.error = await translateErrors(c, result.error as $ZodIssue[]);

      return hook ? hook(result, c) : c.json(result, 400);
    }

    if (hook) {
      return hook(result, c);
    }
  });
