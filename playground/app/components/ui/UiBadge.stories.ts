import UiBadge from './UiBadge.vue';

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
    }
  },

  renderer: () => ({
    components: { UiBadge },
    template: '<UiBadge :color="color" :badgeStyles="badgeStyles">{{ text }}</UiBadge>',
  }),
};

export const AllColors = {
  renderer: () => ({
    components: { UiBadge },
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <UiBadge color="gray">Gray</UiBadge>
        <UiBadge color="green">Green</UiBadge>
        <UiBadge color="red">Red</UiBadge>
        <UiBadge color="blue">Blue</UiBadge>
        <UiBadge color="yellow">Yellow</UiBadge>
      </div>
    `,
  }),
};
