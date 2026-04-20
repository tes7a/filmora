import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
    },
  },
];
