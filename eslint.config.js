import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.mjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node
            },
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json'
            }
        },
        plugins: {'@typescript-eslint': tseslint},
        rules: {
            ...js.configs.recommended.rules,
            'quotes': ['error', 'single'],
            'indent': ['error', 2],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    }
];