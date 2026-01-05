const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['app/dist/**', 'node_modules/**', 'eslint.config.cjs']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      },
      globals: {
        process: 'readonly',
        window: 'readonly',
        document: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin
    },
    rules: {
      // Use TypeScript-aware rules instead of base ones
      ...js.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      'import/no-unresolved': 'off'
    }
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    rules: {
      // Relax strict rules for test support files
      '@typescript-eslint/require-await': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];
