# <project-name>-types

This directory contains the TypeScript types used across the project.
These types are shared between the app and server, ensuring consistency in data structures and interfaces.

## Usage

To use these types in your project, import them from the <project-name>-types package. For example:

```typescript
import { User } from '<project-name>-types';
```

## Structure

The directory structure of this package is as follows:

```text
shared/types/
├── src/
│   ├── enums/ // Contains all the TypeScript enums
│   ├── types/ // Contains all the TypeScript types
│   └── index.ts // Entry point for the types
```

### Enums

This project does not use traditional enums, but instead uses TypeScript's union types to define enumerated values. This allows for better type safety and flexibility in the codebase.

## Key Types

These are some of the key types defined in this package that will need to be updated as the project evolves

### session.type.ts

This file defines the structure of user session data across the app and server. It is broken up into several interfaces:

- `User`: Represents a user with an email address. Used for identifying the user in the session. Extend this interface to add additional user fields as needed.
- `SecureSessionData`: Private session data only available on the server side. Extend this interface to add secure fields that are only available on the server.
- `UserSession`: The main session object. Contains:
  - `id`: The session ID (string).
  - `user`: (optional) The user data, available on both client and server.
  - `secure`: (optional) Private session data, only available on the server.
  - `[key: string]: unknown`: Allows for additional custom session fields, available on both client and server.
