import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";

// Formatting/spacing rules
const stylingRules = {
  "quotes":                ["error", "single"],                           // enforce the consistent use of single quotes
  "object-curly-spacing":  ["error", "always"],                           // enforce consistent spacing inside braces
  "indent":                ["error", 2, { "SwitchCase": 1 }],             // enforce consistent indentation
  "array-bracket-spacing": ["error", "never"],                            // enforce consistent spacing inside array brackets
  "space-infix-ops":       ["error", { int32Hint: false }],               // require spacing around infix operators
  "no-trailing-spaces":    ["error"],                                     // disallow trailing whitespace at the end of lines
  "key-spacing":           ["error", { mode: "strict", align: 'value' }], // enforce consistent spacing between keys and values in object literal properties
}

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...stylingRules,
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
    },
    ignores: ["node_modules", "jest.config.js", "eslint.config.mjs"],
  },
  {
    files: ["src/**/*.test.{js,mjs,cjs,ts}"],
    plugins: {
      "@typescript-eslint": tseslint,
      "jest": jest,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
      globals: jest.environments.globals.globals,
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...stylingRules,
      "prefer-const":         ["error"],           // require const declarations for variables that are never reassigned after declared
      "no-duplicate-imports": ["error"],           // disallow duplicate module imports
      "semi":                 ["error", "always"], // require semicolons at the end of statements
     },
  },
];
