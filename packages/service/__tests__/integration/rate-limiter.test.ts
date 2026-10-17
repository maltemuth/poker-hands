import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach, mock } from "node:test";
import request from "supertest";
import { PokerHandsService } from "../../src/index.js";
import { handlers } from "../../src/routes/handlers.js";

const odds = {
  players: [
    { holeCards: ["As", "Ah"], winChance: 0.8, tieChance: 0.01 },
    { holeCards: ["Ks", "Kh"], winChance: 0.19, tieChance: 0.01 },
  ],
};

const body = {
  holes: [
    ["As", "Ah"],
    ["Ks", "Kh"],
  ],
};

// calculations still held when a test ends; released so no request outlives its test
let pending: Array<() => void> = [];

// keep validation real, but control when a calculation "finishes": the service
// calculates synchronously; the mock returns promises instead, so that the test
// can hold calculations open and fill the slots. Services take their handlers
// when they're created, so the mock is in place before any is.
const mockedCalculate = mock.method(
  handlers,
  "calculateOdds",
  () =>
    new Promise<typeof odds>((resolve) => {
      pending.push(() => resolve(odds));
    })
);

/** Every calculation hangs until `release` is called. */
const holdCalculations = () => {
  pending = [];
  return {
    started: () => pending.length,
    release: () => pending.splice(0).forEach((resolve) => resolve()),
  };
};

const waitFor = async (condition: () => boolean) => {
  for (let i = 0; i < 200 && !condition(); i++) {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.equal(condition(), true);
};

type App = ReturnType<PokerHandsService["getApp"]>;

/** Fires a request without awaiting it, so it stays in flight. */
const fire = (app: App, send = body) =>
  request(app)
    .post("/api/odds")
    .send(send)
    .then((response) => response);

/** Status of a request expected to be answered without calculating; "held" if it got through. */
const statusWhileSaturated = (app: App) =>
  Promise.race([
    fire(app).then((response) => response.status),
    new Promise<string>((resolve) => setTimeout(() => resolve("held"), 500)),
  ]);

describe("Rate Limiting Integration", () => {
  beforeEach(() => {
    mockedCalculate.mock.resetCalls();
  });

  afterEach(() => {
    pending.splice(0).forEach((resolve) => resolve());
  });

  it("rejects requests beyond the concurrency limit of the service", async () => {
    const app = new PokerHandsService(3000, true, 5).getApp();
    const calculations = holdCalculations();

    const inFlight = Array.from({ length: 5 }, () => fire(app));
    await waitFor(() => calculations.started() === 5);

    assert.equal(await statusWhileSaturated(app), 429);
    assert.equal(mockedCalculate.mock.callCount(), 5);

    calculations.release();
    const responses = await Promise.all(inFlight);
    responses.forEach((response) => assert.equal(response.status, 200));
  });

  it("frees slots once requests finish", async () => {
    const app = new PokerHandsService(3000, true, 2).getApp();
    const calculations = holdCalculations();

    const first = [fire(app), fire(app)];
    await waitFor(() => calculations.started() === 2);
    assert.equal(await statusWhileSaturated(app), 429);

    calculations.release();
    await Promise.all(first);

    const next = fire(app);
    await waitFor(() => calculations.started() === 1);
    calculations.release();
    assert.equal((await next).status, 200);
  });

  it("frees slots for requests rejected by validation", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    holdCalculations();

    for (let i = 0; i < 3; i++) {
      const invalid = await request(app)
        .post("/api/odds")
        .send({ holes: [["As", "Ah"]] });
      assert.equal(invalid.status, 400);
    }
  });

  it("allows health checks while saturated", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    const calculations = holdCalculations();

    const inFlight = fire(app);
    await waitFor(() => calculations.started() === 1);

    const health = await request(app).get("/health");
    assert.equal(health.status, 200);

    calculations.release();
    await inFlight;
  });

  it("keeps limits separate per service instance", async () => {
    const saturated = new PokerHandsService(3000, true, 1).getApp();
    const other = new PokerHandsService(3000, true, 1).getApp();
    const calculations = holdCalculations();

    const inFlight = fire(saturated);
    await waitFor(() => calculations.started() === 1);

    assert.equal(await statusWhileSaturated(other), "held");

    calculations.release();
    assert.equal((await inFlight).status, 200);
  });
});
