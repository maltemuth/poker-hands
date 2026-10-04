// Node.js: load the WebAssembly module synchronously, so the package works
// with import and require() alike, without top-level await.
import { readFileSync } from "node:fs";
import { initSync } from "./pkg/poker_hands.js";

initSync({
  module: readFileSync(new URL("./pkg/poker_hands_bg.wasm", import.meta.url)),
});

export * from "./api.js";
