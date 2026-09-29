import { Response } from "express";
import { sendError } from "../../../src/utils/index.js";

describe("sendError", () => {
  it("should send the message as a JSON string with the status", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    sendError(res, 429, "Too many concurrent requests");

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith("Too many concurrent requests");
  });
});
