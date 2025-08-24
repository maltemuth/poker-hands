// CLI-specific type definitions
export * from "./schemas";

// Legacy types for backward compatibility
export interface CommandResult {
  success: boolean;
  data?: object;
  error?: string;
}

// Re-export with CLI prefix for explicit imports
export {
  CLIResponseBase as CLIResponseBase,
  CLISuccessResponse as CLISuccessResponse,
  CLIErrorResponse as CLIErrorResponse,
  CLIResponse as CLIResponse,
  OddsData as CLIOddsData,
  OddsPlayerData as CLIOddsPlayerData,
  PercentagesData as CLIPercentagesData,
  HandTypeData as CLIHandTypeData,
  CommandName as CLICommandName,
  CLIOptions as CLICLIOptions,
  CardInput as CLICardInput,
  OddsResponse as CLIOddsResponse,
  PercentagesResponse as CLIPercentagesResponse,
} from "./schemas";
