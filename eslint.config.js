import { js, prettier } from '@studiometa/eslint-config';
import { globals } from '@studiometa/eslint-config/utils';

export default [
  ...js,
  ...prettier,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
