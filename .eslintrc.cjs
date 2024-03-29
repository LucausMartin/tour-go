module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "prettier/prettier": "error",
    'import/no-unresolved': ['error', { ignore: ['^virtual:'] }]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ["@myHooks", "./src/hooks"],
          ["@myComponents", "./src/components"],
          ["@myCommon", "./src/common"],
          ["@myStore", "./src/store"],
          ["@myTypes", "./src/types"],
        ]
      }
    }
  }
}
