import eslintPluginZod from 'eslint-plugin-zod';
import { baseConfig } from 'orval-test-eslint-config';

export default baseConfig
  .append(eslintPluginZod.configs.recommended)
  .append({
    rules: {
      'zod/require-error-message': 'off',
    },
  });
