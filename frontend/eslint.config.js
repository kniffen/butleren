import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { stylingRules } from '../backend/eslint.config.mjs'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...stylingRules,
      ...reactHooks.configs.recommended.rules,
      "no-await-in-loop":     ["error"],           // disallow await keyword inside of loops
      "prefer-const":         ["error"],           // require const declarations for variables that are never reassigned after declared
      "no-duplicate-imports": ["error"],           // disallow duplicate module imports
      "eqeqeq":               ["error", "always"], // require the use of === and !==
      "yoda":                 ["error", "always"], // require or disallow Yoda conditions
      "semi":                 ["error", "always"], // require semicolons at the end of statements
      "curly":                ["error", "all"],    // require braces around all control statements

      // Typescript specific
      "@typescript-eslint/no-unused-vars": "warn",                 // Warn of unused variables
      "@typescript-eslint/no-import-type-side-effects": "error",   // disallow non-null assertion in locations that may be confusing
      "@typescript-eslint/explicit-function-return-type": "error", // require explicit return types on functions and class methods
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
