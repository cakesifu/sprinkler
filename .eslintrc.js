module.exports = {
  'extends': [
    'eslint:recommended',
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': false,
      'modules': true
    }
  },
  'plugins': [],
  'env': {
    'browser': false,
    'node': true,
    'worker': false,
    'amd': false,
    'mocha': false,
    'es6': true
  },
  'globals': {
    'NODE_ENV': true
  },
  'rules': {
    'no-unused-vars': ['error', { varsIgnorePattern: '_', }],
    'quotes': ['error', 'single'],
    'no-redeclare': 0,
    'object-curly-spacing': ['error', 'always'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-wrap-multilines': 2,
    'react/jsx-tag-spacing': 2,
    'react/jsx-no-duplicate-props': 2
  }
};
