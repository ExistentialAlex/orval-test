# Copilot Instructions for AI Coding Agents

## Project Overview

- This is a monorepo template for AdTech UI and Backend for Frontend (BFF) applications.
- Major packages:
  - `app/`: VueJS frontend (Vite-based, login/session flow, protected routes)
  - `server/`: Hono-based BFF server (Vite-based, API endpoints for frontend)
  - `shared/`: Utilities, types, schemas (sub-packages for cross-app sharing)
- Uses `pnpm` workspaces by default, but supports npm/yarn with config changes.

## Initialization & Setup

- Run `node scripts/init.js <project-name> <platform-team-name>` to replace template placeholders (`<project-name>`, `<platform-team-name>`) across all code/text files.
- After init, update `CODEOWNERS` for team notifications.
- Install dependencies for all packages with `pnpm install` (or `npm install`, `yarn install`).

## Build & Test Workflows

### Build & Test Workflows (use root package.json scripts)

- Build all packages: `pnpm run build`
- Run all tests (unit/e2e): `pnpm test`
- Run unit tests: `pnpm run test:unit`
- Run end-to-end (E2E) tests: `pnpm run test:e2e`
  > Do not run test/build scripts directly from individual packages. Always use the root-level scripts for consistency and CI compatibility.

## Conventions & Patterns

- All packages use TypeScript and Vite config files.
- Shared code is imported via workspace aliases (see `pnpm-workspace.yaml`, `tsconfig.json`).
- UI routing/guards: see `app/src/router/`, `app/src/guards/`
- Session state: see `app/src/stores/session.store.ts`, `app/src/composables/useUserSession.ts`
- Server middleware: see `server/src/middleware/`
- External schemas/types: see `shared/schemas/`, `shared/types/`
- Prefer kebab-case for project/team names (enforced by init script).

## Integration Points

- UI communicates with BFF via REST endpoints (see `server/src/router/`).
- Shared packages are imported using workspace paths (no relative imports between packages).
- Docker/Kubernetes configs in root and `server/kubernetes/` for deployment.

## Examples

- To add a new shared utility: create in `shared/utils/src/`, export in `shared/utils/package.json`.
- To add a new API route: update `server/src/router/`, add tests in `server/tests/endpoints/`.
- To add a new UI view: add to `app/src/views/`, update `app/src/router/index.ts`.

## Additional Notes

- All new packages should be added to `pnpm-workspace.yaml` and root `package.json` workspaces.
- For questions, see package-level README files for specific details.
