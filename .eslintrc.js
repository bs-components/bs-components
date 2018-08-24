// https://github.com/nzakas/eslint-plugin-typescript
module.exports = {
  parser: 'typescript-eslint-parser',
  extends: ['airbnb-base'],
  plugins: ['typescript'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },

  rules: {

    // just me all the time
    'no-console': 0, // disallow use of console (off by default in the node environment)
    'linebreak-style': 0, // CRLF or LF. . . either is fine.
    'max-len': ['warn', { code: 175 }], // wide monitor

    // this project
    'newline-per-chained-call': 'off', // testcafe readability
    'lines-between-class-members': ["error", "always", { exceptAfterSingleLine: true }],
    'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
    'no-undef': 'off',

    // typescript handles these
    'import/no-unresolved': 'off', // not needed for typescript
    'import/no-extraneous-dependencies': 'off',

  },
  // overrides: {
  //   // workaround for: https://github.com/eslint/typescript-eslint-parser/issues/416#issuecomment-363115171
  //   files: ['**/*.ts'],
  //   parser: 'typescript-eslint-parser',
  //   rules: {
  //     'no-undef': 'off',
  //   },
  // },
};
