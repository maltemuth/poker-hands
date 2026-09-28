# Changelog

All notable changes to the packages in this repository are documented here.
The library, CLI and service are versioned together.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.4.1]: https://github.com/malte-muth/poker-hands/compare/v0.3.1...v0.4.1
