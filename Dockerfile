FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node:24-bookworm AS e2e

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=<project-name>-app exec playwright install --with-deps
RUN pnpm run build

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --filter=<project-name>-server --prod /prod/server
RUN pnpm deploy --filter=<project-name>-app --prod /prod/app

FROM base AS server

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=build --chown=hono:nodejs /prod/server/node_modules /prod/server/node_modules
COPY --from=build --chown=hono:nodejs /prod/server/dist /prod/server/dist
COPY --from=build --chown=hono:nodejs /prod/server/package.json /prod/server/package.json

WORKDIR /prod/server

USER hono
EXPOSE 3000
CMD [ "node", "/prod/server/dist/index.js" ]

FROM nginx:stable-alpine AS app

COPY --from=build /prod/app/dist /usr/share/nginx/html
COPY --from=build /prod/app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]