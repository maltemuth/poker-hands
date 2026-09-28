import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      { jsc: { parser: { syntax: "typescript" }, target: "es2022" } },
    ],
  },
  moduleNameMapper: {
    "^@service/(.*)$": "<rootDir>/src/$1",
    // test against the library sources, not whatever was last built into its dist
    "^@malte\\.muth/poker-hands$": "<rootDir>/../library/index.ts",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
};

export default config;
