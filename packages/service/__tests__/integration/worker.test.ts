import { execFileSync } from "node:child_process";
import { join } from "node:path";
import request from "supertest";
import { PokerHandsService } from "../../src/index";
import { runInWorker, CalculationError } from "../../src/odds/runInWorker";

describe("odds worker", () => {
  // the worker runs outside of Jest and loads the library's build output
  beforeAll(() => {
    execFileSync("npm", ["run", "build"], {
      cwd: join(__dirname, "../../../library"),
      stdio: "ignore",
    });
  }, 120000);

  it("calculates the odds in a worker thread", async () => {
    await expect(
      runInWorker({
        holes: [
          ["As", "Kd"],
          ["Ah", "9c"],
        ],
        board: ["8c", "7d", "5h", "3s", "2c"],
      })
    ).resolves.toEqual({
      players: [
        { holeCards: ["As", "Kd"], winChance: 1, tieChance: 0 },
        { holeCards: ["Ah", "9c"], winChance: 0, tieChance: 0 },
      ],
    });
  }, 30000);

  it("reports cards the library rejects as a CalculationError", async () => {
    await expect(
      runInWorker({
        holes: [
          ["Ah", "As"],
          ["Ah", "Kh"],
        ],
      })
    ).rejects.toBeInstanceOf(CalculationError);
  }, 30000);

  it("keeps the service responsive during a long calculation", async () => {
    const app = new PokerHandsService(3000, true, 5).getApp();

    let calculated = false;
    const calculation = request(app)
      .post("/api/odds")
      .send({
        holes: [
          ["Ah", "As"],
          ["Kd", "Kh"],
        ],
        options: { mode: "monteCarlo", sampleSize: 100000 },
      })
      .then((response) => {
        calculated = true;
        return response;
      });

    await new Promise((resolve) => setTimeout(resolve, 200));
    const health = await request(app).get("/health");

    expect(health.status).toBe(200);
    expect(calculated).toBe(false);
    expect((await calculation).status).toBe(200);
  }, 60000);
});
