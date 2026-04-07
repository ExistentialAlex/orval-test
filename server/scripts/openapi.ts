import type { Hono } from 'hono';
import type { ServerEnv } from '../env';
import { writeFileSync } from 'node:fs';
import { generateSpecs } from 'hono-openapi';
import { routes } from '../src';
import { OPEN_API_DOCUMENTATION } from '../src/core';

const generateOpenApiSpec = async (app: Hono<ServerEnv>) => {
  const specs = await generateSpecs(app, OPEN_API_DOCUMENTATION);

  writeFileSync('./openapi.json', JSON.stringify(specs, null, 2), { });
};

generateOpenApiSpec(routes);
