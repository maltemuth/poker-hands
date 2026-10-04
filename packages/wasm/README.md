# Poker Hands WASM

Texas Hold'em hand ranking, exact odds and hand type percentages, written in
Rust and compiled to WebAssembly. One package works in Node.js and in
browsers, with the same API. It gives the same results as
[`@malte.muth/poker-hands`](../library), number for number, about 2.5–3 times
faster before the flop.

It is versioned together with the other packages of this repository.

```sh
npm install @malte.muth/poker-hands-wasm
```

## Usage

```js
import { odds, percentages, handRank } from "@malte.muth/poker-hands-wasm";

odds(["AhAs", "KdKc"]);
// [
//   { hole: "AhAs", wins: 1388072, ties: 6538, winChance: 0.8106…, tieChance: 0.0038… },
//   { hole: "KdKc", wins: 317694, ties: 6538, winChance: 0.1855…, tieChance: 0.0038… },
// ]

odds(["7h2c", "7d3s", "AsKs"], "8c 9d Ts Jh"); // a board, with or without spaces
percentages("AhKh", "QhJh2c"); // { highCard: { count, percentage }, …, royalFlush: … }
percentages("AhKh", "QhJh2c", "Th"); // the ten of hearts is dead
handRank("7c7d7hKsKd"); // 0x7777dd, the same number as handRank in the TypeScript library
```

Cards are strings: a value (`2`–`9`, `T`, `J`, `Q`, `K`, `A`) and a suit
(`h`, `d`, `c`, `s`). Invalid input throws an `Error`: an unknown card, a card
used twice, a hole without exactly two cards, or more than five board cards.

In Node.js, the module is loaded synchronously, so the package works with
`import` and `require()`. In browsers and bundlers, it is fetched next to
`browser.js`, and top-level `await` makes importers wait until it's ready.
[`examples/browser`](examples/browser/index.html) is a page that uses it.

## Differences from the TypeScript library

- Cards are strings, not `{ suit, value }` objects.
- Only `odds`, `percentages` and `handRank`. There are no hand objects
  (`getBestHand`, `isBetterThan`, …), decks or progress callbacks.

## How it works

- A set of cards is one 64-bit number, 16 bits per suit. Each suit's bits are
  that suit's mask of values, which is what ranking works on, and adding a
  card to a board is a single OR.
- Hands are ranked from the four suit masks, as in the TypeScript library.
  The two lookup tables (straights, top five values) are computed by the
  compiler, and card counts use the CPU's popcount instruction.
- Odds enumerate every way to complete the board, passing the board's set down
  while the cards are chosen one by one.
- The WebAssembly interface ([src/wasm.rs](src/wasm.rs)) takes card strings
  and returns flat arrays of counts; [api.js](api.js) turns them into objects.

## Performance

CPU time, best of three runs, on an older Intel MacBook (Node.js 24):

| Case                        | TypeScript | WebAssembly | Speed-up |
| --------------------------- | ---------: | ----------: | -------: |
| Odds pre-flop, 2 players    |     172 ms |       59 ms |     2.9× |
| Odds pre-flop, 3 players    |     186 ms |       67 ms |     2.8× |
| Odds pre-flop, 5 players    |     177 ms |       66 ms |     2.7× |
| Odds pre-flop, 10 players   |      78 ms |       31 ms |     2.5× |
| Odds on the flop, 2 players |    0.26 ms |     0.04 ms |     6.7× |
| Percentages pre-flop        |     102 ms |       36 ms |     2.9× |

The same Rust code runs about as fast natively (`cargo run --release
--example bench`), if it may use the CPU's popcount instruction
(`RUSTFLAGS="-C target-cpu=native"`); without it, native code is slower than
WebAssembly.

## Development

Needs Node.js 24, [rustup](https://rustup.rs/) with the
`wasm32-unknown-unknown` target, and
[wasm-pack](https://rustwasm.github.io/wasm-pack/). The scripts use rustup's
stable toolchain even if another Rust installation comes first in `PATH`
([scripts/with-rustup.sh](scripts/with-rustup.sh)). The build runs `wasm-opt`
from the `binaryen` npm package, since the one wasm-pack downloads doesn't
support the WebAssembly features current Rust emits.

```sh
npm install          # in the repository root; includes binaryen, for wasm-opt
npm run build        # Rust → pkg/poker_hands_bg.wasm, optimized
npm test             # Rust unit tests, then the comparison with the TypeScript library
npm run lint         # clippy for both targets, rustfmt
npm run bench        # the native benchmark
```

The comparison ([test/parity.test.js](test/parity.test.js)) ranks 20,000
random hands and calculates odds and percentages on random spots with both
libraries, and requires every number to be the same. It uses the TypeScript
library's build; the root `npm run build` builds the library first.

To check the browser build, serve this folder (for example with
`python3 -m http.server`) and open `/test/browser.html` or
`/examples/browser/`.
