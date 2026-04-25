import UiBadge from './UiBadge.vue';
import { defineComponent, h } from 'vue';

export const directory = '/ui/';

export const Default = {
  propsChanger: {
    text: {
      type: 'input',
      default: 'Badge',
    },
    color: {
      type: 'select',
      options: ['gray', 'green', 'red', 'blue', 'yellow'],
      default: 'gray',
    },
    badgeStyles: {
      type: 'object',
      default: {
        background: 'gray',
        fontSize: '16px',
      },
    },
  },

  renderer: ({ args }: any) =>
    defineComponent({
      setup() {
        return () =>
          h(
            UiBadge,
            { color: args.color, badgeStyles: args.badgeStyles },
            () => args.text,
          );
      },
    }),
};

export const AllColors = {
  renderer: () =>
    defineComponent({
      setup() {
        return () =>
          h(
            'div',
            { style: 'display: flex; gap: 8px; flex-wrap: wrap;' },
            [
              h(UiBadge, { color: 'gray' }, () => 'Gray'),
              h(UiBadge, { color: 'green' }, () => 'Green'),
              h(UiBadge, { color: 'red' }, () => 'Red'),
              h(UiBadge, { color: 'blue' }, () => 'Blue'),
              h(UiBadge, { color: 'yellow' }, () => 'Yellow'),
            ],
          );
      },
    }),
};

