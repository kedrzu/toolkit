module.exports = {
    root: true,
    extends: [
        //
        require.resolve('@nzyme/eslint/typescript'),
        require.resolve('@nzyme/eslint/jsdoc'),
    ],
    parserOptions: {
        project: [
            `${__dirname}/tsconfig.json`,
            // TS config for tests
            `${__dirname}/tsconfig.tests.json`,
        ],
    },
};
