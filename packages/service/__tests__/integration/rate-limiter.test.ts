import request from "supertest";
import { PokerHandsService } from "../../src/index";

describe("Rate Limiting Integration", () => {
  let service: PokerHandsService;

  beforeAll(() => {
    service = new PokerHandsService();
  });

  afterAll(() => {
    // Note: In a real test setup, you might want to close the server
    // For now, we'll just let the process exit naturally
  });

  it("should handle concurrent requests correctly", async () => {
    const app = service.getApp();

    // Create multiple requests simultaneously
    const requests = Array.from({ length: 6 }, () =>
      request(app)
        .post("/api/odds")
        .send({
          holes: [
            ["As", "Ah"],
            ["Ks", "Kh"],
          ],
          board: ["Ts", "9s", "8s"],
        })
    );

    const responses = await Promise.all(requests);

    // Should have 5 successful responses and 1 rejected
    const successful = responses.filter((r) => r.status < 429);
    const rejected = responses.filter((r) => r.status === 429);

    expect(successful).toHaveLength(5);
    expect(rejected).toHaveLength(1);
  }, 30000);

  it("should allow health check requests even when rate limited", async () => {
    const app = service.getApp();

    // First, use up all 5 concurrent requests
    const requests = Array.from({ length: 5 }, () =>
      request(app)
        .post("/api/odds")
        .send({
          holes: [["As", "Ah"]],
          board: [],
        })
    );

    await Promise.all(requests);

    // Health check should still work
    const healthResponse = await request(app).get("/health");
    expect(healthResponse.status).toBe(200);
  });

  it("should return simple string for rejected responses", async () => {
    const app = service.getApp();

    // Create 6 requests simultaneously
    const requests = Array.from({ length: 6 }, () =>
      request(app)
        .post("/api/odds")
        .send({
          holes: [
            ["As", "Ah"],
            ["Ks", "Kh"],
          ],
          board: [],
        })
    );

    const responses = await Promise.all(requests);

    // Should have 5 successful responses and 1 rejected
    const successful = responses.filter((r) => r.status !== 429);
    const rejected = responses.filter((r) => r.status === 429);

    expect(successful).toHaveLength(5);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].body).toBe("Too many concurrent requests");
  }, 30000);

  it("should handle mixed request types correctly", async () => {
    const app = service.getApp();

    // Create 6 requests simultaneously (5 POST + 1 GET)
    const requests = [
      request(app)
        .post("/api/odds")
        .send({ holes: [["As", "Ah"]], board: [] }), // 1
      request(app)
        .post("/api/odds")
        .send({ holes: [["Ks", "Kh"]], board: [] }), // 2
      request(app)
        .post("/api/odds")
        .send({ holes: [["Qs", "Qh"]], board: [] }), // 3
      request(app)
        .post("/api/odds")
        .send({ holes: [["Js", "Jh"]], board: [] }), // 4
      request(app)
        .post("/api/odds")
        .send({ holes: [["Ts", "Th"]], board: [] }), // 5
      request(app).get("/health"), // 6 - should be allowed (GET)
    ];

    const responses = await Promise.all(requests);

    // Should have 6 successful responses (5 POST + 1 GET) because they're all sent simultaneously
    const rejected = responses.filter((r) => r.status === 429);
    const successful = responses.filter((r) => r.status !== 429);

    expect(rejected).toHaveLength(0);
    expect(successful).toHaveLength(6);
  }, 30000);
});
