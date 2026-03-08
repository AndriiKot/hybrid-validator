'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    files: ['lib/**/*.js', 'tests/**/*.js', 'benchmarks/**/*.mjs'],
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
