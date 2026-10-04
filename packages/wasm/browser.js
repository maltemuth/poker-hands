// Browsers and bundlers: fetch the WebAssembly module next to this file.
// Top-level await makes importers wait until it is ready.
import init from "./pkg/poker_hands.js";

await init();

export * from "./api.js";
