import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ['src/locales/*/messages.ts']
  }
];
