import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      { jsc: { parser: { syntax: "typescript" }, target: "es2022" } },
    ],
  },
  // test against the library sources, not whatever was last built into its dist
  moduleNameMapper: {
    "^@malte\\.muth/poker-hands$": "<rootDir>/../library/index.ts",
  },
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
