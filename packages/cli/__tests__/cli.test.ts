import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { readFileSync } from "fs";
import { join } from "path";
import { createProgram } from "../src/cli.js";

/** Runs the CLI in-process and returns everything written to stdout. */
const run = (...args: string[]): string => {
  const output: string[] = [];
  const log = mock.method(console, "log", (line: string) => output.push(line));
  try {
    createProgram().exitOverride().parse(args, { from: "user" });
  } finally {
    log.mock.restore();
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
  const error = mock.method(console, "error", (...parts: unknown[]) => {
    errors.push(parts.join(" "));
  });
  const exit = mock.method(process, "exit", (code?: number | string | null) => {
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
    error.mock.restore();
    exit.mock.restore();
  }
  return { stdout, stderr: errors.join("\n"), exitCode };
};

describe("poker-hands CLI", () => {
  describe("package entry point", () => {
    const manifest = JSON.parse(
      readFileSync(join(import.meta.dirname, "../package.json"), "utf8")
    );

    it("points the bin at the CLI program, not the type barrel", () => {
      assert.equal(manifest.bin["poker-hands"], "dist/cli.js");
      assert.equal(manifest.main, "dist/index.js");
    });

    it("starts with a node shebang so it is executable", () => {
      const source = readFileSync(join(import.meta.dirname, "../src/cli.ts"), "utf8");
      assert.equal(source.startsWith("#!/usr/bin/env node\n"), true);
    });
  });

  describe("odds", () => {
    it("prints each player's win chance and the tie chance", () => {
      assert.equal(
        run("odds", "AhAs", "KdKc"),
        [
          "Winning Odds:",
          "Player 1 (AhAs): 81.06% win, 0.38% tie",
          "Player 2 (KdKc): 18.55% win, 0.38% tie",
        ].join("\n")
      );
    });

    it("prints every player of a multi-way pot", () => {
      assert.equal(
        run("odds", "AhAs", "KdKc", "QhQd"),
        [
          "Winning Odds:",
          "Player 1 (AhAs): 66.74% win, 0.40% tie",
          "Player 2 (KdKc): 18.38% win, 0.40% tie",
          "Player 3 (QhQd): 14.48% win, 0.40% tie",
        ].join("\n")
      );
    });

    it("gives each player their own tie chance", () => {
      // 42 rivers: 7-2 and 7-3 split a jack-high straight on 38 of them;
      // a queen (4) gives As Ks the ace-high straight, and a seven (2) puts
      // the straight on the board, so all three tie
      const output = run("odds", "7h2c", "7d3s", "AsKs", "--board", "8c9dTsJh");

      assert.match(output, /Player 1 \(7h2c\): 0\.00% win, \d+\.\d{2}% tie/);
      const ties = [...output.matchAll(/win, (\d+\.\d{2})% tie/g)].map(
        (match) => match[1]
      );
      assert.equal(ties[0], ties[1]);
      assert.notEqual(ties[2], ties[0]);
    });

    it("resolves a known river exactly", () => {
      const output = run("odds", "AsKd", "Ah9c", "--board", "8c7d5h3s2c");

      assert.ok(output.includes("Player 1 (AsKd): 100.00% win, 0.00% tie"));
      assert.ok(output.includes("Player 2 (Ah9c): 0.00% win, 0.00% tie"));
    });

    it("shows the progress before the result with --progress", () => {
      const writes: string[] = [];
      const write = mock.method(
        process.stdout,
        "write",
        (chunk: string | Uint8Array) => {
          writes.push(String(chunk));
          return true;
        }
      );
      let output: string;
      try {
        // 990 remaining boards: progress is reported every 100 and at the end
        output = run("odds", "AhAs", "KdKc", "--board", "2c7d9h", "--progress");
      } finally {
        write.mock.restore();
      }

      assert.deepEqual(writes, [
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
      assert.ok(output.includes("Player 1 (AhAs):"));
    });

    it("accepts a space-separated board", () => {
      const output = run("odds", "AsKd", "Ah9c", "--board", "8c 7d 5h 3s 2c");

      assert.ok(output.includes("Player 1 (AsKd): 100.00% win"));
    });
  });

  describe("invalid input", () => {
    for (const [label, args, message] of [
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
    ])
      it(`reports ${label} on stderr and exits with 1`, () => {
        const result = runFailing(...args);

        assert.deepEqual(result, { stdout: "", stderr: message, exitCode: 1 });
      });
  });

  describe("percentages", () => {
    it("prints the percentage of every hand type", () => {
      assert.equal(
        run("percentages", "AhKh", "QhJh2c"),
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
      assert.ok(
        run("percentages", "AhKh", "QhJhTh", "2c", "3d").includes(
          "Royal Flush: 100.00%"
        )
      );
    });
  });
});
