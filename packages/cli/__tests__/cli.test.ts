import { readFileSync } from "fs";
import { join } from "path";
import { createProgram } from "../src/cli";
import { OddsData, PercentagesData } from "../src/types";

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
    it("prints JSON odds for each player", () => {
      const result = JSON.parse(
        run("odds", "AhAs", "KdKh", "--board", "2h5d9c", "--json")
      );

      expect(result.success).toBe(true);
      expect(result.command).toBe("odds");
      const data: OddsData = result.data;
      expect(data.players.map((player) => player.holeCards)).toEqual([
        ["Ah", "As"],
        ["Kd", "Kh"],
      ]);
      expect(data.players[0].winChance).toBeGreaterThan(
        data.players[1].winChance
      );
    });

    it("resolves a known river exactly", () => {
      const result = JSON.parse(
        run("odds", "AsKd", "Ah9c", "--board", "8c7d5h3s2c", "--json")
      );

      expect(result.data.players[0].winChance).toBe(1);
      expect(result.data.players[1].winChance).toBe(0);
    });

    it("passes Monte Carlo options through", () => {
      const result = JSON.parse(
        run(
          "odds",
          "AhAs",
          "KdKh",
          "--mode",
          "monteCarlo",
          "--sample-size",
          "200",
          "--json"
        )
      );

      expect(result.data.players[0].winChanceError).toBeGreaterThan(0);
    });

    it("reports invalid input as a JSON error", () => {
      const result = JSON.parse(run("odds", "AhAs", "AhKh", "--json"));

      expect(result.success).toBe(false);
      expect(result.error).toEqual(expect.any(String));
    });
  });

  describe("percentages", () => {
    it("prints JSON hand type percentages", () => {
      const result = JSON.parse(
        run("percentages", "AhKh", "QhJhTh2c3d", "--json")
      );

      expect(result.success).toBe(true);
      const data: PercentagesData = result.data;
      expect(data.royalFlush.percentage).toBe(1);
    });
  });
});
