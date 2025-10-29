// eslint.config.mjs
import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import perfectionist from 'eslint-plugin-perfectionist';

const ignoreFiles = [
  '**/commitlint.config.cjs',
  '**/.temp',
  '**/.*', // ignore all dotfiles
  '**/.git',
  '**/.hg',
  '**/.pnp.*',
  '**/.svn',
  '**/playwright.config.ts',
  '**/jest.config.js',
  '**/tsconfig.tsbuildinfo',
  '**/README.md',
  '**/payload-types.ts',
  '**/dist/',
  '**/.yarn/',
  '**/build/',
  '**/node_modules/**',
  '**/temp/',
];
export default antfu(
  {
    // Code style
    stylistic: {
      semi: true,
    },

    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    // Ignored paths
    ignores: ignoreFiles,

    isInEditor: true,

    nextjs: true,
    react: true,

  },
  {
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    plugins: { '@next/next': nextPlugin },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': ['error', {
        type: 'line-length',
        order: 'asc',
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
          'unknown',
        ],
      }],
    },
  },
  {
    rules: {
      'antfu/imports/order': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      'ts/ban-ts-comment': 'off',
      'unused-imports/no-unused-imports': ['error'],
    },
  },
);
