import { addParameters } from '@storybook/react';

addParameters({
  backgrounds: [
    {
      name: 'minimal-light',
      value: 'rgba(248, 246, 246, 0.988)',
      default: true,
    },
    { name: 'dark', value: 'rgb(53, 56, 58)' },
  ],
});
