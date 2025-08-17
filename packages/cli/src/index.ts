#!/usr/bin/env node

import { Command } from "commander";
import { bestHandCommand } from "./commands/bestHand";
import { compareCommand } from "./commands/compare";
import { oddsCommand } from "./commands/odds";
import { percentagesCommand } from "./commands/percentages";

const program = new Command();

program
  .name("poker-hands")
  .description(
    "CLI for poker hands library - evaluate hands, calculate odds, and more"
  )
  .version("0.1.0");

// Add commands
program.addCommand(bestHandCommand);
program.addCommand(compareCommand);
program.addCommand(oddsCommand);
program.addCommand(percentagesCommand);

// Parse command line arguments
program.parse();
