/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,ts,mts,tsx,vue}'],
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    },

    ...pluginVue.configs['flat/recommended'],

    // Add TypeScript parsing for .ts files
    {
        files: ['**/*.{ts,mts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },

    // Add TypeScript parsing for .vue files with TypeScript
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: pluginVue.parser,
            parserOptions: {
                parser: typescriptParser,
                extraFileExtensions: ['.vue'],
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },

    {
        plugins: {
            prettier: prettier,
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4,
                    singleQuote: true,
                    htmlWhitespaceSensitivity: 'ignore',
                    endOfLine: 'auto',
                    printWidth: 120,
                    singleAttributePerLine: false,
                    vueIndentScriptAndStyle: true,
                },
            ],
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                },
            ],
            'vue/no-unused-vars': [
                'error',
                {
                    ignorePattern: '^_',
                },
            ],
            quotes: ['warn', 'single'],
            'no-trailing-spaces': ['error', { skipBlankLines: false }],
            'vue/multi-word-component-names': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/component-api-style': ['error', ['script-setup', 'composition']],
            'vue/html-indent': 'off',
            indent: 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/html-self-closing': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
];
