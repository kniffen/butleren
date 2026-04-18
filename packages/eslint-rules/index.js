export const baseRules = {
  "no-await-in-loop":     ["error"],           // disallow await keyword inside of loops
  "prefer-const":         ["error"],           // require const declarations for variables that are never reassigned after declared
  "no-duplicate-imports": ["error"],           // disallow duplicate module imports
  "eqeqeq":               ["error", "always"], // require the use of === and !==
  "yoda":                 ["error", "always"], // require or disallow Yoda conditions
  "semi":                 ["error", "always"], // require semicolons at the end of statements
  "curly":                ["error", "all"],    // require braces around all control statements
  
  "@typescript-eslint/no-unused-vars":                "error", // Disallow unused variables
  "@typescript-eslint/no-import-type-side-effects":   "error", // disallow non-null assertion in locations that may be confusing
  "@typescript-eslint/explicit-function-return-type": "error", // require explicit return types on functions and class methods
}

// Formatting/spacing rules
export const stylingRules = {
  "quotes":                ["error", "single"],                           // enforce the consistent use of single quotes
  "object-curly-spacing":  ["error", "always"],                           // enforce consistent spacing inside braces
  "indent":                ["error", 2, { "SwitchCase": 1 }],             // enforce consistent indentation
  "array-bracket-spacing": ["error", "never"],                            // enforce consistent spacing inside array brackets
  "space-infix-ops":       ["error", { int32Hint: false }],               // require spacing around infix operators
  "no-trailing-spaces":    ["error"],                                     // disallow trailing whitespace at the end of lines
  "key-spacing":           ["error", { mode: "strict", align: 'value' }], // enforce consistent spacing between keys and values in object literal properties
}

export const testRules = {
  "prefer-const":         ["error"],           // require const declarations for variables that are never reassigned after declared
  "no-duplicate-imports": ["error"],           // disallow duplicate module imports
  "semi":                 ["error", "always"], // require semicolons at the end of statements
}
