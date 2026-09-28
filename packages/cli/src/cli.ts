#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { Command } from "commander";
import { createOddsCommand } from "./commands/odds";
import { createPercentagesCommand } from "./commands/percentages";

const { version } = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

/**
 * Creates the poker-hands command line program.
 */
export const createProgram = (): Command =>
  new Command()
    .name("poker-hands")
    .description(
      "CLI for poker hands library - evaluate hands, calculate odds, and more"
    )
    .version(version)
    .addCommand(createOddsCommand())
    .addCommand(createPercentagesCommand());

// Parse command line arguments when run as the poker-hands executable
if (require.main === module) {
  createProgram().parse();
}
