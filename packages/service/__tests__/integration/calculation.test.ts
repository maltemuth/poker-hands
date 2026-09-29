import request from "supertest";
import { PokerHandsService } from "../../src/index";

// the whole service with the real library: validation, calculation, response
describe("calculations", () => {
  const app = new PokerHandsService(3000, true, 5).getApp();

  it("calculates the odds", async () => {
    const response = await request(app)
      .post("/api/odds")
      .send({
        holes: [
          ["As", "Kd"],
          ["Ah", "9c"],
        ],
        board: ["8c", "7d", "5h", "3s", "2c"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      players: [
        { holeCards: ["As", "Kd"], winChance: 1, tieChance: 0 },
        { holeCards: ["Ah", "9c"], winChance: 0, tieChance: 0 },
      ],
    });
  });

  it("answers cards the library rejects with 400", async () => {
    const response = await request(app)
      .post("/api/odds")
      .send({
        holes: [
          ["As", "Kd"],
          ["As", "9c"],
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatch(/Duplicates found/);
  });

  it("calculates percentages", async () => {
    const response = await request(app)
      .post("/api/percentages")
      .send({ holes: [["Ah", "Kh"]], board: ["Qh", "Jh", "2c", "3d"] });

    expect(response.status).toBe(200);
    expect(response.body.players[0].percentages.royalFlush).toEqual({
      count: 1,
      percentage: 1 / 46,
    });
  });
});
