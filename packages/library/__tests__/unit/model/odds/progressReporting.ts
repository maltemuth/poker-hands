import cards from "../../../../src/model/card/cards";
import odds, { ProgressCallback } from "../../../../src/model/odds/odds";

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
};

describe("odds progress reporting", () => {
  test("Monte Carlo reports progress fractions", () => {
    const { reports, progress } = collect();

    odds([cards("Ah", "As"), cards("Td", "Tc")], [], {
      mode: "monteCarlo",
      sampleSize: 1000,
      progress,
    });

    expectWellFormed(reports);
    // reported every 100 simulations
    expect(reports).toHaveLength(10);
    expect(reports[reports.length - 1]).toBe(1);
  });

  test("exhaustive reports progress fractions", () => {
    const { reports, progress } = collect();

    // C(45, 2) = 990 remaining boards
    odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7s", "8h", "Th"), {
      mode: "exhaustive",
      progress,
    });

    expectWellFormed(reports);
  });

  test("auto mode forwards the callback to Monte Carlo", () => {
    const { reports, progress } = collect();

    odds([cards("Ac", "Ad"), cards("Td", "Tc")], cards("7s", "8h"), {
      mode: "auto",
      threshold: 200,
      progress,
    });

    expectWellFormed(reports);
  });

  test("no callback means no reports and no errors", () => {
    expect(() =>
      odds([cards("Ah", "As"), cards("Td", "Tc")], [], {
        mode: "monteCarlo",
        sampleSize: 100,
      })
    ).not.toThrow();
  });
});
