#!/bin/sh
# Runs a command with rustup's stable toolchain first in PATH. Only rustup's
# toolchains have the wasm32 target, and wasm-pack runs whichever cargo comes
# first in PATH, which can be another Rust installation (e.g. Homebrew's).
set -e
toolchain_bin="$(rustup run stable rustc --print sysroot)/bin"
PATH="$toolchain_bin:$PATH" exec "$@"
