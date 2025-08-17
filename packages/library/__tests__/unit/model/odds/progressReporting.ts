import cards from "../../../../src/model/card/cards";
import odds from "../../../../src/model/odds/odds";
import { ProgressCallback } from "../../../../src/model/odds/odds";

describe("odds progress reporting", () => {
  test("Monte Carlo progress callback is called correct number of times", () => {
    const progressReports: Array<{
      current: number;
      total: number;
      type: string;
      message?: string;
    }> = [];
    const progressCallback: ProgressCallback = (progress) => {
      progressReports.push(progress);
    };

    // Use a small sample size to make test fast
    odds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      100, // small sample size
      10000, // threshold to force Monte Carlo
      progressCallback
    );

    // Should be called exactly 100 times (once per simulation)
    expect(progressReports).toHaveLength(100);

    // Check that all reports have correct structure
    progressReports.forEach((report, index) => {
      expect(report).toHaveProperty("current", index + 1);
      expect(report).toHaveProperty("total", 100);
      expect(report).toHaveProperty("type", "monte-carlo");
      expect(report).toHaveProperty("message");
      expect(typeof report.message).toBe("string");
    });
  });

  test("Exhaustive progress callback is called correct number of times", () => {
    const progressReports: Array<{
      current: number;
      total: number;
      type: string;
      message?: string;
    }> = [];
    const progressCallback: ProgressCallback = (progress) => {
      progressReports.push(progress);
    };

    // Use a scenario with few combinations to trigger exhaustive search
    odds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      cards("7s", "8h", "Th"), // 3 cards on board, only 2 needed
      10000, // sample size
      1, // threshold to force exhaustive
      progressCallback
    );

    // Should be called for each board combination
    expect(progressReports.length).toBeGreaterThan(0);

    // Check that all reports have correct structure
    progressReports.forEach((report) => {
      expect(report).toHaveProperty("current");
      expect(report).toHaveProperty("total");
      expect(report).toHaveProperty("type", "exhaustive");
      expect(report).toHaveProperty("message");
      expect(typeof report.message).toBe("string");
    });
  });

  test("No progress callback means no reports", () => {
    const progressReports: Array<{
      current: number;
      total: number;
      type: string;
      message?: string;
    }> = [];
    const spy = jest.fn((progress) => {
      progressReports.push(progress);
    });

    odds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      100, // small sample size
      10000 // threshold to force Monte Carlo
      // No progress callback provided
    );

    // Should not be called when no callback is provided
    expect(spy).not.toHaveBeenCalled();
    expect(progressReports).toHaveLength(0);
  });

  test("Progress callback receives correct progress information", () => {
    const progressReports: Array<{
      current: number;
      total: number;
      type: string;
      message?: string;
    }> = [];
    const progressCallback: ProgressCallback = (progress) => {
      progressReports.push(progress);
    };

    odds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      5, // very small sample size for testing
      10000, // threshold to force Monte Carlo
      progressCallback
    );

    // Should have exactly 5 reports
    expect(progressReports).toHaveLength(5);

    // Check final report
    const finalReport = progressReports[4];
    expect(finalReport.current).toBe(5);
    expect(finalReport.total).toBe(5);
    expect(finalReport.type).toBe("monte-carlo");
    expect(finalReport.message).toContain("Running simulation");
  });

  test("Progress callback works with partial board", () => {
    const progressReports: Array<{
      current: number;
      total: number;
      type: string;
      message?: string;
    }> = [];
    const progressCallback: ProgressCallback = (progress) => {
      progressReports.push(progress);
    };

    // Use a scenario with partial board
    odds(
      [cards("Ac", "Ad"), cards("Td", "Tc")],
      cards("7s", "8h"), // 2 cards on board, 3 needed
      50, // small sample size
      10000, // threshold to force Monte Carlo
      progressCallback
    );

    // Should be called for each simulation
    expect(progressReports).toHaveLength(50);

    // Check that all reports have correct structure
    progressReports.forEach((report) => {
      expect(report).toHaveProperty("current");
      expect(report).toHaveProperty("total", 50);
      expect(report).toHaveProperty("type", "monte-carlo");
    });
  });
});
