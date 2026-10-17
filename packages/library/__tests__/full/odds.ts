import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertCloseTo } from "../helpers/assert.js";
import cards from "../../src/model/card/cards.js";
import odds from "../../src/model/odds/odds.js";

// tested against http://www.propokertools.com/simulations
describe("calculate odds", () => {
  it("equal value have equal win chance", () => {
    const results = odds([cards("Ah", "As"), cards("Ad", "Ac")]);

    assert.deepEqual(results[0].wins, results[1].wins);
    assert.deepEqual(results[0].ties, results[1].ties);
    assertCloseTo(results[0].winChance, 0.02, 1);
    assertCloseTo(results[0].tieChance, 0.96, 1);
  });

  it("pocket rockets versus double 10", () => {
    const results = odds([cards("Ah", "As"), cards("Td", "Tc")]);

    assertCloseTo(results[0].winChance, 0.8, 1);
    assertCloseTo(results[1].winChance, 0.2, 1);
  });
});
