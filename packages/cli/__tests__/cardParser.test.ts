import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCards } from "../src/utils/cardParser.js";
import { cards } from "@malte.muth/poker-hands";

describe("parseCards", () => {
  it("parses concatenated cards", () => {
    assert.deepEqual(parseCards("AhKd2c"), cards("Ah", "Kd", "2c"));
  });

  it("parses cards separated by whitespace", () => {
    assert.deepEqual(parseCards("Ah Kd  2c"), cards("Ah", "Kd", "2c"));
    assert.deepEqual(parseCards(" Ah\tKd "), cards("Ah", "Kd"));
  });

  it("parses an empty or blank input as no cards", () => {
    assert.deepEqual(parseCards(""), []);
    assert.deepEqual(parseCards("  "), []);
  });

  it("rejects anything that is not a card", () => {
    assert.throws(() => parseCards("AhXx"));
    assert.throws(() => parseCards("Ah, Kd"));
  });
});
