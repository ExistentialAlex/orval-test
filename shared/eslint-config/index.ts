import antfu from '@antfu/eslint-config';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

/**
 * Base ESLint configuration for the AdTech ADF monorepo
 * Uses @antfu/eslint-config for consistent styling and best practices
 */

export interface SharedConfigOptions {
  /**
   * Enable Vue support
   * @default true for app package
   */
  vue?: boolean;
  /**
   * Enable formatters (prettier, css, etc)
   * @default true
   */
  formatters?: boolean;
  /**
   * Use less opinionated rules
   * @default true
   */
  lessOpinionated?: boolean;
}

/**
 * Create the base ESLint config with common rules
 */
export function createConfig(options: SharedConfigOptions = {}): FlatConfigComposer<any, any> {
  const {
    vue = false,
    formatters = true,
    lessOpinionated = true,
  } = options;

  return antfu({
    formatters,
    vue,
    lessOpinionated,
    typescript: true,
    // Common rules for all packages
    rules: {
      'style/semi': ['error', 'always'],
      'style/arrow-parens': ['warn', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'style/member-delimiter-style': ['error', { multiline: { delimiter: 'semi', requireLast: true }, singleline: { 'delimiter': 'semi', requireLast: false } }],
    },
  });
}

/**
 * Default config for non-Vue packages (server, shared utilities)
 */
export const baseConfig = createConfig();

/**
 * Config for Vue packages (app)
 */
export const vueConfig = createConfig({ vue: true });

export default createConfig;
