# <project-name>-app

This is a [VueJS](https://vuejs.org/) UI for the <project-name> application. It contains the frontend views, components and logic necessary to interact with the backend services.

This project uses [Vite](https://vitejs.dev/) for development and build tooling.

## Project Overview

This application includes a basic login flow, with protected routes and a session set up.

This is achieved with several included bits of functionality to achieve this that can be utilised in building a full application.

### Types

#### router.d.ts

This types file allows a developer to define the structure of route meta data.

#### env.d.ts

This types file allows a developer to define the types of environment variables that are used throughout the app.

### Utilities

#### fetch

A file containing a global [ofetch](https://unjs.io/packages/ofetch) instance exposed as `$fetch`. This allows the setting of a base URL through the `VITE_API_BASE_URL` environment variable and allows a developer to configure interceptors themselves that will apply across the application.

```typescript
import { $fetch } from '@/utils';

const doFetch = async () => {
  const res = await $fetch('/my-url');
  return res;
};
```

#### ...

Improve code discoverability by adding additional entries.

### Composables

#### useUserSession

A composable used for accessing the user session within the application. This automatically unwraps the corresponding refs from the session store for a better developer experience and makes certain interactions easier.

```typescript
import { useUserSession } from '@/composables';

const { loggedIn, ready, session, user, fetch, clear, openInPopup } = useUserSession();
```

#### ...

Improve code discoverability by adding additional entries.

### Stores

#### Session Store

A store for managing user sessions with the app. This is set up to allow retrieving the user session from the BFF and for clearing it in the event of a logout or some other event.

NOTE - It isn't recommended to use this store directly in your code. Please instead use the `useUserSession` composable.

```typescript
import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/stores';

const sessionStore = useSessionStore();
const { sessionState, authReadyState } = storeToRefs(sessionStore); // Session State
const { fetch, clear } = sessionStore; // .Session functions
```

#### ...

Improve code discoverability by adding additional entries.

## Getting Started

### Development

To start the development server with hot reload:

```sh
pnpm run dev # pnpm
```

### Build

To build the UI for production:

```sh
pnpm run build # pnpm
```

### Lint

To lint the codebase:

```sh
pnpm run lint # pnpm
```

### Test

To run tests:

```sh
pnpm run test # pnpm
```
