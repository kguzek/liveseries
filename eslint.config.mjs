import next from "eslint-config-next";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...next,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },
  {
    files: ["src/migrations/*.ts"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-import-type-side-effects": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default config;
