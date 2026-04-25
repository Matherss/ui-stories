import UiButton from './UiButton.vue';
import { defineComponent, h } from 'vue';

export const directory = '/ui/';

export const Default = {
  propsChanger: {
    text: {
      type: 'input',
      default: 'Click me',
    },
    variant: {
      type: 'select',
      options: ['default', 'primary', 'outline'],
      default: 'default',
    },
    size: {
      type: 'select',
      options: ['sm', 'md', 'lg'],
      default: 'md',
    },
    disabled: {
      type: 'switch',
      default: false,
    },
  },

  renderer: ({ args }: any) =>
    defineComponent({
      setup() {
        return () =>
          h(
            UiButton,
            {
              variant: args.variant,
              size: args.size,
              disabled: args.disabled,
            },
            () => args.text,
          );
      },
    }),
};

export const AllVariants = {
  renderer: () =>
    defineComponent({
      setup() {
        return () =>
          h(
            'div',
            {
              style:
                'display: flex; gap: 12px; flex-wrap: wrap; align-items: center;',
            },
            [
              h(UiButton, { variant: 'default' }, () => 'Default'),
              h(UiButton, { variant: 'primary' }, () => 'Primary'),
              h(UiButton, { variant: 'outline' }, () => 'Outline'),
              h(UiButton, { variant: 'primary', disabled: true }, () => 'Disabled'),
            ],
          );
      },
    }),
};

