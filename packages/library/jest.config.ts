import type { Config } from "jest";

const config: Config = {
  moduleNameMapper: {
    // sources import each other as .js (ESM style); Jest resolves the .ts file
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/helpers/"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      { jsc: { parser: { syntax: "typescript" }, target: "es2022" } },
    ],
  },
};

export default config;
