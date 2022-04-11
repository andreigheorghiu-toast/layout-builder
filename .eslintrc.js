module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ["prettier", "@typescript-eslint", "jest", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["**/*.d.ts"],
  rules: {
    "prettier/prettier": ["warn"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "no-duplicate-imports": ["warn"],
  },
  settings: {
    react: {
      version: "^17.0.2",
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};
