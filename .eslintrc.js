module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',

    'no-console': 'off',
    'prefer-const': 'off',
    'no-unused-vars': 'off',

    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/alt-text': 'off',
  },
};
