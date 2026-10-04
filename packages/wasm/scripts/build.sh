#!/bin/sh
# Compiles the crate to pkg/poker_hands_bg.wasm and its JavaScript bindings.
# wasm-pack's own wasm-opt is too old for current WebAssembly features, so
# binaryen's (from npm) optimizes the module instead.
set -e
cd "$(dirname "$0")/.."
sh scripts/with-rustup.sh wasm-pack build --target web --out-dir pkg --release --no-typescript
wasm-opt pkg/poker_hands_bg.wasm -o pkg/poker_hands_bg.wasm -O3 \
  --enable-reference-types --enable-multivalue --enable-bulk-memory \
  --enable-mutable-globals --enable-nontrapping-float-to-int --enable-sign-ext
# wasm-pack's package.json would make Node treat pkg/ as CommonJS
rm -f pkg/package.json pkg/.gitignore pkg/README.md
