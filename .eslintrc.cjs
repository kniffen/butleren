module.exports = {
    'env': {
        'browser': false,
        'node': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
        {
            "files": [
                "tests/mockups/*.js",
                "**/*.test.js",
                "**/*.test.jsx"
            ],
            "env": {
                "jest": true
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'indent': ['error', 2, {SwitchCase: 1}],
        'quotes': ['error', 'single'],
        'no-await-in-loop': ['warn'],
        'no-use-before-define': ['warn'],
        'no-unreachable-loop': ['warn'],
        'no-duplicate-imports': ['warn'],
        'array-callback-return': ['warn'],
        'eqeqeq': ['error'],
        'yoda': ['warn', 'always'],
        'no-new-wrappers': ['warn'],
        'space-before-blocks': ['warn'],
        'no-else-return': ['warn'],
        'no-unneeded-ternary': ['warn'],
        'no-loop-func': ['warn'],
        'no-eval': ['error'],
        'prefer-template': ['warn'],
        'no-array-constructor': ['warn'],
        'prefer-object-spread': ['warn'],
        'no-new-object': ['warn']
    }
}
