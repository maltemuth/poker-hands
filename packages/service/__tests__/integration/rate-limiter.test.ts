import request from "supertest";
import { PokerHandsService } from "../../src/index";
import { runInWorker } from "../../src/odds/runInWorker";

// keep validation real, but control when a calculation "finishes"
jest.mock("../../src/odds/runInWorker", () => ({
  ...jest.requireActual("../../src/odds/runInWorker"),
  runInWorker: jest.fn(),
}));

const mockedCalculate = runInWorker as jest.MockedFunction<typeof runInWorker>;

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

/** Every calculation hangs until `release` is called. */
const holdCalculations = () => {
  pending = [];
  mockedCalculate.mockImplementation(
    () =>
      new Promise((resolve) => {
        pending.push(() => resolve(odds));
      })
  );
  return {
    started: () => pending.length,
    release: () => pending.splice(0).forEach((resolve) => resolve()),
  };
};

const waitFor = async (condition: () => boolean) => {
  for (let i = 0; i < 200 && !condition(); i++) {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  expect(condition()).toBe(true);
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
    mockedCalculate.mockReset();
  });

  afterEach(() => {
    pending.splice(0).forEach((resolve) => resolve());
  });

  it("rejects requests beyond the concurrency limit of the service", async () => {
    const app = new PokerHandsService(3000, true, 5).getApp();
    const calculations = holdCalculations();

    const inFlight = Array.from({ length: 5 }, () => fire(app));
    await waitFor(() => calculations.started() === 5);

    expect(await statusWhileSaturated(app)).toBe(429);
    expect(mockedCalculate).toHaveBeenCalledTimes(5);

    calculations.release();
    const responses = await Promise.all(inFlight);
    responses.forEach((response) => expect(response.status).toBe(200));
  });

  it("frees slots once requests finish", async () => {
    const app = new PokerHandsService(3000, true, 2).getApp();
    const calculations = holdCalculations();

    const first = [fire(app), fire(app)];
    await waitFor(() => calculations.started() === 2);
    expect(await statusWhileSaturated(app)).toBe(429);

    calculations.release();
    await Promise.all(first);

    const next = fire(app);
    await waitFor(() => calculations.started() === 1);
    calculations.release();
    expect((await next).status).toBe(200);
  });

  it("frees slots for requests rejected by validation", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    holdCalculations();

    for (let i = 0; i < 3; i++) {
      const invalid = await request(app)
        .post("/api/odds")
        .send({ holes: [["As", "Ah"]] });
      expect(invalid.status).toBe(400);
    }
  });

  it("allows health checks while saturated", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    const calculations = holdCalculations();

    const inFlight = fire(app);
    await waitFor(() => calculations.started() === 1);

    const health = await request(app).get("/health");
    expect(health.status).toBe(200);

    calculations.release();
    await inFlight;
  });

  it("keeps the slot while an abandoned calculation is still running", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    const calculations = holdCalculations();

    // the client gives up, but the calculation keeps running
    const abandoned = request(app)
      .post("/api/odds")
      .send(body)
      .timeout(100)
      .catch(() => "aborted");
    await waitFor(() => calculations.started() === 1);
    expect(await abandoned).toBe("aborted");

    expect(await statusWhileSaturated(app)).toBe(429);

    calculations.release();
    const next = fire(app);
    await waitFor(() => calculations.started() === 1);
    calculations.release();
    expect((await next).status).toBe(200);
  });

  it("keeps limits separate per service instance", async () => {
    const saturated = new PokerHandsService(3000, true, 1).getApp();
    const other = new PokerHandsService(3000, true, 1).getApp();
    const calculations = holdCalculations();

    const inFlight = fire(saturated);
    await waitFor(() => calculations.started() === 1);

    expect(await statusWhileSaturated(other)).toBe("held");

    calculations.release();
    expect((await inFlight).status).toBe(200);
  });
});
