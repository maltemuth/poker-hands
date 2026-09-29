/**
 * Benchmarks for the hand evaluation and the odds calculation, to compare
 * evaluator implementations on the same machine.
 *
 *   npm run bench              all cases
 *   npm run bench -- --quick   without exhaustive pre-flop
 *
 * Each case is measured in three rounds, and the two fastest are averaged.
 * Times are reported as wall-clock time and as CPU time; CPU time leaves out
 * the time other programs took, so it varies less on a busy machine.
 * Besides the time, each case reports its memory use: how much it allocates
 * per run, how many garbage collections run per run and how long they take,
 * and how far the heap grew at most. These come from V8's GC profiler.
 *
 * Random hands come from a seeded generator, so every run measures the same
 * hands. The results (win chances, hand type counts) are printed as well:
 * a faster evaluator has to reproduce them exactly.
 */
import { GCProfiler } from "node:v8";
import { Card } from "../src/model/card/Card.js";
import cards from "../src/model/card/cards.js";
import combinationCount from "../src/model/combinatorics/combinationCount.js";
import evaluate from "../src/model/hand/evaluate.js";
import getBestHand from "../src/model/hand/getBestHand.js";
import { HandType } from "../src/model/hand/Hand.js";
import exhaustive from "../src/model/odds/exhaustive.js";
import percentages, { HandPercentages } from "../src/model/odds/percentages.js";
import { Hole, HoleOdds } from "../src/model/odds/HoleOdds.js";
import { randomCards, seededRandom } from "../__tests__/helpers/randomCards.js";
import winningHoles from "../__tests__/helpers/winningHoles.js";

const quick = process.argv.includes("--quick");

/**
 * `count` deals of `size` distinct cards each
 */
const randomDeals = (count: number, size: number, seed: number): Card[][] => {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => randomCards(random, size));
};

interface Measurement {
  /** mean wall-clock time of one run */
  ms: number;
  /** mean CPU time of one run: without the time other programs took */
  cpuMs: number;
  /** bytes allocated per run */
  allocated: number;
  /** garbage collections per run */
  gcs: number;
  /** time spent in garbage collection per run */
  gcMs: number;
  /** how far the heap grew above its size at the start, at most */
  peakGrowth: number;
}

/**
 * Runs `run` repeatedly for at least `minTime` ms, but at least once, and
 * measures the mean duration and memory use of one run
 */
const measureRound = (run: () => void, minTime: number): Measurement => {
  const heapUsed = () => process.memoryUsage().heapUsed;
  const profiler = new GCProfiler();
  const startHeap = heapUsed();
  profiler.start();

  let runs = 0;
  const startCpu = process.cpuUsage();
  const start = performance.now();
  let elapsed;
  do {
    run();
    runs++;
    elapsed = performance.now() - start;
  } while (elapsed < minTime);
  const { user, system } = process.cpuUsage(startCpu);

  const endHeap = heapUsed();
  const statistics = profiler.stop()?.statistics ?? [];

  // what the heap grew by between collections is what was allocated
  let allocated = 0;
  let heap = startHeap;
  let peakHeap = Math.max(startHeap, endHeap);
  let gcMicroseconds = 0;
  for (const { cost, beforeGC, afterGC } of statistics) {
    allocated += beforeGC.heapStatistics.usedHeapSize - heap;
    peakHeap = Math.max(peakHeap, beforeGC.heapStatistics.usedHeapSize);
    heap = afterGC.heapStatistics.usedHeapSize;
    gcMicroseconds += cost;
  }
  allocated += endHeap - heap;

  return {
    ms: elapsed / runs,
    cpuMs: (user + system) / 1000 / runs,
    allocated: allocated / runs,
    gcs: statistics.length / runs,
    gcMs: gcMicroseconds / 1000 / runs,
    peakGrowth: peakHeap - startHeap,
  };
};

/**
 * Runs `run` once to warm up (unless it runs long anyway), then measures it
 * in three rounds of at least `minTime` ms each and averages the two fastest
 * rounds, so that a round disturbed by other load on the machine is left out.
 * Wall-clock and CPU time each come from their own two fastest rounds, the
 * memory use from the two fastest by wall-clock time.
 */
const measure = (
  run: () => void,
  minTime: number,
  warmUp = true
): Measurement => {
  if (warmUp) run();

  const rounds = [0, 1, 2].map(() => measureRound(run, minTime));
  const [first, second] = [...rounds].sort((a, b) => a.ms - b.ms);
  const [firstCpu, secondCpu] = [...rounds].sort((a, b) => a.cpuMs - b.cpuMs);
  const average = (key: keyof Measurement) => (first[key] + second[key]) / 2;

  return {
    ms: average("ms"),
    cpuMs: (firstCpu.cpuMs + secondCpu.cpuMs) / 2,
    allocated: average("allocated"),
    gcs: average("gcs"),
    gcMs: average("gcMs"),
    peakGrowth: Math.max(first.peakGrowth, second.peakGrowth),
  };
};

const format = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 1 });

