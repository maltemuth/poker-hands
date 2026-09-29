# Changelog

All notable changes to the packages in this repository are documented here.
The library, CLI and service are versioned together.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2026-09-29

### Changed

- Library: the default `auto` threshold is 2,200,000 boards instead of
  10,000, above the most any spot can have (2,118,760 for a single hole
  pre-flop). `odds()` now calculates every spot exactly unless a lower
  `threshold` is given; before, pre-flop and multi-way flops fell back to
  10,000 Monte Carlo samples. Exact pre-flop odds take at most about 0.2
  seconds of CPU time. The CLI's `--threshold` and the service's
  `options.threshold` use the same default, so their `auto` results for
  these spots are now exact and no longer include `winChanceError`.
- Service: a concurrency slot is freed as soon as its response ends. Holding
  it for calculations that outlive the request was only needed while they
  ran in worker threads.

### Development

- Library: tests and benchmark share one seeded random generator and card
  draw (`__tests__/helpers`); `winningHoles`, which only they used, moved
  there from `src`. The old Monte Carlo perf script passes lint.
- The Tri-Coin Hold'em design doc moved to the poker-game repository.

## [0.9.0] - 2026-09-29

### Changed

- Service: requests are limited to 10 players and 1,000,000 Monte Carlo
  samples (`options.sampleSize`); larger requests are answered with a `400`
  ("At most 10 players allowed", "Sample size must be at most 1000000").
  Before, a single request with a huge sample size could keep the service
  busy for minutes. **Breaking** for clients that sent more.
- Service: calculations run directly in the request handler instead of in a
  new worker thread per request. Starting a worker took about 70 ms, longer
  than most calculations: a turn is answered in a few milliseconds instead of
  about 70, and exact pre-flop odds in about half the time. Within the
  limits, the largest calculation takes a fraction of a second; other
  requests wait meanwhile. The concurrency limit (`maxConcurrentRequests`)
  stays.
- Library: odds and percentages are about 3–5 times faster than in 0.8.0.
  Hands are ranked from four suit masks with lookup tables, and boards are
  enumerated without changing a shared state. Exact pre-flop odds take under
  0.2 seconds of CPU time for any number of players, pre-flop percentages
  about 0.1 seconds. Results are unchanged.

### Development

- Library: `npm run bench` reports wall-clock and CPU time, measures each
  case three times and averages the two fastest, and includes 4 players
  pre-flop.

## [0.8.0] - 2026-09-28

### Added

- Library: `handRank(hand)` expresses a hand's strength as one number, so
  hands can be compared with `>` and `===` and sorted numerically.

### Changed

- Library: odds and percentages are much faster and use almost no memory.
  Hands are ranked from bit masks instead of hand objects, and boards are
  enumerated or drawn without building card arrays. Heads-up pre-flop, exact
  odds take about 1 second instead of over a minute, percentages about 1
  second instead of about 65, and 10,000 Monte Carlo samples about 10 ms
  instead of 50. Results are unchanged. The service's endpoints benefit
  directly.

### Development

- Library: `npm run bench` measures hand evaluation, odds and percentages,
  including allocation and garbage collection per case.

## [0.7.3] - 2026-09-28

### Fixed

- Library: Monte Carlo odds were biased. `shuffle()` never moved the last
  card of its input, so the last card of the remaining deck, usually the ace
  of spades, never appeared on a sampled board. `odds()` uses Monte Carlo by
  default whenever there are more than 10,000 possible boards, i.e. for all
  pre-flop calculations, and so does the service's `POST /api/odds`. For
  example, AK against QQ pre-flop came out at 38.3% instead of 42.7%.
  Exhaustive results were not affected.
- Library: `shuffle()` returns every order with the same probability, as
  documented.

## [0.7.2] - 2026-09-28

### Fixed

- Library: high cards are compared by their best five cards only. With more
  than five cards, the sixth and seventh card decided between otherwise
  equal high cards, so `odds()` counted such boards as a win for one player
  instead of a tie (e.g. 7-2 against 6-3 on A K Q J 9).
- Library: `getBestHand()` no longer changes the order of the cards passed
  to it.

## [0.7.1] - 2026-09-28

### Fixed

- CLI and service: the library dependency is declared as `^0.7.0` instead of
  a path into this repository (`file:../library`), so both packages can be
  installed from npm. Inside the repository, npm workspaces still link the
  local library.

## [0.7.0] - 2026-09-28

### Changed

- Service: request bodies are validated against `openapi.yaml`, which is now
  the only source of the validation rules. Error messages are unchanged, with
  one exception below.
- Service: `threshold` and `sampleSize` must be integers of at least 1, as the
  spec has always stated. Fractional values used to be accepted, and a
  fractional sample size produced wrong probabilities. The message now reads
  "... must be a positive integer".
