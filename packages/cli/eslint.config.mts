import { defineConfig } from "eslint/config";
import globals from "globals";
import rootConfig from "../../eslint.config.mts";

export default defineConfig(rootConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    // CLI-specific rules
    "no-console": "off", // Allow console but warn about it
    "no-process-exit": "off", // Allow process.exit() for CLI applications
    "no-unused-vars": "warn", // Be more lenient with unused vars in CLI context

    // Command-line specific rules
    "prefer-const": "error", // Enforce const for variables that aren't reassigned
    "no-var": "error", // Use let/const instead of var

    // CLI argument handling rules
    "no-throw-literal": "off", // Allow throwing strings for CLI error messages
    "prefer-promise-reject-errors": "off", // Allow rejecting with strings for CLI

    // CLI-specific type safety
    "@typescript-eslint/no-explicit-any": "warn", // Allow any for CLI flexibility
    "@typescript-eslint/no-unused-vars": "warn", // Be more lenient with unused vars

    // CLI-specific import rules
    "@typescript-eslint/no-var-requires": "off", // Allow require for CLI utilities
    "import/no-extraneous-dependencies": "off", // Allow CLI-specific dependencies

    // CLI-specific function rules
    "max-params": ["warn", { max: 5 }], // CLI commands might have multiple parameters
    "max-lines-per-function": ["warn", { max: 50 }], // CLI commands can be longer
  },
});
