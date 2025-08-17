// CLI-specific type definitions

export interface CLIOptions {
  verbose?: boolean;
  format?: "json" | "table" | "pretty";
  json?: boolean;
}

export interface CommandResult {
  success: boolean;
  data?: object;
  error?: string;
}

export interface CardInput {
  value: string;
  suit: string;
}
