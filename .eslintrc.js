module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
  ],
  rules: {
    'no-undef': 'off', // <- TODO doesn't find types.d.ts for some reason
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/max-attributes-per-line': ['warn', {
      singleline: 1,
      multiline: {
        allowFirstLine: true
      }
    }]
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: true
  }
}
