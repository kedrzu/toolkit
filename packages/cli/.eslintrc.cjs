module.exports = {
    root: true,
    extends: [
        //
        // 'plugin:react/recommended',
        // 'plugin:react-hooks/recommended',
        require.resolve('@nzyme/eslint/typescript'),
    ],
    parserOptions: {
        project: [`${__dirname}/tsconfig.json`],
    },
};
