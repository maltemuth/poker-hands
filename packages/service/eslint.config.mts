import { defineConfig } from "eslint/config";
import globals from "globals";
import rootConfig from "../../eslint.config.mts";

export default defineConfig(rootConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  rules: {
    // Service-specific rules
    "no-console": "warn", // Allow console but warn about it
    "no-process-exit": "off", // Allow process.exit() for service applications
  },
});
