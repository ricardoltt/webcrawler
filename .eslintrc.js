module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'require-await': 'warn',
    'no-promise-executor-return': 'error',
    'callback-return': 'warn',
    'handle-callback-err': 'warn',
    'camelcase': 'warn',
    'max-len': ['warn', { 'code': 100, 'ignoreComments': true }],
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
  },
}; 