import eslintPluginZod from 'eslint-plugin-zod';
import { baseConfig } from '<project-name>-eslint-config';

export default baseConfig
  .append(eslintPluginZod.configs.recommended)
  .append({
    rules: {
      'zod/require-error-message': 'off',
    },
  });
