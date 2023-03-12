module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'global-require': 0,
    'linebreak-style': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@apiDocs', 'src/api-docs'],
          ['@config', 'src/config'],
          '@constants',
          'src/constants',
          '@controllers',
          'src/controllers',
          ['@helpers', 'src/helpers'],
          ['@middlewares', 'src/middlewares'],
          ['@models', 'src/models'],
          ['@routes', 'src/routes'],
          ['@services', 'src/services'],
          ['@utils', 'src/utils'],
          ['@validation', 'src/validation'],
        ],
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
