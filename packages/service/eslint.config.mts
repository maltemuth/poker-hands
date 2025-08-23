import rootConfig from "../../eslint.config.mts";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  ...rootConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Extend TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // Service-specific rules
      "no-console": "warn", // Allow console but warn about it
      "no-process-exit": "off", // Allow process.exit() for service applications
    },
  },
];
