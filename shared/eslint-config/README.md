# <project-name>-eslint-config

Shared ESLint configuration for the AdTech ADF monorepo using `@antfu/eslint-config`.

## Usage

### For Server and Shared Packages (No Vue)

```typescript
// eslint.config.ts
import { baseConfig } from '<project-name>-eslint-config';

export default baseConfig;
```

### For App Package (With Vue)

```typescript
// eslint.config.ts
import { vueConfig } from '<project-name>-eslint-config';

export default vueConfig.override('antfu/vue/rules', {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          normal: 'never',
        },
      },
    ],
  },
});
```

### Custom Configuration

```typescript
// eslint.config.ts
import createConfig from '<project-name>-eslint-config';

export default createConfig({ vue: true, formatters: true })
  .override('antfu/typescript/rules', {
    rules: {
      // Your custom TypeScript rules
    },
  });
```

## Configuration Options

- `vue` - Enable Vue support (default: false)
- `formatters` - Enable formatters like Prettier (default: true)
- `lessOpinionated` - Use less opinionated rules (default: true)

## Adding Custom Rules

Each package can extend the base configuration with package-specific rules:

```typescript
import { baseConfig } from '<project-name>-eslint-config';

export default baseConfig.append({
  rules: {
    // Package-specific rules
  },
});
```
