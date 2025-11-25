import js from '@eslint/ts';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },

    settings: {
      react: { version: 'detect' },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
      'unused-imports': unusedImports,
    },

    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // TypeScript rules
      ...tseslint.configs.recommendedTypeChecked[1].rules,

      // React
      ...react.configs.recommended.rules,

      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Prettier (show error when formatting bị sai)
      'prettier/prettier': 'error',

      // Auto remove unused imports
      'unused-imports/no-unused-imports': 'error',

      // React things
      'react/react-in-jsx-scope': 'off', // Vite + React 17+ không cần import React
      'react/jsx-uses-react': 'off',

      // Optional strict
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
];
