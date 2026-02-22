'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