const size = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${format(bytes / 1024)} KB`
    : `${format(bytes / 1024 / 1024)} MB`;

const report = (
  name: string,
  { ms, cpuMs, allocated, gcs, gcMs, peakGrowth }: Measurement,
  rate: string,
  result: string
) =>
  console.log(
    [
      name.padEnd(50),
      `${format(ms)} ms`.padStart(14),
      `${format(cpuMs)} ms`.padStart(12),
      rate.padStart(22),
      size(allocated).padStart(12),
      gcs.toFixed(2).padStart(9),
      `${format(gcMs)} ms`.padStart(11),
      size(peakGrowth).padStart(11),
      result,
    ].join("  ")
  );

const chances = (odds: HoleOdds[]) =>
  odds
    .map(
      ({ winChance, tieChance }) =>
        `${(winChance * 100).toFixed(3)}/${(tieChance * 100).toFixed(3)}`
    )
    .join(" vs ");

console.log(`Node ${process.version}${quick ? ", --quick" : ""}`);
console.log(
  [
    "case".padEnd(50),
    "wall/run".padStart(14),
    "CPU/run".padStart(12),
    "rate (CPU)".padStart(22),
    "alloc/run".padStart(12),
    "GCs/run".padStart(9),
    "GC/run".padStart(11),
    "peak heap+".padStart(11),
    "result",
  ].join("  ")
);

// hand evaluation: the best hand of random 7-card hands
{
  const hands = randomDeals(100_000, 7, 1);
  const counts: Record<string, number> = {};
  const measured = measure(() => {
    for (const hand of hands) getBestHand(hand);
  }, 1000);
  for (const hand of hands) {
    const best = getBestHand(hand);
    if (!best) continue;
    const type = HandType[best.type];
    counts[type] = (counts[type] ?? 0) + 1;
  }
  report(
    "getBestHand, 100k random 7-card hands",
    measured,
    `${format((hands.length / measured.cpuMs) * 1000)} hands/s`,
    `${counts.Pair} pairs, ${counts.Flush} flushes`
  );
}

// the same hands with evaluate, which computes a rank without a hand object
{
  const hands = randomDeals(100_000, 7, 1);
  const counts: Record<string, number> = {};
  const measured = measure(() => {
    for (const hand of hands) evaluate(hand);
  }, 1000);
  for (const hand of hands) {
    // the hand type is the rank's leading hex digit
    const type = HandType[evaluate(hand) >> 20];
    counts[type] = (counts[type] ?? 0) + 1;
  }
  report(
    "evaluate, 100k random 7-card hands",
    measured,
    `${format((hands.length / measured.cpuMs) * 1000)} hands/s`,
    `${counts.Pair} pairs, ${counts.Flush} flushes`
  );
}

// a showdown: both players' best hands and the winner, as in odds()
{
  const deals = randomDeals(100_000, 9, 2);
  const showdowns = deals.map((deal): [Hole[], Card[]] => [
    [deal.slice(0, 2), deal.slice(2, 4)],
    deal.slice(4),
  ]);
  const measured = measure(() => {
    for (const [holes, board] of showdowns) winningHoles(holes, board);
  }, 1000);
  const wins = showdowns.filter(
    ([holes, board]) => winningHoles(holes, board).join() === "0"
  ).length;
  report(
    "winningHoles, 100k heads-up showdowns",
    measured,
    `${format((showdowns.length / measured.cpuMs) * 1000)} showdowns/s`,
    `player 1 wins ${wins}`
  );
}

// complete odds calculations
const oddsCases: [string, Hole[], Card[], boolean][] = [
  [
    "exhaustive, heads-up, turn",
    [cards("Ah", "As"), cards("Td", "Tc")],
    cards("7c", "7d", "6s", "2h"),
    true,
  ],
  [
    "exhaustive, heads-up, flop",
    [cards("Ah", "As"), cards("Td", "Tc")],
    cards("7c", "7d", "6s"),
    true,
  ],
  [
    "exhaustive, 3 players, flop",
    [cards("Ah", "As"), cards("Td", "Tc"), cards("9s", "8s")],
    cards("7c", "7d", "6s"),
    true,
  ],
  [
    "exhaustive, heads-up, pre-flop",
    [cards("Ah", "As"), cards("Td", "Tc")],
    [],
    !quick,
  ],
  // the most evaluations of any pre-flop spot: boards times players
  [
    "exhaustive, 4 players, pre-flop",
    [
      cards("Ah", "As"),
      cards("Td", "Tc"),
      cards("9s", "8s"),
      cards("Kc", "Qd"),
    ],
    [],
    !quick,
  ],
];

for (const [name, holes, board, enabled] of oddsCases) {
  if (!enabled) continue;
  const boards = combinationCount(
    52 - holes.length * 2 - board.length,
    5 - board.length
  );
  let odds: HoleOdds[] = [];
  const long = boards > 100_000;
  const measured = measure(
    () => {
      odds = exhaustive(holes, board);
    },
    long ? 0 : 1000,
    !long
  );
  report(
    `${name} (${format(boards)} boards)`,
    measured,
    `${format((boards / measured.cpuMs) * 1000)} boards/s`,
    chances(odds)
  );
}

// hand type percentages of one hole, over every possible board
const percentagesCases: [string, Card[], Card[], boolean][] = [
  ["percentages, flop", cards("Ah", "Kh"), cards("Qh", "7c", "2d"), true],
  ["percentages, pre-flop", cards("Ah", "Kh"), [], !quick],
];

for (const [name, hole, board, enabled] of percentagesCases) {
  if (!enabled) continue;
  const boards = combinationCount(50 - board.length, 5 - board.length);
  let result: HandPercentages | undefined;
  const long = boards > 100_000;
  const measured = measure(
    () => {
      result = percentages(hole, board);
    },
    long ? 0 : 1000,
    !long
  );
  report(
    `${name} (${format(boards)} boards)`,
    measured,
    `${format((boards / measured.cpuMs) * 1000)} boards/s`,
    result ? `${result.pair.count} pairs, ${result.flush.count} flushes` : ""
  );
}
