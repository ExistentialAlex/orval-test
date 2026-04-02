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
