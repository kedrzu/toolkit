module.exports = {
    env: {
        node: true,
        browser: true,
    },
    files: ['*.ts', '*.tsx'],
    // Do not check eslint config files, because they collide with typecsript config.
    ignorePatterns: ['.eslintrc.cjs', 'dist/**/*', 'node_modules/**/*'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'workspaces', 'monorepo'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        './imports',
    ],
    rules: {
        curly: 'error',
        'require-await': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',

        'workspaces/no-relative-imports': 'error',
        'workspaces/no-absolute-imports': 'error',
        'workspaces/require-dependency': 'error',

        'monorepo/no-relative-import': 'error',
    },
};
