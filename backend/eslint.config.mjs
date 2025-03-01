import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignorePatterns: ["node_modules", "jest.config.js"],
    rules: {
      "semi": ["error", "always"],
      "no-await-in-loop": "error",
      "eqeqeq": ["error", "always"],
      "yoda": ["error", "always"],
      "prefer-const": "error",
      "curly": ["error", "all"],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
    }
  }
];
