/**
 * Benchmarks for the hand evaluation and the odds calculation, to compare
 * evaluator implementations on the same machine.
 *
 *   npm run bench              all cases
 *   npm run bench -- --quick   without exhaustive pre-flop (about a minute)
 *
 * Random hands come from a seeded generator, so every run measures the same
 * hands. The results (win chances, hand type counts) are printed as well:
 * a faster evaluator has to reproduce them exactly.
 */
import { Card } from "../src/model/card/Card";
import cards from "../src/model/card/cards";
import combinationCount from "../src/model/combinatorics/combinationCount";
import create from "../src/model/deck/create";
import getBestHand from "../src/model/hand/getBestHand";
import { HandType } from "../src/model/hand/Hand";
import exhaustive from "../src/model/odds/exhaustive";
import monteCarloOdds from "../src/model/odds/monteCarloOdds";
import winningHoles from "../src/model/odds/winningHoles";
import { Hole, HoleOdds } from "../src/model/odds/HoleOdds";

const quick = process.argv.includes("--quick");

/**
 * mulberry32: a small seeded generator, so runs are reproducible
 */
const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * `count` deals of `size` distinct cards each
 */
const randomDeals = (count: number, size: number, seed: number): Card[][] => {
  const random = seededRandom(seed);
  const deck = create();
  return Array.from({ length: count }, () => {
    const cards = [...deck];
    // partial Fisher-Yates: the first `size` cards are a random draw
    for (let i = 0; i < size; i++) {
      const j = i + Math.floor(random() * (cards.length - i));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards.slice(0, size);
  });
};

/**
 * Runs `run` once to warm up (unless it runs long anyway), then repeatedly
 * for at least `minTime` ms, but at least once, and returns the mean
 * duration of one run in ms
 */
const measure = (run: () => void, minTime: number, warmUp = true): number => {
  if (warmUp) run();
  let runs = 0;
  const start = performance.now();
  let elapsed;
  do {
    run();
    runs++;
    elapsed = performance.now() - start;
  } while (elapsed < minTime);
  return elapsed / runs;
};

const format = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 1 });

const report = (name: string, ms: number, rate: string, result: string) =>
  console.log(
    `${name.padEnd(50)} ${format(ms).padStart(11)} ms  ${rate.padStart(
      22
    )}  ${result}`
  );

const chances = (odds: HoleOdds[]) =>
  odds
    .map(
      ({ winChance, tieChance }) =>
        `${(winChance * 100).toFixed(3)}/${(tieChance * 100).toFixed(3)}`
    )
    .join(" vs ");

console.log(
  `Node ${process.version}${quick ? ", --quick" : ""}\n` +
    `${"case".padEnd(50)} ${"per run".padStart(14)}  ${"rate".padStart(
      22
    )}  result`
);

// hand evaluation: the best hand of random 7-card hands
{
  const hands = randomDeals(100_000, 7, 1);
  const counts: Record<string, number> = {};
  const ms = measure(() => {
    for (const hand of hands) getBestHand(hand);
  }, 3000);
  for (const hand of hands) {
    const best = getBestHand(hand);
    if (!best) continue;
    const type = HandType[best.type];
    counts[type] = (counts[type] ?? 0) + 1;
  }
  report(
    "getBestHand, 100k random 7-card hands",
    ms,
    `${format((hands.length / ms) * 1000)} hands/s`,
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
  const ms = measure(() => {
    for (const [holes, board] of showdowns) winningHoles(holes, board);
  }, 3000);
  const wins = showdowns.filter(
    ([holes, board]) => winningHoles(holes, board).join() === "0"
  ).length;
  report(
    "winningHoles, 100k heads-up showdowns",
    ms,
    `${format((showdowns.length / ms) * 1000)} showdowns/s`,
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
];

for (const [name, holes, board, enabled] of oddsCases) {
  if (!enabled) continue;
  const boards = combinationCount(
    52 - holes.length * 2 - board.length,
    5 - board.length
  );
  let odds: HoleOdds[] = [];
  const long = boards > 100_000;
  const ms = measure(
    () => {
      odds = exhaustive(holes, board);
    },
    long ? 0 : 3000,
    !long
  );
  report(
    `${name} (${format(boards)} boards)`,
    ms,
    `${format((boards / ms) * 1000)} boards/s`,
    chances(odds)
  );
}

{
  // Monte Carlo draws with Math.random, so its result varies between runs
  const ms = measure(
    () => monteCarloOdds([cards("Ah", "As"), cards("Td", "Tc")], [], 10_000),
    3000
  );
  report(
    "monte carlo, heads-up, pre-flop, 10k",
    ms,
    `${format((10_000 / ms) * 1000)} boards/s`,
    ""
  );
}
