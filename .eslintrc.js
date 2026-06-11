module.exports = {
    root: true,
    ignorePatterns: ['dist/', 'node_modules/'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import', 'prefer-arrow'],
    rules: {
        'curly': ['error', 'all'],
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-console': 'error',
        'no-debugger': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'import/order': ['error', {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
            'newlines-between': 'always',
        }],
        'prefer-arrow/prefer-arrow-functions': ['error', { disallowPrototype: true }],
    },
    env: {
        node: true,
        es2022: true,
    },
};
