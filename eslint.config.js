import configJS from '@maikovskii-danil/eslint-config-js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'dist',
    'eslint.config.js',
    'playwright.config.ts',
    'tests',
    'tests-examples',
  ]),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: [
      configJS.configs.core,
      configJS.configs.linterOptionsDefault,
      configJS.configs.languageOptionsDefault,
      tseslint.configs.recommended,
    ],
    rules: {
      'sort-imports': 0,
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
  {
    files: ['**/*.{tsx,jsx}'],
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'],
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      ...pluginReact.configs.flat['jsx-runtime'].languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
]);
