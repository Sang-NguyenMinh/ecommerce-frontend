module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': '',
    
    '@typescript-eslint/no-explicit-any': 'off',
    
    '@typescript-eslint/no-implicit-any': 'off',
    
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
     'prettier/prettier': [
    'error',
    {
      arrowParens: 'avoid',
      singleQuote: true,
      jsxSingleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      semi: false,
      printWidth: 80
    }
  ]
  },
};