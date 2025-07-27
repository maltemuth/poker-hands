# Package.json Updates

Add the following scripts to package.json:

```json
"scripts": {
  "prepack": "rm -rf dist && yarn build",
  "build": "tsc",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:full": "jest __tests__/full --testMatch",
  "profile": "yarn profile:odds",
  "profile:odds": "time ts-node -T __perf__/odds.ts",
  "profile:percentages": "time ts-node -T __perf__/percentages.ts",
  "build:wasm": "cd src/rust && npm run build",
  "build:wasm:node": "cd src/rust && npm run build:node",
  "build:wasm:web": "cd src/rust && npm run build:web",
  "example:node": "cd examples/node-wasm && ts-node index.ts",
  "example:browser": "cd examples/browser-wasm && npm run start"
}
```

Add the following dependencies to package.json:

```json
"devDependencies": {
  "@babel/core": "^7.10.1",
  "@babel/preset-env": "^7.10.1",
  "@babel/preset-typescript": "^7.10.1",
  "@types/jest": "^25.2.3",
  "@typescript-eslint/eslint-plugin": "^3.0.2",
  "@typescript-eslint/parser": "^3.0.2",
  "babel-jest": "^26.0.1",
  "eslint": "^7.1.0",
  "jest": "^26.0.1",
  "ts-node": "^8.10.2",
  "typescript": "^3.9.3",
  "v8-profiler-next": "^1.3.0",
  "wasm-pack": "^0.9"
}
```
