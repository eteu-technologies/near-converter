module.exports = {
    root: true,
    env: {
        es2020: true,
        browser: true,
        node: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/typescript'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    ignorePatterns: [
        '**/wasm/pkg/*.js'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'indent': ['error', 4],
        'arrow-parens': 'off',
        'no-unused-vars': ['warn'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 6,
            'multiline': {
                'max': 1,
                'allowFirstLine': true
            }
        }],
        'vue/html-closing-bracket-newline': ['error', {
            'singleline': 'never',
            'multiline': 'never'
        }],
    },
};
