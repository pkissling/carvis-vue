module.exports = {
  root: true,
  env: {
    node: true
  },

  extends: ['plugin:vue/recommended', '@vue/typescript/recommended'],

  rules: {
    'no-undef': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 1,
        multiline: {
          allowFirstLine: true
        }
      }
    ]
  },

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  }
}
