import type { Config } from "jest";

const config: Config = {
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
