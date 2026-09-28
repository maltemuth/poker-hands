import request from "supertest";
import { PokerHandsService } from "../../src/index";
import { executeCliCommand } from "../../src/utils";

// keep validation and formatting real, but control when the CLI "finishes"
jest.mock("../../src/utils", () => ({
  ...jest.requireActual("../../src/utils"),
  executeCliCommand: jest.fn(),
}));

const mockedExecute = executeCliCommand as jest.MockedFunction<
  typeof executeCliCommand
>;

const cliOutput = JSON.stringify({
  success: true,
  command: "odds",
  data: {
    players: [
      { holeCards: ["As", "Ah"], winChance: 0.8, tieChance: 0.01 },
      { holeCards: ["Ks", "Kh"], winChance: 0.19, tieChance: 0.01 },
    ],
  },
});

const body = {
  holes: [
    ["As", "Ah"],
    ["Ks", "Kh"],
  ],
};

// CLI calls still held when a test ends; released so no request outlives its test
let pending: Array<() => void> = [];

/** Every CLI invocation hangs until `release` is called. */
const holdCliCalls = () => {
  pending = [];
  mockedExecute.mockImplementation(
    () =>
      new Promise((resolve) => {
        pending.push(() => resolve(cliOutput));
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
  request(app).post("/api/odds").send(send).then((response) => response);

/** Status of a request expected to be answered without reaching the CLI; "held" if it got through. */
const statusWhileSaturated = (app: App) =>
  Promise.race([
    fire(app).then((response) => response.status),
    new Promise<string>((resolve) => setTimeout(() => resolve("held"), 500)),
  ]);

describe("Rate Limiting Integration", () => {
  beforeEach(() => {
    mockedExecute.mockReset();
  });

  afterEach(() => {
    pending.splice(0).forEach((resolve) => resolve());
  });

  it("rejects requests beyond the concurrency limit of the service", async () => {
    const app = new PokerHandsService(3000, true, 5).getApp();
    const cli = holdCliCalls();

    const inFlight = Array.from({ length: 5 }, () => fire(app));
    await waitFor(() => cli.started() === 5);

    expect(await statusWhileSaturated(app)).toBe(429);
    expect(mockedExecute).toHaveBeenCalledTimes(5);

    cli.release();
    const responses = await Promise.all(inFlight);
    responses.forEach((response) => expect(response.status).toBe(200));
  });

  it("frees slots once requests finish", async () => {
    const app = new PokerHandsService(3000, true, 2).getApp();
    const cli = holdCliCalls();

    const first = [fire(app), fire(app)];
    await waitFor(() => cli.started() === 2);
    expect(await statusWhileSaturated(app)).toBe(429);

    cli.release();
    await Promise.all(first);

    const next = fire(app);
    await waitFor(() => cli.started() === 1);
    cli.release();
    expect((await next).status).toBe(200);
  });

  it("frees slots for requests rejected by validation", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    holdCliCalls();

    for (let i = 0; i < 3; i++) {
      const invalid = await request(app)
        .post("/api/odds")
        .send({ holes: [["As", "Ah"]] });
      expect(invalid.status).toBe(400);
    }
  });

  it("allows health checks while saturated", async () => {
    const app = new PokerHandsService(3000, true, 1).getApp();
    const cli = holdCliCalls();

    const inFlight = fire(app);
    await waitFor(() => cli.started() === 1);

    const health = await request(app).get("/health");
    expect(health.status).toBe(200);

    cli.release();
    await inFlight;
  });

  it("keeps limits separate per service instance", async () => {
    const saturated = new PokerHandsService(3000, true, 1).getApp();
    const other = new PokerHandsService(3000, true, 1).getApp();
    const cli = holdCliCalls();

    const inFlight = fire(saturated);
    await waitFor(() => cli.started() === 1);

    expect(await statusWhileSaturated(other)).toBe("held");

    cli.release();
    expect((await inFlight).status).toBe(200);
  });
});
