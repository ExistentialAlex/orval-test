# <project-name>-i18n

This directory contains the i18n schema definitions used across the project.
These schemas are shared between the app and server.

## Usage

To use these schemas in your project, import them from the <project-name>-i18n package. For example:

```typescript
import { MessageSchema } from '<project-name>-i18n';
```

## Structure

The directory structure of this package is as follows:

```text
shared/i18n/
├── src/
│   ├── schemas/ // Contains all the TypeScript schemas
│   ├── message-schema.ts // Contains the message schema type
│   └── index.ts // Entry point for the types
```

### Schemas

This project uses TypeScript's type definitions to define the structure of i18n messages. This allows for better type safety and flexibility in the codebase.

#### Language Support

The schemas are designed to support multiple languages. Each schema can define messages for different locales, ensuring that the application can be easily localized.

| Locale | Description |
| ------ | ----------- |
| en     | English     |
