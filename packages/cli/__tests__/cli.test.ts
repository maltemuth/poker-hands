import { readFileSync } from "fs";
import { join } from "path";
import { createProgram } from "../src/cli.js";

/** Runs the CLI in-process and returns everything written to stdout. */
const run = (...args: string[]): string => {
  const output: string[] = [];
  const log = jest
    .spyOn(console, "log")
    .mockImplementation((line: string) => output.push(line));
  try {
    createProgram().exitOverride().parse(args, { from: "user" });
  } finally {
    log.mockRestore();
  }
  return output.join("\n");
};

class Exited extends Error {
  constructor(readonly code: number | string | null | undefined) {
    super(`process.exit(${code})`);
  }
}

/**
 * Runs the CLI in-process for input it rejects. process.exit is replaced by
 * a throw, so the test survives it; returns stdout, stderr and the exit code.
 */
const runFailing = (...args: string[]) => {
  const errors: string[] = [];
  const error = jest
    .spyOn(console, "error")
    .mockImplementation((...parts: unknown[]) => {
      errors.push(parts.join(" "));
    });
  const exit = jest.spyOn(process, "exit").mockImplementation((code) => {
    throw new Exited(code);
  });
  let stdout = "";
  let exitCode: Exited["code"] = undefined;
  try {
    stdout = run(...args);
  } catch (thrown) {
    if (!(thrown instanceof Exited)) throw thrown;
    exitCode = thrown.code;
  } finally {
    error.mockRestore();
    exit.mockRestore();
  }
  return { stdout, stderr: errors.join("\n"), exitCode };
};

describe("poker-hands CLI", () => {
  describe("package entry point", () => {
    const manifest = JSON.parse(
      readFileSync(join(__dirname, "../package.json"), "utf8")
    );

    it("points the bin at the CLI program, not the type barrel", () => {
      expect(manifest.bin["poker-hands"]).toBe("dist/cli.js");
      expect(manifest.main).toBe("dist/index.js");
    });

    it("starts with a node shebang so it is executable", () => {
      const source = readFileSync(join(__dirname, "../src/cli.ts"), "utf8");
      expect(source.startsWith("#!/usr/bin/env node\n")).toBe(true);
    });
  });

  describe("odds", () => {
    it("prints each player's win chance and the tie chance", () => {
      expect(run("odds", "AhAs", "KdKc")).toBe(
        [
          "Winning Odds:",
          "Player 1: 81.06%",
          "Player 2: 18.55%",
          "Tie: 0.38%",
          "Total: 100.00%",
        ].join("\n")
      );
    });

    it("resolves a known river exactly", () => {
      const output = run("odds", "AsKd", "Ah9c", "--board", "8c7d5h3s2c");

      expect(output).toContain("Player 1: 100.00%");
      expect(output).toContain("Player 2: 0.00%");
    });

    it("shows the progress before the result with --progress", () => {
      const writes: string[] = [];
      const write = jest
        .spyOn(process.stdout, "write")
        .mockImplementation((chunk: string | Uint8Array) => {
          writes.push(String(chunk));
          return true;
        });
      let output: string;
      try {
        // 990 remaining boards: progress is reported every 100 and at the end
        output = run("odds", "AhAs", "KdKc", "--board", "2c7d9h", "--progress");
      } finally {
        write.mockRestore();
      }

      expect(writes).toEqual([
        "\r10",
        "\r20",
        "\r30",
        "\r40",
        "\r51",
        "\r61",
        "\r71",
        "\r81",
        "\r91",
        "\r100",
        "\r",
      ]);
      expect(output).toContain("Total: 100.00%");
    });

    it("accepts a space-separated board", () => {
      const output = run("odds", "AsKd", "Ah9c", "--board", "8c 7d 5h 3s 2c");

      expect(output).toContain("Player 1: 100.00%");
    });
  });

  describe("invalid input", () => {
    it.each([
      [
        "a card used twice in odds",
        ["odds", "AhAs", "AhKh"],
        "Error: Duplicates found in card list 'Ah,As,Ah,Kh'",
      ],
      [
        "an unknown card in odds",
        ["odds", "AhAs", "Xx"],
        "Error: Could not convert string X to a card value.",
      ],
      [
        "a card on the board and in a hole",
        ["odds", "AhAs", "KdKc", "--board", "Ah2c3d"],
        "Error: Duplicates found in card list 'Ah,2c,3d,Ah,As,Kd,Kc'",
      ],
      [
        "a card used twice in percentages",
        ["percentages", "AhAh"],
        "Error: Duplicates found in card list 'Ah,Ah'",
      ],
      [
        "an unknown card in percentages",
        ["percentages", "AhKh", "Zz"],
        "Error: Could not convert string Z to a card value.",
      ],
    ])("reports %s on stderr and exits with 1", (_, args, message) => {
      const result = runFailing(...args);

      expect(result).toEqual({ stdout: "", stderr: message, exitCode: 1 });
    });
  });

  describe("percentages", () => {
    it("prints the percentage of every hand type", () => {
      expect(run("percentages", "AhKh", "QhJh2c")).toBe(
        [
          "Hand Type Percentages:",
          "High Card: 17.48%",
          "Pair: 29.14%",
          "Two Pair: 7.22%",
          "Three of a Kind: 1.20%",
          "Straight: 9.99%",
          "Flush: 30.71%",
          "Full House: 0.00%",
          "Four of a Kind: 0.00%",
          "Straight Flush: 0.00%",
          "Royal Flush: 4.26%",
          "Total: 100.00%",
        ].join("\n")
      );
    });

    it("accepts the board as separate arguments", () => {
      expect(run("percentages", "AhKh", "QhJhTh", "2c", "3d")).toContain(
        "Royal Flush: 100.00%"
      );
    });
  });
});