- Service: a request without a body is answered with a `400` ("Holes must be
  provided ...") instead of a `500`.
- Library: `HandPercentages`, the result of `percentages()`, is a record of
  exactly the ten hand types instead of arbitrary string keys. The new
  `HandTypeName` type names them; code that reads results with arbitrary
  strings needs a `HandTypeName` instead.

### Development

- Service: `openapi.yaml` drives the service. Routes are registered from its
  operations, the TypeScript types are generated from it with
  `openapi-typescript` (`npm run generate`), and handlers, responses and error
  bodies are type-checked against it. `npm test` fails if the generated types
  are out of date or the spec is invalid (Redocly).

## [0.6.0] - 2026-09-28

### Added

- Service: `POST /api/percentages` calculates, for each player, how often
  they make each hand type over all possible boards. The other players' hole
  cards count as dead cards. The endpoint previously answered `501`.
- Library: `percentages(hole, board, dead)` takes an optional list of dead
  cards, e.g. other players' hole cards, that can no longer appear on the
  board.

### Changed

- Service: calculations use the library directly in worker threads instead of
  running the `poker-hands` CLI for every request. Long calculations still
  don't block the service, requests no longer start `npx` and a second Node
  process, and the CLI is not needed at runtime. Response formats are
  unchanged.
- Service: cards the library rejects, e.g. a card used twice, are answered
  with `400` and the library's message. Before, such requests got a `200` with
  an empty body.
- Service: a concurrency slot stays occupied until its calculation has
  finished, even if the client disconnects, so no more calculations run at
  once than `--max-requests` allows.

### Fixed

- Library: `percentages()` rejects duplicate cards instead of returning a
  wrong distribution.
- Service: the package no longer depends on files of the CLI package that only
  exist inside this repository, the build no longer keeps stale output, and
  only the build output and docs are published.
- Service: the README and `openapi.yaml` describe the actual requests and
  responses; `openapi.yaml` is valid again.

### Removed

- Service: the unused `ws` dependency and `ajv`, which only validated the
  CLI's output.

## [0.5.0] - 2026-09-28

### Changed

- All three packages require Node.js 24.21.0 or later (the library required
  24.6.0; the CLI and service declared no requirement).
- CLI and service: updated to commander 15. Command-line usage is unchanged.
- Service: updated to Express 5.2 and the latest `ws`, `ajv` and `cors`
  releases.

### Security

- Service: the dependency updates fix all known vulnerabilities in its
  runtime dependencies (Express and its `body-parser`, `qs` and
  `path-to-regexp`, as well as `ws` and `ajv`). `npm audit` reports no
  vulnerabilities for the repository.

### Development

- Node.js 24.21.0 (LTS) in `.nvmrc`.
- TypeScript 6.0, ESLint 10 with typed `eslint.config.mts` files, and typed
  `jest.config.ts` files.
- Tests are compiled with `@swc/jest` instead of `ts-jest`; `npm test` runs a
  separate type check of sources, tests and lint configs first.
- `tsx` replaces `ts-node` for the start/dev scripts.
- The profiling scripts in `packages/library/__perf__` use Node's built-in
  inspector instead of `v8-profiler-next`.

## [0.4.1] - 2026-09-28

### Fixed

#### Library (`@malte.muth/poker-hands`)

- Hands of the same type are compared correctly card by card. Previously, a
  higher card anywhere in the hand counted as better, so e.g. A-9-8-7-5 and
  A-K-4-3-2 could each beat the other, which skewed odds calculations.
- Ace-high straights with a paired J, Q or K (e.g. T-J-J-Q-K-A) are detected.
  They were evaluated as a pair, and a royal flush with such an extra card as
  a flush.
- `odds()` and `percentages()` work with a complete five-card board. They
  returned `NaN` chances because no board was evaluated.
- The progress callback always reports `1` at the end. Before, calculations
  whose size was not a multiple of 100 never reported completion, and those
  below 100 reported nothing.

#### CLI (`@malte.muth/poker-hands-cli`)

- The `poker-hands` executable works again. Since 0.4.0 it pointed at a module
  that only exported types, so it did nothing.
- Cards may be separated by spaces, e.g. `--board "2h 5d 9c"` or
  `percentages AhKh Qd Jd Ts`. Previously this failed with an error.

#### Service (`@malte.muth/poker-hands-service`)

- `POST /api/odds` returns correct results for requests with a board. The
  board cards were passed to the CLI as separate arguments, so all but the
  first were treated as additional players.
- The concurrency limit (`--max-requests`, default 5) is enforced. Each
  request previously got its own limiter, so there was no limit.

### Added

- The library exports the `OddsOptions` and `Hole` types, next to `HoleOdds`.
- A test setup for the CLI package, so `npm test` covers all packages.

### Changed

- Internal refactoring of the odds calculation: exhaustive and Monte Carlo
  share their types and winner detection. Results are unchanged.

## [0.4.0] - unreleased

Restructured into a monorepo with three packages. Not published to npm.

### Added

- Library: Monte Carlo odds calculation with 95% confidence intervals, and an
  `auto` mode (the default) that picks exhaustive or Monte Carlo depending on
  the number of possible boards.
- Library: optional options argument for `odds()` (`mode`, `threshold`,
  `sampleSize`) and a progress callback.
- CLI with `odds` and `percentages` commands, human-readable and JSON output,
  and JSON schemas for the output.
- HTTP service with `POST /api/odds`, a health check, CORS, a concurrency
  limit and an OpenAPI specification.

### Changed

- `odds()` defaults to `auto` mode. Calculations with more than 10,000
  possible boards (e.g. pre-flop) now use Monte Carlo sampling, so their
  results are approximate and vary slightly between runs. Pass
  `{ mode: "exhaustive" }` for the exact results of 0.3.1.

Versions up to 0.3.1 (June 2020) predate this changelog.

[0.10.0]: https://github.com/maltemuth/poker-hands/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/maltemuth/poker-hands/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/maltemuth/poker-hands/compare/v0.7.3...v0.8.0
[0.7.3]: https://github.com/maltemuth/poker-hands/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/maltemuth/poker-hands/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/maltemuth/poker-hands/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/maltemuth/poker-hands/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/maltemuth/poker-hands/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/maltemuth/poker-hands/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/maltemuth/poker-hands/compare/v0.3.1...v0.4.1
