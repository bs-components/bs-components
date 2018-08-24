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
    'no-console': 'off', // disallow use of console (off by default in the node environment)
    'linebreak-style': 'off', // CRLF or LF. . . either is fine.
    'max-len': ['warn', { code: 175 }], // wide monitor

    // typescript linting handles these
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'lines-between-class-members': ["error", "always", { exceptAfterSingleLine: true }],
    'no-undef': 'off',
    'class-methods-use-this': ['error', { exceptMethods: ['render'] }],

  },
};
