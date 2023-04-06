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
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'no-await-in-loop': 1,
        'no-use-before-define': 1,
        'no-unreachable-loop': 1,
        'no-duplicate-imports': 1,
        'array-callback-return': 1,
        'eqeqeq': 2,
        'yoda': 1,
    }
}
