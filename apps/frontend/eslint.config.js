import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { stylingRules, baseRules } from '@repo/eslint-rules'

export default tseslint.config(
  { ignores: ['dist', 'src/lib'] },
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
      ...baseRules,
      "indent":               "off", // Disabled due to issue with ESLint combined with typescript versions
      "no-console":           "error", // disallow the use of console
      "react-hooks/set-state-in-effect": "warn",  // Prevent calling a state setter function in useEffect without a dependency array
      "react-refresh/only-export-components": [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)