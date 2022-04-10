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
  plugins: ["prettier", "@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["**/*.d.ts"],
  rules: {
    "prettier/prettier": ["warn"],
    "no-unused-vars": ["off"],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};
