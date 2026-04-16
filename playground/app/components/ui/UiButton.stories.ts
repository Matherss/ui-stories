import UiButton from './UiButton.vue';

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

  renderer: () => ({
    components: { UiButton },
    template: `
      <UiButton
        :variant="variant"
        :size="size"
        :disabled="disabled"
      >
        {{ text }}
      </UiButton>
    `,
  }),
};

export const AllVariants = {
  renderer: () => ({
    components: { UiButton },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <UiButton variant="default">Default</UiButton>
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="outline">Outline</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
      </div>
    `,
  }),
};
