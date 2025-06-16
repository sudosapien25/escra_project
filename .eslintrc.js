module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': ['error', {
      'types': {
        '{}': {
          'message': 'Use Record<string, never> instead',
          'fixWith': 'Record<string, never>'
        }
      }
    }]
  }
} 