import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";
import { stylingRules, baseRules, testRules } from "@repo/eslint-rules";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["node_modules"]
  },
  {
    files: ["./src/**/*.{js,mjs,cjs,ts}"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...stylingRules,
      ...baseRules
    },
    ignores: ["node_modules", "jest.config.js", "eslint.config.js"],
  },
  {
    files: ["./src/**/*.test.{js,mjs,cjs,ts}"],
    plugins: {
      "@typescript-eslint": tseslint,
      "jest": jest,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      globals: jest.environments.globals.globals,
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...stylingRules,
      ...testRules
     },
  },
];