import { UserConfig } from 'vite';

export const BASIC_CONF: UserConfig = {
  plugins: [],
  resolve: {
    // set an alias for easy development
    alias: {
      '@': './src',
    },
  },
};
