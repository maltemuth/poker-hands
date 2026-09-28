import type { Config } from "jest";

const config: Config = {
  moduleNameMapper: {
    "^@library/(.*)$": "<rootDir>/packages/library/src/$1",
    "^@service/(.*)$": "<rootDir>/packages/service/src/$1",
    "^@cli/(.*)$": "<rootDir>/packages/cli/src/$1",
    "^@src/(.*)$": "<rootDir>/packages/library/src/$1",
    "^src/(.*)$": "<rootDir>/packages/library/src/$1",
    "^@serviceSrc/(.*)$": "<rootDir>/packages/service/src/$1",
  },
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
