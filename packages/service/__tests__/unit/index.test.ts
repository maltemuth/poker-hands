import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import request from "supertest";
import { PokerHandsService } from "../../src/index.js";

// The service's setup, seen through its app: CORS, the body limit and the routes
describe("PokerHandsService", () => {
  describe("constructor", () => {
    it("should setup CORS middleware", async () => {
      const response = await request(new PokerHandsService().getApp()).get(
        "/health"
      );
      assert.equal(response.headers["access-control-allow-origin"], "*");
    });

    it("should leave CORS out when disabled", async () => {
      const response = await request(
        new PokerHandsService(3000, false).getApp()
      ).get("/health");
      assert.equal(response.headers["access-control-allow-origin"], undefined);
    });

    it("should setup JSON middleware with limit", async () => {
      // Express logs the rejected body's error outside NODE_ENV=test
      const error = mock.method(console, "error", () => {});
      try {
        const response = await request(new PokerHandsService().getApp())
          .post("/api/odds")
          .send({ padding: "x".repeat(1024) });
        assert.equal(response.status, 413);
      } finally {
        error.mock.restore();
      }
    });

    it("should setup routes", async () => {
      const app = new PokerHandsService().getApp();
      // validation middleware, then the handler
      for (const path of ["/api/odds", "/api/percentages"]) {
        const response = await request(app).post(path).send({});
        assert.equal(response.status, 400);
      }
      assert.equal((await request(app).get("/health")).status, 200);
    });
  });

  describe("start", () => {
    it("should start the server on specified port, and log it", () => {
      const service = new PokerHandsService(3000);
      const listen = mock.method(
        service.getApp(),
        "listen",
        (_port: number, callback: () => void) => callback()
      );
      const log = mock.method(console, "log", () => {});
      try {
        service.start();
        assert.equal(listen.mock.callCount(), 1);
        assert.equal(listen.mock.calls[0].arguments[0], 3000);
        assert.deepEqual(log.mock.calls[0].arguments, [
          "Poker Hands Service running on port 3000",
        ]);
      } finally {
        log.mock.restore();
      }
    });
  });

  describe("getApp", () => {
    it("should return the express app", () => {
      const service = new PokerHandsService();
      assert.equal(service.getApp(), service.getApp());
      assert.equal(typeof service.getApp().listen, "function");
    });
  });
});

describe("Direct execution", () => {
  // import.meta.main can't be set from a test; this needs an integration test
  it.todo("should start service when run directly");
});
