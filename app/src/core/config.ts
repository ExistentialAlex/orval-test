/* eslint-disable antfu/no-top-level-await */
import { doublet } from '<project-name>-utils';
import { ofetch } from 'ofetch';
import { computed } from 'vue';

// Retrieve the configuration file from the server
const [err, config] = await doublet(ofetch<ImportMetaEnv>, '/config.json');

// If there was an error retrieving the configuration, throw it
if (err) {
  throw err;
}

/**
 * A composable function that provides access to the application configuration.
 * @returns An object containing the configuration
 */
export const useConfig = () => {
  return {
    config: computed(() => config),
  };
};
