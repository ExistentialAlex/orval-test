import type { Component } from 'vue';
import UApp from '@nuxt/ui/components/App.vue';
import { defineComponent } from 'vue';

export const nuxtUiWrapper = <T extends Component>(page: T) =>
  defineComponent({
    components: { UApp: UApp as unknown as Component, page },
    template: '<UApp data-testid="u-app"><page v-bind="childProps" /></UApp>',
    props: {
      childProps: Object,
    },
  });
