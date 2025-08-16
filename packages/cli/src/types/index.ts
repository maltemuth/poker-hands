// CLI-specific type definitions

export interface CLIOptions {
  verbose?: boolean;
  format?: "json" | "table" | "pretty";
}

export interface CommandResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface CardInput {
  value: string;
  suit: string;
}
