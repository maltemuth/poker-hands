import assert from "node:assert/strict";
import { describe, it } from "node:test";
import cards from "../../../../src/model/card/cards.js";
import odds, { ProgressCallback } from "../../../../src/model/odds/odds.js";

const collect = () => {
  const reports: number[] = [];
  const progress: ProgressCallback = (value) => reports.push(value);
  return { reports, progress };
};

const expectWellFormed = (reports: number[]) => {
  assert.ok(reports.length > 0);
  reports.forEach((value, index) => {
    assert.ok(value > 0);
    assert.ok(value <= 1);
    if (index > 0) assert.ok(value >= reports[index - 1]);
  });
  assert.equal(reports[reports.length - 1], 1);
};

describe("odds progress reporting", () => {
  it("reports progress fractions ending at 1", () => {
    const { reports, progress } = collect();

    // C(45, 2) = 990 remaining boards, not a multiple of the reporting interval
    odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th"), {
      progress,
    });

    expectWellFormed(reports);
  });

  it("small calculations still report completion", () => {
    const { reports, progress } = collect();

    // only 44 river cards remain
    odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th", "2c"), {
      progress,
    });

    assert.deepEqual(reports, [1]);
  });

  it("no callback means no reports and no errors", () => {
    assert.doesNotThrow(() =>
      odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th"))
    );
  });
});
