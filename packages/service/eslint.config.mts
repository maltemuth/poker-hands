import { defineConfig } from "eslint/config";
import globals from "globals";
import rootConfig from "../../eslint.config.mts";

export default defineConfig(
  rootConfig,
  {
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
  },
  {
    // the poker-hands-service command prints its startup banner and errors
    files: ["src/cli.ts"],
    rules: {
      "no-console": "off",
    },
  }
);
