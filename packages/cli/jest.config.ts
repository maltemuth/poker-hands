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
    // commander is ESM-only; compile it to CommonJS for Jest's module loader
    "/node_modules/commander/.+\\.js$": [
      "@swc/jest",
      { jsc: { target: "es2022" }, module: { type: "commonjs" } },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!commander/)"],
  // test against the library sources, not whatever was last built into its dist
  moduleNameMapper: {
    // sources import each other as .js (ESM style); Jest resolves the .ts file
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@malte\\.muth/poker-hands$": "<rootDir>/../library/index.ts",
  },
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
