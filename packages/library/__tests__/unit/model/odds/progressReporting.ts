import cards from "../../../../src/model/card/cards.js";
import odds, { ProgressCallback } from "../../../../src/model/odds/odds.js";

const collect = () => {
  const reports: number[] = [];
  const progress: ProgressCallback = (value) => reports.push(value);
  return { reports, progress };
};

const expectWellFormed = (reports: number[]) => {
  expect(reports.length).toBeGreaterThan(0);
  reports.forEach((value, index) => {
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThanOrEqual(1);
    if (index > 0) expect(value).toBeGreaterThanOrEqual(reports[index - 1]);
  });
  expect(reports[reports.length - 1]).toBe(1);
};

describe("odds progress reporting", () => {
  test("reports progress fractions ending at 1", () => {
    const { reports, progress } = collect();

    // C(45, 2) = 990 remaining boards, not a multiple of the reporting interval
    odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th"), {
      progress,
    });

    expectWellFormed(reports);
  });

  test("small calculations still report completion", () => {
    const { reports, progress } = collect();

    // only 44 river cards remain
    odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th", "2c"), {
      progress,
    });

    expect(reports).toEqual([1]);
  });

  test("no callback means no reports and no errors", () => {
    expect(() =>
      odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th"))
    ).not.toThrow();
  });
});
