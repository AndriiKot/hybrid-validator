'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      'max-len': [
        'error',
        {
          code: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
];
