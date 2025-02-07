import hapi from '@hapi/eslint-plugin';

export default [
  {
    files: ['**/*.js'],
    plugins: {
      '@hapi': hapi
    },
    rules: {
      ...hapi.configs.recommended.rules
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    ignores: [
      'node_modules/**',
      'dist/**'
    ]
  }
]; 